import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildCustomerAnalytics } from "@/lib/analytics";
import { RIALTO_CARD_ID, RIALTO_RESTAURANT_ID } from "@/lib/rialtoConstants";

/**
 * GET /api/dashboard/clients?search=&segment=
 *
 * Liste les clients avec leurs métriques (commandes, CA, segment RFM).
 * Filtrable par recherche free-text (nom/phone) + segment.
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.trim().toLowerCase() ?? "";
  const segmentFilter = url.searchParams.get("segment");

  const admin = createAdminClient();

  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);

  const { data: orders } = await admin
    .from("orders")
    .select(
      "id, customer_phone, customer_id, customer_name, total_amount, created_at, status",
    )
    .eq("restaurant_id", RIALTO_RESTAURANT_ID)
    .gte("created_at", oneYearAgo.toISOString())
    .limit(5000);

  const { data: customerCards } = await admin
    .from("customer_cards")
    .select(
      `id, is_fully_activated, customer:customer_id (id, phone, first_name, last_name, date_of_birth, age_range, gender, activated_at)`,
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
        activated_at: string | null;
      } | null;
    })
    .filter((c): c is NonNullable<typeof c> => Boolean(c && c.phone));

  const rows = buildCustomerAnalytics(orders ?? [], customers);

  let filtered = rows;
  if (search) {
    filtered = filtered.filter(
      (r) =>
        r.first_name.toLowerCase().includes(search) ||
        r.last_name.toLowerCase().includes(search) ||
        r.phone.includes(search),
    );
  }
  if (segmentFilter) {
    filtered = filtered.filter((r) => r.segment === segmentFilter);
  }

  return NextResponse.json({
    ok: true,
    total: filtered.length,
    customers: filtered.slice(0, 200),
  });
}
