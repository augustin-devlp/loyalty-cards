import { NextRequest, NextResponse } from "next/server";
import { applyPromoCode, validatePromoCode } from "@/lib/promoCodes";
import { rialtoCorsHeaders } from "@/lib/rialtoConstants";

/**
 * POST /api/promo-codes/apply
 * Consomme un code promo (atomique) et l'attache à une commande existante.
 *
 * Body : {
 *   business_id: string,
 *   code: string,              // code lisible (pas l'id)
 *   order_id: string,
 *   subtotal: number
 * }
 *
 * Public (CORS Rialto) mais protégé par la clé de rente : seul le backend
 * Rialto appelle cet endpoint juste après la création d'une commande.
 * Le code doit passer la validation avant d'être consommé.
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
    order_id?: string;
    subtotal?: number;
  } | null;

  if (
    !body?.business_id ||
    !body.code ||
    !body.order_id ||
    typeof body.subtotal !== "number"
  ) {
    return NextResponse.json(
      { ok: false, error: "business_id, code, order_id et subtotal requis" },
      { status: 400, headers },
    );
  }

  // 1. Re-valider pour récupérer le discount_amount + id
  const validation = await validatePromoCode({
    business_id: body.business_id,
    code: body.code,
    subtotal: body.subtotal,
  });

  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: validation.error },
      { status: 200, headers },
    );
  }

  // 2. Appliquer (atomique)
  const applied = await applyPromoCode({
    promo_code_id: validation.code.id,
    order_id: body.order_id,
    discount_amount: validation.discount_amount,
  });

  if (!applied.ok) {
    return NextResponse.json(
      { ok: false, error: applied.error },
      { status: 200, headers },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      code_id: applied.code.id,
      discount_amount: validation.discount_amount,
      uses_count: applied.code.uses_count,
      max_uses: applied.code.max_uses,
    },
    { headers },
  );
}
