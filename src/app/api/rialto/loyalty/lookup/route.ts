import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  RIALTO_BUSINESS_ID,
  RIALTO_CARD_ID,
  RIALTO_LOTTERY_ID,
  RIALTO_RESTAURANT_ID,
  RIALTO_SPIN_WHEEL_ID,
  rialtoCorsHeaders,
} from "@/lib/rialtoConstants";
import { normalizePhone } from "@/lib/phone";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: rialtoCorsHeaders(req.headers.get("origin")),
  });
}

/**
 * GET /api/rialto/loyalty/lookup?phone=+41...
 * Retourne la carte fidélité + roue + loterie + orders pour ce téléphone.
 * Réponse 200 avec customer: null si aucune carte n'existe encore.
 */
export async function GET(req: NextRequest) {
  const headers = rialtoCorsHeaders(req.headers.get("origin"));
  const url = new URL(req.url);
  const phoneRaw = url.searchParams.get("phone")?.trim();
  if (!phoneRaw) {
    return NextResponse.json(
      { error: "phone requis" },
      { status: 400, headers },
    );
  }
  // Normalise en E.164 pour matcher quelle que soit la façon de saisir
  const phone = normalizePhone(phoneRaw) ?? phoneRaw;

  const admin = createAdminClient();

  // 1) Lookup carte client pour le programme Rialto
  const { data: cards } = await admin
    .from("customer_cards")
    .select(
      "id, customer_id, current_stamps, rewards_claimed, qr_code_value, customers!inner (id, first_name, last_name, phone, email)",
    )
    .eq("card_id", RIALTO_CARD_ID)
    .eq("customers.phone", phone)
    .limit(1);

  const card = Array.isArray(cards) && cards.length > 0 ? cards[0] : null;

  // Seuil (stamps_required)
  const { data: loyalty } = await admin
    .from("loyalty_cards")
    .select("stamps_required, reward_description, card_name")
    .eq("id", RIALTO_CARD_ID)
    .single();

  // 2) Spin wheel
  const { data: wheel } = await admin
    .from("spin_wheels")
    .select("id, segments, frequency, is_active, require_google_review")
    .eq("id", RIALTO_SPIN_WHEEL_ID)
    .maybeSingle();

  // 2b) Business : place_id pour le deep-link Google + claim actif
  const { data: business } = await admin
    .from("businesses")
    .select("google_place_id")
    .eq("id", RIALTO_BUSINESS_ID)
    .maybeSingle();

  let activeClaim: { id: string; expires_at: string } | null = null;
  if (card) {
    const { data: claim } = await admin
      .from("google_review_claims")
      .select("id, expires_at")
      .eq("customer_id", card.customer_id)
      .eq("business_id", RIALTO_BUSINESS_ID)
      .gt("expires_at", new Date().toISOString())
      .order("claimed_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (claim) {
      activeClaim = {
        id: claim.id as string,
        expires_at: claim.expires_at as string,
      };
    }
  }

  const { data: wheelRewards } = await admin
    .from("spin_rewards")
    .select("id, label, probability, color")
    .eq("wheel_id", RIALTO_SPIN_WHEEL_ID);

  let canSpin = false;
  let lastSpinReward: string | null = null;
  if (wheel?.is_active && phone) {
    const { data: entry } = await admin
      .from("spin_entries")
      .select("last_spin_at, reward_won")
      .eq("wheel_id", RIALTO_SPIN_WHEEL_ID)
      .eq("phone", phone)
      .order("last_spin_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!entry) {
      canSpin = true;
    } else {
      lastSpinReward = (entry.reward_won as string | null) ?? null;
      const freq = wheel.frequency as string;
      if (freq === "once") canSpin = false;
      else {
        const since = Date.now() - new Date(entry.last_spin_at as string).getTime();
        const ms =
          freq === "daily"
            ? 24 * 60 * 60 * 1000
            : freq === "weekly"
              ? 7 * 24 * 60 * 60 * 1000
              : freq === "monthly"
                ? 30 * 24 * 60 * 60 * 1000
                : Number.MAX_SAFE_INTEGER;
        canSpin = since >= ms;
      }
    }
  }

  // 3) Loterie
  const { data: lottery } = await admin
    .from("lotteries")
    .select(
      "id, title, reward_description, draw_date, start_date, end_date, is_active, is_permanent, max_winners, require_google_review",
    )
    .eq("id", RIALTO_LOTTERY_ID)
    .maybeSingle();

  let alreadyEntered = false;
  if (lottery && card) {
    const { data: existing } = await admin
      .from("lottery_participants")
      .select("id")
      .eq("lottery_id", RIALTO_LOTTERY_ID)
      .eq("phone", phone)
      .maybeSingle();
    alreadyEntered = !!existing;
  }

  // 4) 10 dernières commandes Rialto
  const { data: orders } = card
    ? await admin
        .from("orders")
        .select("id, order_number, status, total_amount, created_at")
        .eq("restaurant_id", RIALTO_RESTAURANT_ID)
        .eq("customer_id", card.customer_id)
        .order("created_at", { ascending: false })
        .limit(10)
    : { data: [] };

  return NextResponse.json(
    {
      customer: card
        ? {
            id: card.customer_id,
            first_name: (card.customers as unknown as { first_name: string })
              .first_name,
            last_name: (card.customers as unknown as { last_name: string })
              .last_name,
            phone: (card.customers as unknown as { phone: string }).phone,
            email: (card.customers as unknown as { email: string | null }).email,
          }
        : null,
      card: card
        ? {
            id: card.id,
            current_stamps: card.current_stamps,
            stamps_required: loyalty?.stamps_required ?? 10,
            reward_description:
              loyalty?.reward_description ?? "Une pizza offerte",
            card_name: loyalty?.card_name ?? "Rialto Club",
            qr_code_value: card.qr_code_value,
            rewards_claimed: card.rewards_claimed,
          }
        : null,
      spin_wheel: wheel
        ? {
            id: wheel.id,
            is_active: wheel.is_active,
            frequency: wheel.frequency,
            segments: wheel.segments ?? [],
            rewards: wheelRewards ?? [],
            can_spin: canSpin,
            last_reward: lastSpinReward,
            require_google_review: !!wheel.require_google_review,
          }
        : null,
      lottery: lottery
        ? {
            id: lottery.id,
            title: lottery.title,
            reward_description: lottery.reward_description,
            draw_date: lottery.draw_date,
            start_date: lottery.start_date,
            end_date: lottery.end_date,
            is_active: lottery.is_active,
            is_permanent: lottery.is_permanent,
            already_entered: alreadyEntered,
            require_google_review: !!(lottery as { require_google_review?: boolean }).require_google_review,
          }
        : null,
      orders: orders ?? [],
      review_gate: {
        place_id: (business?.google_place_id as string | null) ?? null,
        active_claim: activeClaim,
      },
    },
    { headers },
  );
}
