import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/delivery-zones?restaurant_id=X — liste les zones
 * POST /api/delivery-zones — crée une zone (auth requise)
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const restaurantId = url.searchParams.get("restaurant_id");
  if (!restaurantId) {
    return NextResponse.json(
      { error: "restaurant_id requis" },
      { status: 400 },
    );
  }
  const admin = createAdminClient();
  const { data } = await admin
    .from("delivery_zones")
    .select(
      "id, postal_code, city, delivery_fee, min_order_amount, estimated_delivery_minutes, is_active, created_at",
    )
    .eq("restaurant_id", restaurantId)
    .order("postal_code");
  return NextResponse.json({ zones: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    restaurant_id?: string;
    postal_code?: string;
    city?: string;
    delivery_fee?: number;
    min_order_amount?: number;
    estimated_delivery_minutes?: number;
    is_active?: boolean;
  } | null;

  if (!body?.restaurant_id || !body.postal_code?.trim()) {
    return NextResponse.json(
      { error: "restaurant_id et postal_code requis" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("delivery_zones")
    .insert({
      restaurant_id: body.restaurant_id,
      postal_code: body.postal_code.trim(),
      city: body.city?.trim() || null,
      delivery_fee: body.delivery_fee ?? 0,
      min_order_amount: body.min_order_amount ?? 0,
      estimated_delivery_minutes: body.estimated_delivery_minutes ?? 45,
      is_active: body.is_active ?? true,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Ce code postal existe déjà pour ce restaurant." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ zone: data });
}
