import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSms } from "@/lib/brevo";
import { logSms } from "@/lib/smsLogging";
import { renderTemplate, TEMPLATE_META } from "@/lib/smsTemplates";
import { computeVipTier, VIP_META } from "@/lib/vipTiers";
import { normalizePhone } from "@/lib/analytics";
import { RIALTO_RESTAURANT_ID } from "@/lib/rialtoConstants";

/**
 * GET /api/cron/recompute-vip
 * Cron horaire — recompute vip_tier pour tous les customers Rialto
 * basé sur leur orders lifetime count + total spend.
 *
 * Si unlock (passage de null→bronze, bronze→silver, silver→gold),
 * envoie SMS vip_tier_unlocked avec le nouveau tier + avantage.
 */
export async function GET(req: NextRequest) {
  const isCron = req.headers.get("x-vercel-cron") === "1";
  const cronSecret = req.headers.get("x-cron-secret");
  const validSecret = process.env.CRON_SECRET ?? "rialto-cron-2026";
  if (!isCron && cronSecret !== validSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // 1. Fetch tous les orders Rialto acceptés
  const { data: orders } = await admin
    .from("orders")
    .select("customer_phone, customer_id, total_amount, status")
    .eq("restaurant_id", RIALTO_RESTAURANT_ID)
    .not("status", "in", "(cancelled,refunded)");

  // Agrège par customer_id (fallback phone)
  type Agg = { count: number; spend: number };
  const byCustomerId = new Map<string, Agg>();
  const byPhone = new Map<string, Agg>();
  for (const o of orders ?? []) {
    const amount = Number(o.total_amount ?? 0);
    if (o.customer_id) {
      const b = byCustomerId.get(o.customer_id as string) ?? { count: 0, spend: 0 };
      b.count += 1;
      b.spend += amount;
      byCustomerId.set(o.customer_id as string, b);
    } else if (o.customer_phone) {
      const p = normalizePhone(o.customer_phone as string);
      const b = byPhone.get(p) ?? { count: 0, spend: 0 };
      b.count += 1;
      b.spend += amount;
      byPhone.set(p, b);
    }
  }

  // 2. Pour chaque customer avec au moins 1 order, compute tier
  const { data: customers } = await admin
    .from("customers")
    .select("id, first_name, phone, vip_tier, vip_lifetime_spend, vip_order_count");

  const unlockQueue: Array<{
    customer: { id: string; first_name: string | null; phone: string };
    newTier: Exclude<ReturnType<typeof computeVipTier>, null>;
  }> = [];

  let updated = 0;

  for (const c of customers ?? []) {
    const byId = byCustomerId.get(c.id as string);
    const byPh = c.phone ? byPhone.get(normalizePhone(c.phone as string)) : null;
    const count = (byId?.count ?? 0) + (byPh?.count ?? 0);
    const spend = (byId?.spend ?? 0) + (byPh?.spend ?? 0);

    if (count === 0 && spend === 0) continue;

    const newTier = computeVipTier(count, spend);
    const oldTier = c.vip_tier as ReturnType<typeof computeVipTier>;

    // Met à jour uniquement si changement ou lifetime_spend/count dérive
    const shouldUpdate =
      newTier !== oldTier ||
      Number(c.vip_lifetime_spend ?? 0) !== Number(spend.toFixed(2)) ||
      (c.vip_order_count ?? 0) !== count;

    if (shouldUpdate) {
      await admin
        .from("customers")
        .update({
          vip_tier: newTier,
          vip_updated_at: new Date().toISOString(),
          vip_lifetime_spend: Number(spend.toFixed(2)),
          vip_order_count: count,
        })
        .eq("id", c.id);
      updated += 1;

      // Unlock / tier-up : envoyer SMS seulement si on monte (pas downgrade)
      const tierOrder = { bronze: 1, silver: 2, gold: 3 };
      const newRank = newTier ? tierOrder[newTier] : 0;
      const oldRank = oldTier ? tierOrder[oldTier] : 0;
      if (newTier && newRank > oldRank && c.phone) {
        unlockQueue.push({
          customer: {
            id: c.id as string,
            first_name: (c.first_name as string) ?? "",
            phone: c.phone as string,
          },
          newTier,
        });
      }
    }
  }

  // 3. SMS unlock
  let smsSent = 0;
  for (const u of unlockQueue) {
    try {
      const meta = TEMPLATE_META.vip_tier_unlocked;
      const { data: tmpl } = await admin
        .from("sms_templates")
        .select("content, enabled")
        .eq("restaurant_id", RIALTO_RESTAURANT_ID)
        .eq("template_key", "vip_tier_unlocked")
        .maybeSingle();
      const avantage = `-${VIP_META[u.newTier].discount_percent}% permanent${
        u.newTier === "silver" || u.newTier === "gold"
          ? " + dessert anniversaire"
          : ""
      }${u.newTier === "gold" ? " + pizza offerte tous les 5 commandes" : ""}`;

      const content = renderTemplate(tmpl?.content ?? meta.defaultContent, {
        customer_name: u.customer.first_name ?? "",
        reward_label: avantage,
        restaurant_name: "Rialto",
      });

      let sender = "Rialto";
      try {
        await sendSms(u.customer.phone, content, "Rialto");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.toLowerCase().includes("sender") || msg.includes("400")) {
          sender = "Stampify";
          await sendSms(u.customer.phone, content, "Stampify");
        } else throw err;
      }

      await logSms({
        restaurant_id: RIALTO_RESTAURANT_ID,
        customer_id: u.customer.id,
        phone: u.customer.phone,
        template_key: "vip_tier_unlocked",
        sender_used: sender,
        content,
        status: "sent",
        context_meta: { vip_tier: u.newTier },
      });
      smsSent += 1;
    } catch (err) {
      console.error("[recompute-vip] SMS unlock failed", u.customer.id, err);
    }
  }

  return NextResponse.json({
    ok: true,
    customers_checked: (customers ?? []).length,
    updated,
    unlocks_sent: smsSent,
  });
}
