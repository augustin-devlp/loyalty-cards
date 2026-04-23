import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  rialtoCorsHeaders,
  RIALTO_RESTAURANT_ID,
} from "@/lib/rialtoConstants";

/**
 * POST /api/rialto/referrals/generate
 * Body: { customer_id: string }
 *
 * Phase 11 C9 — Génère (ou retourne) un code de parrainage unique pour
 * un client Rialto. Le code sera partagé par SMS/WhatsApp/social.
 */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: rialtoCorsHeaders(req.headers.get("origin")),
  });
}

function generateCode(firstName: string, customerId: string): string {
  const prefix = (firstName || "RI").slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "");
  const suffix = customerId.replace(/-/g, "").slice(0, 5).toUpperCase();
  return `${prefix}-${suffix}`;
}

export async function POST(req: NextRequest) {
  const headers = rialtoCorsHeaders(req.headers.get("origin"));

  const body = (await req.json().catch(() => null)) as {
    customer_id?: string;
  } | null;

  if (!body?.customer_id) {
    return NextResponse.json(
      { error: "customer_id requis" },
      { status: 400, headers },
    );
  }

  const admin = createAdminClient();

  const { data: customer } = await admin
    .from("customers")
    .select("id, first_name, phone")
    .eq("id", body.customer_id)
    .maybeSingle();

  if (!customer) {
    return NextResponse.json(
      { error: "customer_not_found" },
      { status: 404, headers },
    );
  }

  // Check if there's already a pending referral code (don't create duplicates)
  const { data: existing } = await admin
    .from("referrals")
    .select("referral_code")
    .eq("referrer_customer_id", body.customer_id)
    .eq("status", "pending")
    .is("referee_phone", null)
    .limit(1)
    .maybeSingle();

  if (existing?.referral_code) {
    return NextResponse.json(
      { ok: true, code: existing.referral_code, existing: true },
      { headers },
    );
  }

  const code = generateCode(customer.first_name ?? "RIA", customer.id);

  const { error } = await admin.from("referrals").insert({
    referrer_customer_id: customer.id,
    referral_code: code,
    restaurant_id: RIALTO_RESTAURANT_ID,
    status: "pending",
  });

  if (error) {
    console.error("[referrals/generate]", error.message);
    return NextResponse.json(
      { error: "save_failed", detail: error.message },
      { status: 500, headers },
    );
  }

  return NextResponse.json(
    { ok: true, code, existing: false },
    { headers },
  );
}
