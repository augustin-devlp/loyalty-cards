import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_PIN = "0808";

/**
 * GET /api/admin/business?pin=XXXX&id=<business_id>
 * Retourne les détails d'un business pour /admin/commerces/[id].
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pin = url.searchParams.get("pin");
  const businessId = url.searchParams.get("id");

  if (pin !== ADMIN_PIN) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  if (!businessId) {
    return NextResponse.json({ error: "id requis" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: business, error } = await admin
    .from("businesses")
    .select(
      "id, business_name, email, country, plan, subscription_status, status, phone, activation_code, created_at, enabled_features, google_place_id, stripe_customer_id, stripe_subscription_id, onboarding_completed",
    )
    .eq("id", businessId)
    .single();

  if (error || !business) {
    return NextResponse.json(
      { error: "Business introuvable" },
      { status: 404 },
    );
  }

  // Stats quick
  const { count: ordersCount } = await admin
    .from("orders")
    .select("id", { count: "exact", head: true })
    .in(
      "restaurant_id",
      (
        await admin
          .from("restaurants")
          .select("id")
          .eq("business_id", businessId)
      ).data?.map((r) => r.id) ?? [],
    );

  const { count: cardsCount } = await admin
    .from("loyalty_cards")
    .select("id", { count: "exact", head: true })
    .eq("business_id", businessId);

  return NextResponse.json({
    business,
    stats: {
      orders_count: ordersCount ?? 0,
      cards_count: cardsCount ?? 0,
    },
  });
}
