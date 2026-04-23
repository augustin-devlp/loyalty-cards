import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderTemplate, TEMPLATE_META } from "@/lib/smsTemplates";
import { sendSms } from "@/lib/brevo";
import {
  RIALTO_BUSINESS_ID,
  RIALTO_RESTAURANT_ID,
} from "@/lib/rialtoConstants";

/**
 * GET /api/cron/birthday-sms
 * Cron quotidien Vercel 09:00.
 *
 * Scanne les clients dont le date_of_birth tombe aujourd'hui (mois + jour)
 * et qui ont une carte activée, puis :
 *   - Génère un code promo BDAY* avec -20% valable 7 jours
 *   - Envoie un SMS avec le template birthday_wish (ou birthday_wish_vip
 *     pour les VIP silver/gold — Phase 11 C11 préparé ici)
 *
 * Auth : header x-vercel-cron=1 ou x-cron-secret=$CRON_SECRET
 */
export async function GET(req: NextRequest) {
  const isCron = req.headers.get("x-vercel-cron") === "1";
  const cronSecret = req.headers.get("x-cron-secret");
  const validSecret = process.env.CRON_SECRET ?? "rialto-cron-2026";

  if (!isCron && cronSecret !== validSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  // Fetch customers Rialto avec date_of_birth renseignée
  const { data: all } = await admin
    .from("customers")
    .select(
      `id, first_name, phone, date_of_birth, vip_tier,
       customer_cards!inner(id, card_id, is_fully_activated)`,
    )
    .eq("customer_cards.card_id", "f4cb1a3f-fc5c-40eb-87db-8d2c2b0a8b5f")
    .eq("customer_cards.is_fully_activated", true)
    .not("date_of_birth", "is", null);

  const customers = (all ?? []).filter((c: Record<string, unknown>) => {
    const dobStr = c.date_of_birth as string | null;
    if (!dobStr) return false;
    const dob = new Date(dobStr);
    return dob.getMonth() + 1 === todayMonth && dob.getDate() === todayDay;
  });

  console.log("[birthday-sms] START", {
    total_birthdays: customers.length,
    today: `${todayDay}/${todayMonth}`,
  });

  let sent = 0;
  let errors = 0;

  for (const c of customers) {
    const customer = c as unknown as {
      id: string;
      first_name: string;
      phone: string;
      vip_tier?: string;
    };
    try {
      // 1. Générer code promo (sauf VIP silver/gold = dessert offert)
      const isVipDessert =
        customer.vip_tier === "silver" || customer.vip_tier === "gold";
      const templateKey = isVipDessert ? "birthday_wish_vip" : "birthday_wish";

      let promoCode = "";
      if (!isVipDessert) {
        const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
        promoCode = `BDAY${customer.id.slice(0, 4).toUpperCase()}${suffix}`;
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 7);

        const { error: promoErr } = await admin.from("promo_codes").insert({
          business_id: RIALTO_BUSINESS_ID,
          restaurant_id: RIALTO_RESTAURANT_ID,
          code: promoCode,
          customer_id: customer.id,
          phone: customer.phone,
          source: "birthday",
          discount_type: "percent",
          discount_value: 20,
          max_uses: 1,
          uses_count: 0,
          valid_from: new Date().toISOString(),
          valid_until: validUntil.toISOString(),
        });

        if (promoErr) {
          console.error("[birthday-sms] promo insert failed", customer.id, promoErr);
          errors++;
          continue;
        }
      }

      // 2. Fetch template
      const { data: tmpl } = await admin
        .from("sms_templates")
        .select("content, enabled")
        .eq("restaurant_id", RIALTO_RESTAURANT_ID)
        .eq("template_key", templateKey)
        .maybeSingle();

      const meta =
        (TEMPLATE_META as Record<string, { defaultContent: string }>)[templateKey];
      const effective = tmpl?.enabled !== false && tmpl?.content
        ? tmpl
        : meta
          ? { content: meta.defaultContent, enabled: true }
          : null;

      if (!effective) {
        console.log("[birthday-sms] template missing", templateKey);
        continue;
      }

      const content = renderTemplate(effective.content, {
        customer_name: customer.first_name,
        code: promoCode,
        reward_label: isVipDessert ? "un dessert offert" : "-20% sur ta prochaine commande",
        restaurant_name: "Rialto",
      });

      // 3. Send SMS (cascade sender Rialto → Stampify)
      try {
        await sendSms(customer.phone, content, "Rialto");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.toLowerCase().includes("sender") || msg.includes("400")) {
          await sendSms(customer.phone, content, "Stampify");
        } else {
          throw err;
        }
      }

      sent++;
      console.log("[birthday-sms] ✅ sent", {
        customer_id: customer.id,
        template: templateKey,
      });
    } catch (err) {
      console.error("[birthday-sms] error", customer.id, err);
      errors++;
    }
  }

  return NextResponse.json({
    ok: true,
    total_birthdays_today: customers.length,
    sms_sent: sent,
    errors,
  });
}
