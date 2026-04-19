import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  RIALTO_CARD_ID,
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
 * POST /api/rialto/loyalty/signup
 * Body: { first_name, last_name, phone, email? }
 *
 * Crée (ou récupère) customers + customer_cards pour ce téléphone.
 * Idempotent : si la carte existe déjà, on met à jour les infos perso.
 */
export async function POST(req: NextRequest) {
  const headers = rialtoCorsHeaders(req.headers.get("origin"));
  const body = (await req.json().catch(() => null)) as {
    first_name?: string;
    last_name?: string | null;
    phone?: string;
    email?: string | null;
  } | null;

  if (!body?.first_name?.trim() || !body.phone?.trim()) {
    return NextResponse.json(
      { error: "first_name et phone requis" },
      { status: 400, headers },
    );
  }

  // Normalise en E.164 pour que le même numéro soit trouvé quel que soit
  // le format saisi (0612345678, +33 6 12…, 41791234567, etc.)
  const phone = normalizePhone(body.phone);
  if (!phone) {
    return NextResponse.json(
      { error: "Numéro de téléphone invalide." },
      { status: 400, headers },
    );
  }

  const admin = createAdminClient();

  // Cherche une carte existante par phone dans le programme Rialto
  const { data: existingCards } = await admin
    .from("customer_cards")
    .select(
      "id, customer_id, current_stamps, rewards_claimed, qr_code_value, customers!inner (id, phone)",
    )
    .eq("card_id", RIALTO_CARD_ID)
    .eq("customers.phone", phone)
    .limit(1);

  let customerId: string;
  let cardId: string;
  let currentStamps = 0;
  let rewardsClaimed = 0;
  let qrCodeValue: string;

  if (existingCards && existingCards.length > 0) {
    const existing = existingCards[0];
    customerId = existing.customer_id as string;
    cardId = existing.id as string;
    currentStamps = existing.current_stamps ?? 0;
    rewardsClaimed = existing.rewards_claimed ?? 0;
    qrCodeValue = existing.qr_code_value as string;

    // Update infos client
    await admin
      .from("customers")
      .update({
        first_name: body.first_name.trim(),
        last_name: body.last_name?.trim() || "",
        ...(body.email !== undefined
          ? { email: body.email?.trim() || null }
          : {}),
      })
      .eq("id", customerId);
  } else {
    // Nouveau customer + nouvelle carte
    const { data: newCustomer, error: custErr } = await admin
      .from("customers")
      .insert({
        first_name: body.first_name.trim(),
        last_name: body.last_name?.trim() || "",
        phone,
        email: body.email?.trim() || null,
      })
      .select("id")
      .single();
    if (custErr || !newCustomer) {
      console.error("[loyalty/signup] customer insert failed", custErr);
      return NextResponse.json(
        { error: custErr?.message ?? "Création customer échouée" },
        { status: 500, headers },
      );
    }
    customerId = newCustomer.id;

    qrCodeValue = crypto.randomUUID();
    const { data: newCard, error: cardErr } = await admin
      .from("customer_cards")
      .insert({
        customer_id: customerId,
        card_id: RIALTO_CARD_ID,
        current_stamps: 0,
        qr_code_value: qrCodeValue,
        rewards_claimed: 0,
      })
      .select("id, current_stamps, rewards_claimed, qr_code_value")
      .single();
    if (cardErr || !newCard) {
      console.error("[loyalty/signup] card insert failed", cardErr);
      return NextResponse.json(
        { error: cardErr?.message ?? "Création carte échouée" },
        { status: 500, headers },
      );
    }
    cardId = newCard.id;
    currentStamps = newCard.current_stamps ?? 0;
    rewardsClaimed = newCard.rewards_claimed ?? 0;
    qrCodeValue = newCard.qr_code_value as string;
  }

  // Renvoie un payload similaire à /lookup
  const { data: loyalty } = await admin
    .from("loyalty_cards")
    .select("stamps_required, reward_description, card_name")
    .eq("id", RIALTO_CARD_ID)
    .single();

  return NextResponse.json(
    {
      customer: {
        id: customerId,
        first_name: body.first_name.trim(),
        last_name: body.last_name?.trim() || "",
        phone,
        email: body.email?.trim() || null,
      },
      card: {
        id: cardId,
        current_stamps: currentStamps,
        stamps_required: loyalty?.stamps_required ?? 10,
        reward_description: loyalty?.reward_description ?? "Une pizza offerte",
        card_name: loyalty?.card_name ?? "Rialto Club",
        qr_code_value: qrCodeValue,
        rewards_claimed: rewardsClaimed,
      },
    },
    { headers },
  );
}
