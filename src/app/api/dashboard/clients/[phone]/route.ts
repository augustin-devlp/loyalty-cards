import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { RIALTO_CARD_ID, RIALTO_RESTAURANT_ID } from "@/lib/rialtoConstants";
import { normalizePhone } from "@/lib/analytics";

/**
 * GET /api/dashboard/clients/[phone]
 *
 * Détail client : infos + orders historique + sms_logs + promo codes actifs.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { phone: string } },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const phoneNorm = normalizePhone(decodeURIComponent(params.phone));
  const admin = createAdminClient();

  // Chercher le customer (un seul téléphone peut matcher plusieurs formats)
  const { data: allCustomers } = await admin
    .from("customers")
    .select(
      "id, first_name, last_name, phone, email, date_of_birth, age_range, gender, activated_at, created_at",
    );

  const customer = (allCustomers ?? []).find(
    (c) => normalizePhone(c.phone ?? "") === phoneNorm,
  );

  // Orders — matching sur customer_phone normalisé
  const { data: allOrders } = await admin
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_phone, total_amount, status, created_at, promo_discount_amount, fulfillment_type",
    )
    .eq("restaurant_id", RIALTO_RESTAURANT_ID)
    .order("created_at", { ascending: false })
    .limit(200);

  const orders = (allOrders ?? []).filter(
    (o) => normalizePhone(o.customer_phone ?? "") === phoneNorm,
  );

  // Carte fidélité Rialto
  const { data: card } = await admin
    .from("customer_cards")
    .select(
      "id, short_code, current_stamps, rewards_claimed, is_fully_activated, created_at",
    )
    .eq("card_id", RIALTO_CARD_ID)
    .eq("customer_id", customer?.id ?? "00000000-0000-0000-0000-000000000000")
    .maybeSingle();

  // SMS logs (via phone OU customer_id)
  let smsLogs: Array<Record<string, unknown>> = [];
  if (customer) {
    const { data: logs } = await admin
      .from("sms_logs")
      .select(
        "id, created_at, template_key, sender_used, content, status, error_message, cost_credits, order_id",
      )
      .or(`customer_id.eq.${customer.id},phone.eq.${phoneNorm}`)
      .order("created_at", { ascending: false })
      .limit(100);
    smsLogs = logs ?? [];
  } else {
    const { data: logs } = await admin
      .from("sms_logs")
      .select(
        "id, created_at, template_key, sender_used, content, status, error_message, cost_credits, order_id",
      )
      .eq("phone", phoneNorm)
      .order("created_at", { ascending: false })
      .limit(100);
    smsLogs = logs ?? [];
  }

  // Promo codes actifs
  const { data: promoCodes } = await admin
    .from("promo_codes")
    .select("code, discount_type, discount_value, uses_count, max_uses, valid_until, source")
    .eq("customer_id", customer?.id ?? "00000000-0000-0000-0000-000000000000")
    .order("valid_from", { ascending: false })
    .limit(20);

  return NextResponse.json({
    ok: true,
    phone: phoneNorm,
    customer,
    card,
    orders,
    sms_logs: smsLogs,
    promo_codes: promoCodes ?? [],
    totals: {
      orders: orders.filter((o) => o.status !== "cancelled").length,
      revenue: Number(
        orders
          .filter((o) => o.status !== "cancelled")
          .reduce((s, o) => s + Number(o.total_amount ?? 0), 0)
          .toFixed(2),
      ),
      sms_count: smsLogs.length,
      sms_sent: smsLogs.filter((l) => l.status === "sent").length,
      sms_failed: smsLogs.filter((l) => l.status === "failed").length,
    },
  });
}
