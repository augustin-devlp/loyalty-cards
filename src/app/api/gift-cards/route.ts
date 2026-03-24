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

    let body: { amount?: number };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Body invalide" }, { status: 400 });
    }

    const amount = Number(body.amount);
    if (!amount || amount <= 0 || amount > 10000) {
      return NextResponse.json({ error: "Montant invalide (1–10000€)" }, { status: 400 });
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
      .insert({ business_id: user.id, code, amount })
      .select()
      .single();

    if (error) {
      console.error("[gift-cards POST] erreur:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
