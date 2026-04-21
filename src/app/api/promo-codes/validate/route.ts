import { NextRequest, NextResponse } from "next/server";
import { validatePromoCode } from "@/lib/promoCodes";
import { rialtoCorsHeaders } from "@/lib/rialtoConstants";

/**
 * POST /api/promo-codes/validate
 * Vérifie qu'un code est valide pour un panier donné SANS le consommer.
 *
 * Body : {
 *   business_id: string,
 *   code: string,
 *   subtotal: number
 * }
 *
 * Public (CORS Rialto). Utilisé par la page Checkout pour afficher un
 * feedback en temps réel quand le client tape un code.
 */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: rialtoCorsHeaders(req.headers.get("origin")),
  });
}

export async function POST(req: NextRequest) {
  const headers = rialtoCorsHeaders(req.headers.get("origin"));
  const body = (await req.json().catch(() => null)) as {
    business_id?: string;
    code?: string;
    subtotal?: number;
  } | null;

  if (!body?.business_id || !body.code || typeof body.subtotal !== "number") {
    return NextResponse.json(
      { valid: false, error: "business_id, code et subtotal requis" },
      { status: 400, headers },
    );
  }

  const result = await validatePromoCode({
    business_id: body.business_id,
    code: body.code,
    subtotal: body.subtotal,
  });

  if (!result.ok) {
    return NextResponse.json(
      { valid: false, error: result.error },
      { status: 200, headers }, // 200 : c'est une validation métier, pas une erreur HTTP
    );
  }

  return NextResponse.json(
    {
      valid: true,
      code_id: result.code.id,
      code: result.code.code,
      discount_type: result.code.discount_type,
      discount_value: result.code.discount_value,
      free_item_label: result.code.free_item_label,
      discount_amount: result.discount_amount,
      message: result.message,
      valid_until: result.code.valid_until,
    },
    { headers },
  );
}
