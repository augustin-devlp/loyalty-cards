import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/rialto/customers/signup
 * Body: { restaurant_id, phone, first_name, last_name, email? }
 *
 * Active la carte fidélité Rialto pour un client (identifié par téléphone).
 * Upsert : si le client existe déjà, on met à jour les infos.
 *
 * Note: Mehmet n'ayant pas encore de compte business, il n'y a pas encore
 * de loyalty_cards row pour Rialto. On stocke les tampons directement dans
 * rialto_customers.stamps_count ; on synchronisera plus tard avec
 * customer_cards quand business_id sera attribué.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    restaurant_id?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    email?: string | null;
  } | null;

  if (!body?.restaurant_id || !body.phone || !body.first_name) {
    return NextResponse.json(
      { error: "restaurant_id, phone, first_name requis" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("rialto_customers")
    .upsert(
      {
        restaurant_id: body.restaurant_id,
        phone: body.phone,
        first_name: body.first_name,
        last_name: body.last_name ?? null,
        email: body.email ?? null,
      },
      { onConflict: "restaurant_id,phone" },
    )
    .select("id, first_name, last_name, email, stamps_count")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ customer: data });
}

/**
 * GET /api/rialto/customers/signup?restaurant_id=X&phone=Y
 * Retourne l'état actuel de la carte (tampons, etc) pour ce client.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const restaurantId = url.searchParams.get("restaurant_id");
  const phone = url.searchParams.get("phone");
  if (!restaurantId || !phone) {
    return NextResponse.json(
      { error: "restaurant_id et phone requis" },
      { status: 400 },
    );
  }
  const admin = createAdminClient();
  const { data } = await admin
    .from("rialto_customers")
    .select("id, first_name, last_name, email, stamps_count")
    .eq("restaurant_id", restaurantId)
    .eq("phone", phone)
    .maybeSingle();
  return NextResponse.json({ customer: data ?? null });
}
