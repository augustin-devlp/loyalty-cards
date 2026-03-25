import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendSms, normalizePhone } from "@/lib/brevo";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { phone, message } = await req.json() as { phone?: string; message?: string };
    if (!phone || !message) {
      return NextResponse.json({ error: "phone et message requis" }, { status: 400 });
    }

    await sendSms(normalizePhone(phone), message);
    return NextResponse.json({ sent: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur envoi SMS";
    console.error("[send-card SMS]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
