import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { phone?: string; code?: string };
  const phone = (body.phone ?? "").trim().replace(/\s/g, "");
  const code  = (body.code  ?? "").trim();

  if (!phone || !code) {
    return NextResponse.json({ verified: false, error: "Données manquantes." }, { status: 400 });
  }

  const sb  = serviceClient();
  const now = new Date().toISOString();

  const { data } = await sb
    .from("phone_verifications")
    .select("id")
    .eq("phone", phone)
    .eq("code", code)
    .eq("verified", false)
    .gte("expires_at", now)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ verified: false, error: "Code invalide ou expiré. Réessayez." });
  }

  await sb.from("phone_verifications").update({ verified: true }).eq("id", data.id);

  return NextResponse.json({ verified: true });
}
