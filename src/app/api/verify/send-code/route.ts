import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSms, normalizePhone } from "@/lib/brevo";

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function isE164(phone: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test(phone.replace(/\s/g, ""));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { phone?: string };
  const phone = (body.phone ?? "").trim().replace(/\s/g, "");

  if (!isE164(phone)) {
    return NextResponse.json(
      { error: "Format invalide. Utilisez le format international : +33 6 12 34 56 78 ou +41 76 123 45 67" },
      { status: 400 }
    );
  }

  const sb = serviceClient();

  // Rate limit: max 3 codes per number in the last 10 minutes
  const windowStart = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await sb
    .from("phone_verifications")
    .select("id", { count: "exact", head: true })
    .eq("phone", phone)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= 3) {
    return NextResponse.json(
      { error: "Trop de tentatives. Attendez quelques minutes avant de réessayer." },
      { status: 429 }
    );
  }

  const code = String(Math.floor(1000 + Math.random() * 9000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await sb.from("phone_verifications").insert({ phone, code, expires_at: expiresAt });

  try {
    await sendSms(normalizePhone(phone), `Votre code Stampify : ${code}. Valable 10 minutes.`);
  } catch (err) {
    console.error("[verify/send-code] SMS error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du SMS. Vérifiez votre numéro." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
