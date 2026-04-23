import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildCustomerAnalytics } from "@/lib/analytics";
import type { RFMSegment } from "@/lib/analytics";
import { RIALTO_RESTAURANT_ID, RIALTO_CARD_ID } from "@/lib/rialtoConstants";

/**
 * GET /api/dashboard/analytics/segment?segment=champions
 *
 * Liste détaillée des clients d'un segment donné — utilisé pour
 * "Envoyer une campagne SMS ciblée" depuis le dashboard analytics.
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
  const segment = url.searchParams.get("segment") as RFMSegment | null;
  if (!segment) {
    return NextResponse.json(
      { error: "segment query param required" },
      { status: 400 },
    );
  }

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

  const rows = buildCustomerAnalytics(orders ?? [], customers);
  const filtered = rows.filter((r) => r.segment === segment);

  return NextResponse.json({
    ok: true,
    segment,
    count: filtered.length,
    customers: filtered,
  });
}
