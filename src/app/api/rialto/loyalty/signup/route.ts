import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  RIALTO_BASE_URL,
  RIALTO_CARD_ID,
  RIALTO_RESTAURANT_ID,
  rialtoCorsHeaders,
} from "@/lib/rialtoConstants";
import { normalizePhone } from "@/lib/phone";
import { phoneLookupVariants } from "@/lib/phoneVariants";
import { renderTemplate, TEMPLATE_META } from "@/lib/smsTemplates";
import { sendSms } from "@/lib/brevo";

/**
 * Génère un short_code alphanumérique unique de 8 chars.
 * Alphabet sans caractères ambigus (0/O/1/I/l).
 */
async function generateUniqueShortCode(
  admin: ReturnType<typeof createAdminClient>,
): Promise<string> {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 8; attempt++) {
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    const { data } = await admin
      .from("customer_cards")
      .select("id")
      .eq("short_code", code)
      .maybeSingle();
    if (!data) return code;
  }
  // Fallback : base36 timestamp (collision extrêmement improbable)
  return Date.now().toString(36).toUpperCase().slice(-8);
}

/**
 * Envoie le SMS "loyalty_card_created" avec l'URL publique courte.
 * Non-bloquant : logue mais n'empêche pas la réponse au client.
 */
async function sendLoyaltyCardSms(params: {
  admin: ReturnType<typeof createAdminClient>;
  phone: string;
  firstName: string;
  shortCode: string;
}): Promise<void> {
  const { admin, phone, firstName, shortCode } = params;
  try {
    const { data: tmpl } = await admin
      .from("sms_templates")
      .select("content, enabled")
      .eq("restaurant_id", RIALTO_RESTAURANT_ID)
      .eq("template_key", "loyalty_card_created")
      .maybeSingle();

    const effective =
      tmpl && tmpl.enabled !== false
        ? tmpl
        : TEMPLATE_META.loyalty_card_created
          ? {
              content: TEMPLATE_META.loyalty_card_created.defaultContent,
              enabled: true,
            }
          : null;

    if (!effective) {
      console.log(
        "[sms-loyalty] loyalty_card_created template absent, skipping SMS",
      );
      return;
    }
    if (!effective.enabled) {
      console.log("[sms-loyalty] template disabled, skipping SMS");
      return;
    }

    // URL de la carte : pointe vers le site Rialto (Phase 5 FIX 3).
    // Centralisée via RIALTO_BASE_URL (Phase 7 FIX 2) pour éviter les
    // fallbacks éparpillés vers rialto-lausanne.ch qui renvoyait vers
    // un vieux site Just Eat.
    const content = renderTemplate(effective.content, {
      customer_name: firstName,
      card_url: `${RIALTO_BASE_URL.replace(/\/$/, "")}/c/${shortCode}`,
      restaurant_name: "Rialto",
    });

    // Cascade sender : Rialto → Stampify fallback pour FR
    try {
      await sendSms(phone, content, "Rialto");
      console.log("[sms-loyalty] success sender=Rialto", {
        phone,
        shortCode,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("sender") || msg.includes("400")) {
        console.warn("[sms-loyalty] Rialto refusé, retry Stampify");
        await sendSms(phone, content, "Stampify");
        console.log("[sms-loyalty] success sender=Stampify");
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error("[sms-loyalty] failed (non-blocking)", err);
  }
}

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

  // Phase 9 FIX 2 : lookup tolérant aux formats mixtes en DB
  // (+41..., 41..., 0..., etc.). On essaie d'abord toutes les variantes
  // canoniques, puis fallback sur un match digits-suffix.
  const { variants: lookupVariants, digitsOnly: lookupDigits } =
    phoneLookupVariants(body.phone);

  let existingCustomerId: string | null = null;
  {
    // Match strict par variantes canoniques
    const { data: matchingCustomers } = await admin
      .from("customers")
      .select("id, phone")
      .in("phone", lookupVariants)
      .limit(10);

    let candidates =
      (matchingCustomers as Array<{ id: string; phone: string | null }> | null) ??
      [];

    // Fallback digits-suffix si rien
    if (candidates.length === 0 && lookupDigits.length >= 8) {
      const { data: allCustomers } = await admin
        .from("customers")
        .select("id, phone");
      const suffix = lookupDigits.slice(-8);
      candidates = ((allCustomers as Array<{
        id: string;
        phone: string | null;
      }> | null) ?? []).filter((c) => {
        const d = (c.phone ?? "").replace(/[^\d]/g, "");
        return d.length >= 8 && d.endsWith(suffix);
      });
    }

    if (candidates.length > 0) {
      // Cherche une carte Rialto pour l'un de ces customers
      const ids = candidates.map((c) => c.id);
      const { data: cardForCustomer } = await admin
        .from("customer_cards")
        .select("id, customer_id")
        .eq("card_id", RIALTO_CARD_ID)
        .in("customer_id", ids)
        .limit(1);
      if (cardForCustomer && cardForCustomer.length > 0) {
        existingCustomerId = cardForCustomer[0].customer_id as string;
      } else {
        // Customer existe mais pas de carte Rialto — on reuse le customer
        existingCustomerId = candidates[0].id;
      }
    }
  }

  // Legacy : re-fetch la carte complète avec ce customer_id pour
  // préserver la structure du code qui suit (currentStamps etc.)
  const { data: existingCards } = existingCustomerId
    ? await admin
        .from("customer_cards")
        .select(
          "id, customer_id, current_stamps, rewards_claimed, qr_code_value",
        )
        .eq("card_id", RIALTO_CARD_ID)
        .eq("customer_id", existingCustomerId)
        .limit(1)
    : { data: [] as Array<Record<string, unknown>> };

  let customerId: string;
  let cardId: string;
  let currentStamps = 0;
  let rewardsClaimed = 0;
  let qrCodeValue: string;
  let shortCode: string | null = null;
  let wasCreated = false;

  if (existingCards && existingCards.length > 0) {
    const existing = existingCards[0] as Record<string, unknown>;
    customerId = existing.customer_id as string;
    cardId = existing.id as string;
    currentStamps = (existing.current_stamps as number) ?? 0;
    rewardsClaimed = (existing.rewards_claimed as number) ?? 0;
    qrCodeValue = existing.qr_code_value as string;

    // Re-fetch short_code si absent de la query initiale (compat rétro)
    const { data: cardWithShort } = await admin
      .from("customer_cards")
      .select("short_code")
      .eq("id", cardId)
      .maybeSingle();
    shortCode = (cardWithShort?.short_code as string) ?? null;

    // Backfill short_code pour les cartes créées avant la migration
    if (!shortCode) {
      shortCode = await generateUniqueShortCode(admin);
      await admin
        .from("customer_cards")
        .update({ short_code: shortCode })
        .eq("id", cardId);
    }

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
    // Phase 9 FIX 2 : si un customer existe déjà avec ce numéro (autre
    // variante en DB) mais PAS de carte Rialto, on réutilise son id au
    // lieu d'essayer un INSERT qui violerait customers_phone_unique.
    if (existingCustomerId) {
      customerId = existingCustomerId;
      // Update du nom/email si nouveaux
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
      console.log("[loyalty/signup] reused existing customer", {
        customerId,
      });
    } else {
      // Nouveau customer + nouvelle carte
      const { data: newCustomer, error: custErr } = await admin
        .from("customers")
        .insert({
          first_name: body.first_name.trim(),
          last_name: body.last_name?.trim() || "",
          phone, // canonique E.164 avec "+"
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
    }

    qrCodeValue = crypto.randomUUID();
    shortCode = await generateUniqueShortCode(admin);
    // 1 tampon offert à la création = cadeau bienvenue
    const { data: newCard, error: cardErr } = await admin
      .from("customer_cards")
      .insert({
        customer_id: customerId,
        card_id: RIALTO_CARD_ID,
        current_stamps: 1,
        qr_code_value: qrCodeValue,
        rewards_claimed: 0,
        short_code: shortCode,
      })
      .select("id, current_stamps, rewards_claimed, qr_code_value, short_code")
      .single();
    if (cardErr || !newCard) {
      console.error("[loyalty/signup] card insert failed", cardErr);
      return NextResponse.json(
        { error: cardErr?.message ?? "Création carte échouée" },
        { status: 500, headers },
      );
    }
    cardId = newCard.id;
    currentStamps = newCard.current_stamps ?? 1;
    rewardsClaimed = newCard.rewards_claimed ?? 0;
    qrCodeValue = newCard.qr_code_value as string;
    shortCode = (newCard.short_code as string) ?? shortCode;
    wasCreated = true;
  }

  // SMS QR link — uniquement à la création (pas sur les retours client)
  if (wasCreated && shortCode) {
    void sendLoyaltyCardSms({
      admin,
      phone,
      firstName: body.first_name.trim(),
      shortCode,
    });
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
        short_code: shortCode,
      },
      was_created: wasCreated,
    },
    { headers },
  );
}
