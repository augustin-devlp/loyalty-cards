import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/brevo";

/**
 * GET /api/reports/monthly
 * Protected by Authorization: Bearer <CRON_SECRET> header.
 * Calculates monthly stats for all Business-plan businesses and sends
 * an HTML report email via Brevo.
 * Triggered by Vercel Cron on the 1st of each month at 08:00.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch all Business-plan businesses with their email
  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, email, business_name")
    .eq("plan", "business");

  if (!businesses?.length) {
    return NextResponse.json({ sent: 0, reason: "no business plan users" });
  }

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const lastMonthEnd   = thisMonthStart;

  let sent = 0;

  for (const biz of businesses) {
    if (!biz.email) continue;

    // Loyalty cards for this business
    const { data: cards } = await supabase
      .from("loyalty_cards")
      .select("id")
      .eq("business_id", biz.id);
    const cardIds = cards?.map((c: { id: string }) => c.id) ?? [];
    if (!cardIds.length) continue;

    // Customer cards
    const { data: allCC } = await supabase
      .from("customer_cards")
      .select("id, customer_id, rewards_claimed, customers(first_name, last_name)")
      .in("card_id", cardIds);

    const ccIds = allCC?.map((c: { id: string }) => c.id) ?? [];

    // Transactions this month
    const { data: txThisMonth } = ccIds.length
      ? await supabase
          .from("transactions")
          .select("customer_card_id, type, value, created_at")
          .in("customer_card_id", ccIds)
          .gte("created_at", thisMonthStart)
      : { data: [] };

    // Transactions last month (for new-client comparison)
    const { data: txLastMonth } = ccIds.length
      ? await supabase
          .from("transactions")
          .select("customer_card_id, created_at")
          .in("customer_card_id", ccIds)
          .gte("created_at", lastMonthStart)
          .lt("created_at", lastMonthEnd)
      : { data: [] };

    // New customers this month (first stamp this month)
    const firstSeenThisMonth = new Set<string>();
    const firstSeenLastMonth = new Set<string>();
    for (const tx of (txLastMonth ?? [])) {
      firstSeenLastMonth.add(tx.customer_card_id);
    }
    for (const tx of (txThisMonth ?? [])) {
      if (!firstSeenLastMonth.has(tx.customer_card_id)) {
        firstSeenThisMonth.add(tx.customer_card_id);
      }
    }

    const stampsThisMonth   = (txThisMonth ?? []).filter((t: { type: string }) => t.type === "stamp_added").length;
    const rewardsThisMonth  = (txThisMonth ?? []).filter((t: { type: string }) => t.type === "reward_claimed").length;
    const newClientsThisMonth = firstSeenThisMonth.size;
    const totalClients      = allCC?.length ?? 0;
    const retentionRate     = totalClients > 0
      ? Math.round(((totalClients - newClientsThisMonth) / totalClients) * 100)
      : 0;

    // Top 5 clients by rewards_claimed
    type CCRow = { customers: { first_name: string; last_name: string } | null; rewards_claimed: number };
    const top5 = [...(allCC ?? [] as CCRow[])]
      .sort((a, b) => (b.rewards_claimed ?? 0) - (a.rewards_claimed ?? 0))
      .slice(0, 5) as CCRow[];

    const monthLabel = now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><style>
  body { font-family: -apple-system, sans-serif; background: #f4f4f8; margin: 0; padding: 0; }
  .wrap { max-width: 600px; margin: 32px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
  .header { background: #534AB7; padding: 32px; text-align: center; color: #fff; }
  .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
  .header p { margin: 6px 0 0; opacity: .8; font-size: 14px; }
  .body { padding: 32px; }
  .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
  .stat { background: #f4f4f8; border-radius: 12px; padding: 20px; }
  .stat .val { font-size: 32px; font-weight: 800; color: #534AB7; }
  .stat .lbl { font-size: 12px; color: #888; margin-top: 4px; }
  h2 { font-size: 16px; font-weight: 700; color: #1a1a2e; margin: 0 0 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  td, th { text-align: left; padding: 10px 12px; border-bottom: 1px solid #f0f0f4; }
  th { font-size: 11px; text-transform: uppercase; color: #888; }
  .footer { background: #f4f4f8; padding: 20px 32px; text-align: center; font-size: 12px; color: #aaa; }
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <h1>📊 Rapport mensuel</h1>
    <p>${biz.business_name} · ${monthLabel}</p>
  </div>
  <div class="body">
    <div class="stats">
      <div class="stat"><div class="val">${totalClients}</div><div class="lbl">Clients total</div></div>
      <div class="stat"><div class="val">+${newClientsThisMonth}</div><div class="lbl">Nouveaux ce mois</div></div>
      <div class="stat"><div class="val">${stampsThisMonth}</div><div class="lbl">Tampons distribués</div></div>
      <div class="stat"><div class="val">${rewardsThisMonth}</div><div class="lbl">Récompenses réclamées</div></div>
      <div class="stat"><div class="val">${retentionRate}%</div><div class="lbl">Taux de rétention</div></div>
    </div>
    ${top5.length ? `
    <h2>🏆 Top 5 clients fidèles</h2>
    <table>
      <tr><th>Client</th><th>Récompenses</th></tr>
      ${top5.map((cc) => `
      <tr>
        <td>${cc.customers?.first_name ?? ""} ${cc.customers?.last_name ?? ""}</td>
        <td>${cc.rewards_claimed ?? 0} 🎁</td>
      </tr>`).join("")}
    </table>` : ""}
  </div>
  <div class="footer">Stampify · rapport généré automatiquement le ${new Date().toLocaleDateString("fr-FR")}</div>
</div>
</body></html>`;

    try {
      await sendEmail(biz.email, `📊 Rapport mensuel Stampify — ${monthLabel}`, html);
      sent++;
    } catch (err) {
      console.error(`Monthly report email error for ${biz.id}:`, err);
    }
  }

  return NextResponse.json({ sent, total: businesses.length });
}
