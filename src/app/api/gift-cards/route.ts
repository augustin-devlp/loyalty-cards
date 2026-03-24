import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    let body: { amount?: number; customer_email?: string | null };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Body invalide" }, { status: 400 });
    }

    const amount = Number(body.amount);
    if (!amount || amount <= 0 || amount > 10000) {
      return NextResponse.json({ error: "Montant invalide (1–10000€)" }, { status: 400 });
    }

    const customerEmail = body.customer_email?.trim() || null;
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    // Generate unique code (retry if collision)
    let code = generateCode();
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from("gift_cards")
        .select("id")
        .eq("code", code)
        .single();
      if (!existing) break;
      code = generateCode();
      attempts++;
    }

    const { data, error } = await supabase
      .from("gift_cards")
      .insert({ business_id: user.id, code, amount, customer_email: customerEmail })
      .select()
      .single();

    if (error) {
      console.error("[gift-cards POST] erreur:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send email if customer_email is provided
    if (customerEmail) {
      try {
        // For now, we'll just log the email sending attempt
        // In production, integrate with Brevo, SendGrid, or similar
        console.log(`[gift-cards] Email notification would be sent to ${customerEmail} with code ${code} and amount ${amount}€`);
        // Email sending would go here - integration with Brevo/SendGrid/etc
      } catch (emailErr) {
        console.error("[gift-cards] Erreur lors de l'envoi d'email:", emailErr);
        // Don't fail the request if email fails to send
      }
    }

    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
