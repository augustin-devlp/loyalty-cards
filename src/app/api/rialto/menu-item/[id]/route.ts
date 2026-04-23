import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rialtoCorsHeaders, RIALTO_RESTAURANT_ID } from "@/lib/rialtoConstants";

/**
 * GET /api/rialto/menu-item/[id]
 * Retourne les infos d'un item du menu (pour ajout direct au cart depuis
 * l'upsell checkout Phase 11 C12).
 */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: rialtoCorsHeaders(req.headers.get("origin")),
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const headers = rialtoCorsHeaders(req.headers.get("origin"));
  const admin = createAdminClient();

  const { data: item } = await admin
    .from("menu_items")
    .select(
      "id, name, price, description, is_available, is_out_of_stock, has_options",
    )
    .eq("id", params.id)
    .eq("restaurant_id", RIALTO_RESTAURANT_ID)
    .maybeSingle();

  if (!item) {
    return NextResponse.json(
      { error: "not_found" },
      { status: 404, headers },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      item: {
        id: item.id,
        name: item.name,
        price: Number(item.price),
        description: item.description,
        is_available: item.is_available,
        is_out_of_stock: Boolean(
          (item as { is_out_of_stock?: boolean }).is_out_of_stock,
        ),
        has_options: item.has_options,
      },
    },
    { headers },
  );
}
