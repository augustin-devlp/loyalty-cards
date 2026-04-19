import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * API publique (CORS ouvert pour rialto-lausanne.ch et rialto-lausanne.vercel.app).
 *
 * Active la carte fidélité Rialto pour un client (identifié par téléphone).
 * Upsert : si le client existe déjà, on met à jour les infos.
 *
 * Mehmet n'ayant pas encore de compte business, les tampons sont stockés
 * directement dans rialto_customers.stamps_count.
 */

const ALLOWED_ORIGINS = [
  "https://rialto-lausanne.ch",
  "https://www.rialto-lausanne.ch",
  "https://rialto-lausanne.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

function corsHeaders(origin: string | null): Record<string, string> {
  const allowOrigin =
    origin && ALLOWED_ORIGINS.some((o) => origin === o || origin.endsWith(o.replace("https://", "")))
      ? origin
      : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

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
      { status: 400, headers },
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
    .select("id, first_name, last_name, email, phone, stamps_count")
    .single();

  if (error) {
    console.error("[signup] upsert failed", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers });
  }
  return NextResponse.json({ customer: data }, { headers });
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  const url = new URL(req.url);
  const restaurantId = url.searchParams.get("restaurant_id");
  const phone = url.searchParams.get("phone");
  if (!restaurantId || !phone) {
    return NextResponse.json(
      { error: "restaurant_id et phone requis" },
      { status: 400, headers },
    );
  }
  const admin = createAdminClient();
  const { data } = await admin
    .from("rialto_customers")
    .select("id, first_name, last_name, email, phone, stamps_count")
    .eq("restaurant_id", restaurantId)
    .eq("phone", phone)
    .maybeSingle();
  return NextResponse.json({ customer: data ?? null }, { headers });
}
