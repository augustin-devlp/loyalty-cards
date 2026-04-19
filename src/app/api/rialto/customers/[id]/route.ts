import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_ORIGINS = [
  "https://rialto-lausanne.ch",
  "https://www.rialto-lausanne.ch",
  "https://rialto-lausanne.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

function corsHeaders(origin: string | null): Record<string, string> {
  const allowOrigin =
    origin && ALLOWED_ORIGINS.some((o) => origin === o)
      ? origin
      : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
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

/**
 * GET /api/rialto/customers/[id]
 * Détail d'un customer (utilisé après une modif pour rafraîchir).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const headers = corsHeaders(req.headers.get("origin"));
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("rialto_customers")
    .select("id, first_name, last_name, email, phone, stamps_count")
    .eq("id", params.id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404, headers });
  return NextResponse.json({ customer: data }, { headers });
}

/**
 * PATCH /api/rialto/customers/[id]
 * Body: { first_name?, last_name?, phone?, email? }
 * Met à jour une ligne rialto_customers par son id.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const headers = corsHeaders(req.headers.get("origin"));
  const body = (await req.json().catch(() => null)) as {
    first_name?: string;
    last_name?: string | null;
    phone?: string;
    email?: string | null;
  } | null;
  if (!body) return NextResponse.json({ error: "Body invalide" }, { status: 400, headers });

  const update: Record<string, unknown> = {};
  if (typeof body.first_name === "string" && body.first_name.trim()) {
    update.first_name = body.first_name.trim();
  }
  if (body.last_name !== undefined) {
    update.last_name =
      typeof body.last_name === "string" ? body.last_name.trim() || null : null;
  }
  if (typeof body.phone === "string" && body.phone.trim()) {
    update.phone = body.phone.trim();
  }
  if (body.email !== undefined) {
    update.email =
      typeof body.email === "string" ? body.email.trim() || null : null;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Rien à mettre à jour" }, { status: 400, headers });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("rialto_customers")
    .update(update)
    .eq("id", params.id)
    .select("id, first_name, last_name, email, phone, stamps_count")
    .single();

  if (error) {
    // Gestion du cas "nouveau phone déjà utilisé par un autre customer"
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Ce numéro est déjà utilisé par une autre carte fidélité." },
        { status: 409, headers },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500, headers });
  }
  return NextResponse.json({ customer: data }, { headers });
}
