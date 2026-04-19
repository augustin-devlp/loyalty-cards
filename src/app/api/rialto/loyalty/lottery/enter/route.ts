import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  RIALTO_LOTTERY_ID,
  rialtoCorsHeaders,
} from "@/lib/rialtoConstants";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: rialtoCorsHeaders(req.headers.get("origin")),
  });
}

/**
 * POST /api/rialto/loyalty/lottery/enter
 * Body: { phone, first_name }
 *
 * Ajoute une participation à la loterie mensuelle de Rialto.
 * Idempotent : si déjà inscrit, retourne 200 avec already_entered=true.
 */
export async function POST(req: NextRequest) {
  const headers = rialtoCorsHeaders(req.headers.get("origin"));
  const body = (await req.json().catch(() => null)) as {
    phone?: string;
    first_name?: string;
  } | null;

  if (!body?.phone?.trim() || !body.first_name?.trim()) {
    return NextResponse.json(
      { error: "phone et first_name requis" },
      { status: 400, headers },
    );
  }

  const admin = createAdminClient();
  const phone = body.phone.trim();

  const { data: lottery } = await admin
    .from("lotteries")
    .select("id, is_active, end_date")
    .eq("id", RIALTO_LOTTERY_ID)
    .maybeSingle();
  if (!lottery || !lottery.is_active) {
    return NextResponse.json(
      { error: "La loterie n'est pas active." },
      { status: 409, headers },
    );
  }

  const { data: existing } = await admin
    .from("lottery_participants")
    .select("id")
    .eq("lottery_id", RIALTO_LOTTERY_ID)
    .eq("phone", phone)
    .maybeSingle();
  if (existing) {
    return NextResponse.json(
      { ok: true, already_entered: true },
      { headers },
    );
  }

  const { error } = await admin.from("lottery_participants").insert({
    lottery_id: RIALTO_LOTTERY_ID,
    first_name: body.first_name.trim(),
    phone,
  });
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers },
    );
  }
  return NextResponse.json({ ok: true, already_entered: false }, { headers });
}
