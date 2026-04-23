import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  buildCustomerAnalytics,
  computeDailyRevenue,
  computeDemographics,
  computeHourlyDistribution,
  computeSegmentBreakdown,
  computeTimeKpis,
  computeWeekdayDistribution,
} from "@/lib/analytics";
import { RIALTO_RESTAURANT_ID, RIALTO_CARD_ID } from "@/lib/rialtoConstants";

/**
 * GET /api/dashboard/analytics
 *
 * Endpoint unifié analytics RFM-A (Phase 11 C2). Retourne en un seul
 * payload :
 *   - kpis (CA jour/semaine/mois/année, AOV)
 *   - daily_revenue (30 derniers jours)
 *   - hourly_distribution
 *   - weekday_distribution
 *   - segments (11 segments RFM + counts + CA)
 *   - demographics (age_range, gender)
 *   - top_products (10 plats les plus vendus)
 *   - top_customers (10 clients top dépensiers)
 *   - total_customers / total_orders
 *
 * Optimisation : on fait 3 queries batch (orders + customers + order_items)
 * puis tous les calculs en-mémoire.
 *
 * Auth : merchant connecté (RLS) — ici scope Rialto seulement.
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

  // 1. Orders des 365 derniers jours (pour year KPI + RFM)
  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);

  const { data: orders } = await admin
    .from("orders")
    .select(
      "id, customer_phone, customer_id, customer_name, total_amount, created_at, status",
    )
    .eq("restaurant_id", RIALTO_RESTAURANT_ID)
    .gte("created_at", oneYearAgo.toISOString())
    .order("created_at", { ascending: false })
    .limit(5000);

  const allOrders = orders ?? [];

  // 2. Customers avec carte Rialto activée
  const { data: customerCards } = await admin
    .from("customer_cards")
    .select(
      `id, customer:customer_id (id, phone, first_name, last_name, date_of_birth, age_range, gender)`,
    )
    .eq("card_id", RIALTO_CARD_ID);

  const customers = (customerCards ?? [])
    .map((cc) => {
      const c = Array.isArray(cc.customer) ? cc.customer[0] : cc.customer;
      return c as {
        id: string;
        phone: string;
        first_name: string | null;
        last_name: string | null;
        date_of_birth: string | null;
        age_range: string | null;
        gender: string | null;
      } | null;
    })
    .filter((c): c is NonNullable<typeof c> => Boolean(c && c.phone));

  // 3. Order items pour top products (30 derniers jours uniquement pour perf)
  const thirtyAgo = new Date();
  thirtyAgo.setDate(thirtyAgo.getDate() - 30);
  const recentOrderIds = allOrders
    .filter((o) => new Date(o.created_at).getTime() >= thirtyAgo.getTime())
    .map((o) => o.id);

  let topProducts: Array<{ name: string; count: number; revenue: number }> = [];
  if (recentOrderIds.length > 0) {
    const { data: items } = await admin
      .from("order_items")
      .select("item_name_snapshot, quantity, subtotal, order_id")
      .in("order_id", recentOrderIds)
      .limit(10000);
    const itemMap = new Map<string, { count: number; revenue: number }>();
    for (const it of items ?? []) {
      const name = (it.item_name_snapshot as string) ?? "Inconnu";
      const bucket = itemMap.get(name) ?? { count: 0, revenue: 0 };
      bucket.count += Number(it.quantity ?? 0);
      bucket.revenue += Number(it.subtotal ?? 0);
      itemMap.set(name, bucket);
    }
    topProducts = Array.from(itemMap.entries())
      .map(([name, v]) => ({
        name,
        count: v.count,
        revenue: Number(v.revenue.toFixed(2)),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // Build customer analytics (RFM)
  const rows = buildCustomerAnalytics(allOrders, customers);

  const kpis = computeTimeKpis(allOrders);
  const dailyRevenue = computeDailyRevenue(allOrders, 30);
  const hourly = computeHourlyDistribution(allOrders);
  const weekday = computeWeekdayDistribution(allOrders);
  const segments = computeSegmentBreakdown(rows);
  const demographics = computeDemographics(rows);

  const topCustomers = rows.slice(0, 10).map((r) => ({
    customer_id: r.customer_id,
    phone: r.phone,
    name: `${r.first_name} ${r.last_name}`.trim() || "Sans nom",
    order_count: r.order_count,
    total_spent: r.total_spent,
    last_order_days: r.last_order_days,
    segment: r.segment,
  }));

  return NextResponse.json({
    ok: true,
    generated_at: new Date().toISOString(),
    totals: {
      total_orders: allOrders.filter((o) => o.status !== "cancelled").length,
      total_orders_raw: allOrders.length,
      total_customers: rows.length,
      total_registered: customers.length,
    },
    kpis,
    daily_revenue: dailyRevenue,
    hourly_distribution: hourly,
    weekday_distribution: weekday,
    segments,
    demographics,
    top_products: topProducts,
    top_customers: topCustomers,
  });
}
