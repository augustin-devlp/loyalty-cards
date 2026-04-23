import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { estimateMonthlyCost, SMS_PRICING_TIERS } from "@/lib/smsPricing";

/**
 * GET /api/dashboard/billing/sms-usage
 *
 * Phase 11 C17 — Retourne le barème SMS live pour Rialto/Mehmet :
 *   - SMS envoyés (mois courant, 30j glissants, 12 mois)
 *   - Crédits consommés
 *   - Tier actuel + prix
 *   - Projection mois courant + simulations
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

  // Find restaurant
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
    .select("created_at, status, cost_credits, sender_used, template_key")
    .eq("restaurant_id", restaurant.id)
    .gte("created_at", yearAgo.toISOString())
    .order("created_at", { ascending: false })
    .limit(10000);

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

  // Projection fin de mois = credits * (jours_mois / jour_du_mois)
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const projectedMonth = Math.round(thisMonthCredits * (daysInMonth / Math.max(dayOfMonth, 1)));

  const currentCost = estimateMonthlyCost(thisMonthCredits);
  const projectedCost = estimateMonthlyCost(projectedMonth);

  // Breakdown par channel (SMS vs WebPush)
  const byChannel = {
    sms_rialto: sent.filter((l) => l.sender_used === "Rialto").length,
    sms_stampify: sent.filter((l) => l.sender_used === "Stampify").length,
    webpush: sent.filter((l) => l.sender_used === "WebPush").length,
  };

  // Breakdown par template (top 10)
  const byTemplate: Record<string, number> = {};
  for (const l of sent) {
    const k = (l.template_key as string) ?? "inconnu";
    byTemplate[k] = (byTemplate[k] ?? 0) + 1;
  }
  const topTemplates = Object.entries(byTemplate)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([template, count]) => ({ template, count }));

  return NextResponse.json({
    ok: true,
    generated_at: new Date().toISOString(),
    restaurant: restaurant.name,
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
    },
    current_tier: currentCost,
    projected_tier: projectedCost,
    tiers: SMS_PRICING_TIERS,
    channels: byChannel,
    top_templates: topTemplates,
  });
}
