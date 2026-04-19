import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  RIALTO_BUSINESS_ID,
  RIALTO_CARD_ID,
  RIALTO_SPIN_WHEEL_ID,
  rialtoCorsHeaders,
} from "@/lib/rialtoConstants";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: rialtoCorsHeaders(req.headers.get("origin")),
  });
}

type Segment = {
  label: string;
  color?: string;
  probability?: number;
};

/**
 * POST /api/rialto/loyalty/spin
 * Body: { phone, first_name? }
 *
 * Lance un spin côté serveur (décision random pondérée par probability).
 * Enregistre dans spin_entries + spin_results. Empêche les spins multiples
 * selon la frequency du wheel.
 */
export async function POST(req: NextRequest) {
  const headers = rialtoCorsHeaders(req.headers.get("origin"));
  const body = (await req.json().catch(() => null)) as {
    phone?: string;
    first_name?: string;
  } | null;

  if (!body?.phone?.trim()) {
    return NextResponse.json(
      { error: "phone requis" },
      { status: 400, headers },
    );
  }

  const admin = createAdminClient();
  const phone = body.phone.trim();

  const { data: wheel } = await admin
    .from("spin_wheels")
    .select("id, segments, frequency, is_active, require_google_review")
    .eq("id", RIALTO_SPIN_WHEEL_ID)
    .maybeSingle();

  if (!wheel || !wheel.is_active) {
    return NextResponse.json(
      { error: "La roue n'est pas active actuellement." },
      { status: 409, headers },
    );
  }

  // Si la roue exige un avis Google, vérifier qu'un claim actif existe
  if (wheel.require_google_review) {
    // Retrouve le customer_id depuis la carte Rialto liée à ce phone
    const { data: cards } = await admin
      .from("customer_cards")
      .select("customer_id, customers!inner (phone)")
      .eq("card_id", RIALTO_CARD_ID)
      .eq("customers.phone", phone)
      .limit(1);
    const customerId =
      Array.isArray(cards) && cards.length > 0
        ? (cards[0].customer_id as string)
        : null;

    if (!customerId) {
      return NextResponse.json(
        {
          error: "Aucune carte fidélité trouvée pour ce numéro.",
          requires_review: true,
        },
        { status: 403, headers },
      );
    }

    const { data: claim } = await admin
      .from("google_review_claims")
      .select("id, expires_at")
      .eq("customer_id", customerId)
      .eq("business_id", RIALTO_BUSINESS_ID)
      .gt("expires_at", new Date().toISOString())
      .limit(1)
      .maybeSingle();

    if (!claim) {
      return NextResponse.json(
        {
          error: "Laissez un avis Google pour débloquer votre tour.",
          requires_review: true,
          customer_id: customerId,
        },
        { status: 403, headers },
      );
    }
  }

  // Vérif fréquence
  const { data: lastEntry } = await admin
    .from("spin_entries")
    .select("last_spin_at, reward_won")
    .eq("wheel_id", RIALTO_SPIN_WHEEL_ID)
    .eq("phone", phone)
    .order("last_spin_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastEntry) {
    const freq = wheel.frequency as string;
    const since =
      Date.now() - new Date(lastEntry.last_spin_at as string).getTime();
    const blocked =
      freq === "once"
        ? true
        : freq === "daily"
          ? since < 24 * 60 * 60 * 1000
          : freq === "weekly"
            ? since < 7 * 24 * 60 * 60 * 1000
            : freq === "monthly"
              ? since < 30 * 24 * 60 * 60 * 1000
              : true;
    if (blocked) {
      return NextResponse.json(
        {
          error:
            freq === "once"
              ? "Vous avez déjà utilisé votre spin."
              : `Prochain spin disponible plus tard (${freq}).`,
        },
        { status: 409, headers },
      );
    }
  }

  // Tire un segment pondéré
  const segments = Array.isArray(wheel.segments)
    ? (wheel.segments as Segment[])
    : [];
  if (segments.length === 0) {
    return NextResponse.json(
      { error: "Aucun segment configuré pour la roue." },
      { status: 409, headers },
    );
  }

  const totalWeight = segments.reduce(
    (s, seg) => s + (seg.probability ?? 1),
    0,
  );
  let pick = Math.random() * totalWeight;
  let chosenIndex = 0;
  for (let i = 0; i < segments.length; i++) {
    const w = segments[i].probability ?? 1;
    if (pick < w) {
      chosenIndex = i;
      break;
    }
    pick -= w;
  }
  const chosen = segments[chosenIndex];

  // Save
  await admin.from("spin_entries").insert({
    wheel_id: RIALTO_SPIN_WHEEL_ID,
    phone,
    last_spin_at: new Date().toISOString(),
    reward_won: chosen.label,
  });
  await admin.from("spin_results").insert({
    wheel_id: RIALTO_SPIN_WHEEL_ID,
    first_name: body.first_name ?? "Client",
    phone,
    reward: chosen.label,
  });

  // Code de récompense lisible
  const code = `RIALTO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  return NextResponse.json(
    {
      ok: true,
      segment_index: chosenIndex,
      reward: chosen.label,
      color: chosen.color ?? null,
      total_segments: segments.length,
      code,
    },
    { headers },
  );
}
