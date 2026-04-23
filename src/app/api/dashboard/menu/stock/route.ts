import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * PATCH /api/dashboard/menu/stock
 * Body: { menu_item_id: string, is_out_of_stock: boolean, reason?: string, auto_reactivate_hours?: number }
 *
 * Phase 11 C8 — Toggle la rupture de stock d'un plat. Optionnellement
 * programme une réactivation auto (auto_reactivate_hours, ex: 24 pour
 * demain, 0 pour "jusqu'à réactivation manuelle").
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    menu_item_id?: string;
    is_out_of_stock?: boolean;
    reason?: string;
    auto_reactivate_hours?: number;
  } | null;

  if (!body?.menu_item_id || typeof body.is_out_of_stock !== "boolean") {
    return NextResponse.json(
      { error: "menu_item_id + is_out_of_stock requis" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  // Verify ownership (merchant only toggles his own business's items)
  const { data: item } = await admin
    .from("menu_items")
    .select("id, restaurant_id")
    .eq("id", body.menu_item_id)
    .maybeSingle();

  if (!item) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Check business link
  const { data: rest } = await admin
    .from("restaurants")
    .select("business_id")
    .eq("id", item.restaurant_id)
    .maybeSingle();
  if (!rest || rest.business_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const now = new Date();
  const reactivateAt =
    body.is_out_of_stock && body.auto_reactivate_hours && body.auto_reactivate_hours > 0
      ? new Date(now.getTime() + body.auto_reactivate_hours * 3600_000).toISOString()
      : null;

  const { error } = await admin
    .from("menu_items")
    .update({
      is_out_of_stock: body.is_out_of_stock,
      out_of_stock_since: body.is_out_of_stock ? now.toISOString() : null,
      out_of_stock_reason: body.is_out_of_stock ? body.reason ?? null : null,
      out_of_stock_auto_reactivate_at: reactivateAt,
    })
    .eq("id", body.menu_item_id);

  if (error) {
    return NextResponse.json(
      { error: "update_failed", detail: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    is_out_of_stock: body.is_out_of_stock,
    auto_reactivate_at: reactivateAt,
  });
}
