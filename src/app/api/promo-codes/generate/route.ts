import { NextRequest, NextResponse } from "next/server";
import { generatePromoCode, type PromoSource, type PromoDiscountType } from "@/lib/promoCodes";

/**
 * POST /api/promo-codes/generate
 * Génère un nouveau code promo en DB.
 *
 * Body : {
 *   business_id: string,
 *   restaurant_id?: string,
 *   customer_id?: string | null,
 *   phone?: string | null,
 *   source: 'spin_wheel' | 'lottery' | 'birthday' | 'manual' | 'signup_bonus',
 *   discount_type: 'percent' | 'fixed' | 'free_item',
 *   discount_value?: number,       // % ou CHF selon type
 *   free_item_label?: string,       // si free_item
 *   min_order_amount?: number,      // défaut 0
 *   max_uses?: number,              // défaut 1
 *   valid_days?: number,            // défaut 30
 * }
 *
 * Auth : protégé par secret partagé (env PROMO_GENERATE_SECRET) pour éviter
 * qu'un client externe puisse générer des codes arbitraires. Sert aussi à
 * nos propres endpoints internes (spin, lottery, dashboard).
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-api-secret");
  const expected = process.env.PROMO_GENERATE_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 },
    );
  }

  const body = (await req.json().catch(() => null)) as {
    business_id?: string;
    restaurant_id?: string;
    customer_id?: string | null;
    phone?: string | null;
    source?: PromoSource;
    discount_type?: PromoDiscountType;
    discount_value?: number;
    free_item_label?: string;
    min_order_amount?: number;
    max_uses?: number;
    valid_days?: number;
  } | null;

  if (!body?.business_id || !body.source || !body.discount_type) {
    return NextResponse.json(
      { error: "business_id, source et discount_type requis" },
      { status: 400 },
    );
  }

  const result = await generatePromoCode({
    business_id: body.business_id,
    restaurant_id: body.restaurant_id ?? null,
    customer_id: body.customer_id ?? null,
    phone: body.phone ?? null,
    source: body.source,
    discount_type: body.discount_type,
    discount_value: body.discount_value ?? null,
    free_item_label: body.free_item_label ?? null,
    min_order_amount: body.min_order_amount ?? 0,
    max_uses: body.max_uses ?? 1,
    valid_days: body.valid_days ?? 30,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    code: result.code.code,
    id: result.code.id,
    valid_until: result.code.valid_until,
  });
}
