import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  estimateMonthlyCost,
  SMS_PRICING_TIERS,
  CAMPAIGN_PRICING,
  computeProgressiveSmsCost,
} from "@/lib/smsPricing";

/**
 * GET /api/dashboard/billing/sms-usage
 *
 * Phase 11 C17 + révision Avril 2026 — Aligné sur l'offre commerciale
 * Mehmet (PDF Offre_Finale_V2). Tarification SMS progressive par tranches
 * mensuelles + campagnes marketing à la carte (59/39 CHF). Aucun abonnement.
 */
export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: restaurant } = await admin
    .from("restaurants")
    .select("id, name")
    .eq("business_id", user.id)
    .maybeSingle();
  if (!restaurant) {
    return NextResponse.json({ error: "no_restaurant" }, { status: 403 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyAgo = new Date(now.getTime() - 30 * 86400000);
  const yearAgo = new Date(now.getTime() - 365 * 86400000);

  const { data: logs } = await admin
    .from("sms_logs")
    .select("created_at, status, cost_credits, sender_used, template_key, context_meta")
    .eq("restaurant_id", restaurant.id)
    .gte("created_at", yearAgo.toISOString())
    .order("created_at", { ascending: false })
    .limit(20000);

  const all = logs ?? [];
  const sent = all.filter((l) => l.status === "sent");
  const failed = all.filter((l) => l.status === "failed");

  const sumCredits = (arr: typeof all) =>
    arr.reduce((s, l) => s + Number(l.cost_credits ?? 1), 0);

  const thisMonthSent = sent.filter(
    (l) => new Date(l.created_at).getTime() >= startOfMonth.getTime(),
  );
  const last30dSent = sent.filter(
    (l) => new Date(l.created_at).getTime() >= thirtyAgo.getTime(),
  );

  const thisMonthCredits = sumCredits(thisMonthSent);
  const last30dCredits = sumCredits(last30dSent);
  const yearCredits = sumCredits(sent);

  // Projection fin de mois (pro rata)
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const projectedMonth = Math.round(
    thisMonthCredits * (daysInMonth / Math.max(dayOfMonth, 1)),
  );

  // Compte les campagnes marketing du mois en cours via context_meta
  const thisMonthCampaigns = thisMonthSent.filter((l) => {
    const meta = (l.context_meta ?? {}) as Record<string, unknown>;
    const ch = String(meta.channel ?? meta.kind ?? "");
    const tk = String(l.template_key ?? "");
    return (
      ch === "campaign" ||
      ch === "marketing" ||
      tk.includes("campaign") ||
      tk.includes("marketing")
    );
  }).length;

  const currentCost = estimateMonthlyCost(
    thisMonthCredits,
    Math.min(thisMonthCampaigns, 10),
  );
  const projectedCost = estimateMonthlyCost(
    projectedMonth,
    Math.min(thisMonthCampaigns, 10),
  );

  // Breakdown channel
  const byChannel = {
    sms_rialto: sent.filter((l) => l.sender_used === "Rialto").length,
    sms_stampify: sent.filter((l) => l.sender_used === "Stampify").length,
    webpush: sent.filter((l) => l.sender_used === "WebPush").length,
  };

  const byTemplate: Record<string, number> = {};
  for (const l of sent) {
    const k = (l.template_key as string) ?? "inconnu";
    byTemplate[k] = (byTemplate[k] ?? 0) + 1;
  }
  const topTemplates = Object.entries(byTemplate)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([template, count]) => ({ template, count }));

  // Données pour le simulateur (les 3 scénarios du PDF)
  const scenarios = {
    a: {
      label: "Scénario A — Démarrage tranquille",
      sms_volume: 2555,
      campaigns: 1,
      ...estimateMonthlyCost(2555, 1),
    },
    b: {
      label: "Scénario B — Croissance active (recommandé)",
      sms_volume: 3055,
      campaigns: 2,
      ...estimateMonthlyCost(3055, 2),
    },
    c: {
      label: "Scénario C — Performance maximale",
      sms_volume: 3855,
      campaigns: 3,
      ...estimateMonthlyCost(3855, 3),
    },
  };

  return NextResponse.json({
    ok: true,
    generated_at: new Date().toISOString(),
    restaurant: restaurant.name,
    pricing: {
      tiers: SMS_PRICING_TIERS,
      campaign_standard_chf: CAMPAIGN_PRICING.standardChf,
      campaign_loyalty_chf: CAMPAIGN_PRICING.loyaltyDiscountChf,
      campaign_loyalty_trigger: CAMPAIGN_PRICING.loyaltyTriggerCount,
      monthly_subscription_chf: 0,
    },
    totals: {
      sms_sent_this_month: thisMonthSent.length,
      sms_failed_this_month: failed.filter(
        (l) => new Date(l.created_at).getTime() >= startOfMonth.getTime(),
      ).length,
      credits_this_month: thisMonthCredits,
      credits_last_30d: last30dCredits,
      credits_12_months: yearCredits,
      sms_sent_12_months: sent.length,
      projected_credits_end_of_month: projectedMonth,
      campaigns_this_month: thisMonthCampaigns,
    },
    current_cost: currentCost,
    projected_cost: projectedCost,
    scenarios,
    channels: byChannel,
    top_templates: topTemplates,
  });
}
