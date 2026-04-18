import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/menu/items
 * Body: { restaurant_id, category_id, name, description?, price,
 *         is_vegetarian?, is_spicy?, has_options?, display_order? }
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    restaurant_id?: string;
    category_id?: string;
    name?: string;
    description?: string | null;
    price?: number;
    is_vegetarian?: boolean;
    is_spicy?: boolean;
    has_options?: boolean;
    display_order?: number;
    image_url?: string | null;
  } | null;

  if (!body?.restaurant_id || !body.category_id || !body.name || typeof body.price !== "number") {
    return NextResponse.json(
      { error: "restaurant_id, category_id, name, price requis" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("menu_items")
    .insert({
      restaurant_id: body.restaurant_id,
      category_id: body.category_id,
      name: body.name,
      description: body.description ?? null,
      price: body.price,
      is_vegetarian: body.is_vegetarian ?? false,
      is_spicy: body.is_spicy ?? false,
      has_options: body.has_options ?? false,
      display_order: body.display_order ?? 999,
      image_url: body.image_url ?? null,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
