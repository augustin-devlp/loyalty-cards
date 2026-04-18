import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/orders?restaurant_id=X&status=new,accepted&since=YYYY-MM-DD
 *
 * Liste les commandes d'un restaurant. Requiert une session dashboard.
 * (Mehmet n'ayant pas encore de compte, on n'attache pas encore le
 * restaurant à un business_id spécifique — tout utilisateur loggé dans
 * Stampify peut voir Rialto. À restreindre quand son compte existera.)
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const restaurantId = url.searchParams.get("restaurant_id");
  const statusParam = url.searchParams.get("status");
  const since = url.searchParams.get("since");

  if (!restaurantId) {
    return NextResponse.json(
      { error: "restaurant_id required" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  let query = admin
    .from("orders")
    .select(
      "id, restaurant_id, order_number, customer_name, customer_phone, requested_pickup_time, status, total_amount, notes, created_at, updated_at",
    )
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false })
    .limit(500);

  if (statusParam) {
    const list = statusParam.split(",").filter(Boolean);
    if (list.length) query = query.in("status", list);
  }
  if (since) query = query.gte("created_at", since);

  const { data: orders, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const orderIds = (orders ?? []).map((o) => o.id);
  const { data: items } = orderIds.length
    ? await admin
        .from("order_items")
        .select(
          "id, order_id, menu_item_id, item_name_snapshot, item_price_snapshot, quantity, selected_options, subtotal, notes",
        )
        .in("order_id", orderIds)
    : { data: [] };

  const byOrder: Record<string, typeof items> = {};
  for (const it of items ?? []) {
    (byOrder[it.order_id] ??= []).push(it);
  }

  const full = (orders ?? []).map((o) => ({
    ...o,
    items: byOrder[o.id] ?? [],
  }));

  return NextResponse.json({ orders: full });
}
