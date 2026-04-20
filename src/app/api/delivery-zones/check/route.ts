import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rialtoCorsHeaders } from "@/lib/rialtoConstants";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: rialtoCorsHeaders(req.headers.get("origin")),
  });
}

/**
 * GET /api/delivery-zones/check?restaurant_id=X&postal_code=XXXX
 * Vérifie qu'un code postal est desservi par le restaurant.
 * Réponse : { covered: boolean, zone?: {...} }
 */
export async function GET(req: NextRequest) {
  const headers = rialtoCorsHeaders(req.headers.get("origin"));
  const url = new URL(req.url);
  const restaurantId = url.searchParams.get("restaurant_id");
  const postalCode = url.searchParams.get("postal_code")?.trim();

  if (!restaurantId || !postalCode) {
    return NextResponse.json(
      { error: "restaurant_id et postal_code requis" },
      { status: 400, headers },
    );
  }

  const admin = createAdminClient();
  const { data: zone } = await admin
    .from("delivery_zones")
    .select(
      "id, postal_code, city, delivery_fee, min_order_amount, estimated_delivery_minutes, is_active",
    )
    .eq("restaurant_id", restaurantId)
    .eq("postal_code", postalCode)
    .eq("is_active", true)
    .maybeSingle();

  if (!zone) {
    return NextResponse.json({ covered: false }, { headers });
  }
  return NextResponse.json({ covered: true, zone }, { headers });
}
