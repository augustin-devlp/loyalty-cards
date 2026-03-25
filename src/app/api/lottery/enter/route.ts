import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  let body: {
    lotteryId: string;
    firstName: string;
    phone: string;
    email?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { lotteryId, firstName, phone, email } = body;

  if (!lotteryId || !firstName || !phone) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  // Verify the lottery is active
  const { data: lottery, error: lotteryError } = await supabase
    .from("lotteries")
    .select("id, is_active")
    .eq("id", lotteryId)
    .single();

  if (lotteryError || !lottery) {
    return NextResponse.json({ error: "Loterie introuvable" }, { status: 404 });
  }

  if (!lottery.is_active) {
    return NextResponse.json({ error: "Cette loterie n'est plus active" }, { status: 400 });
  }

  // Anti-doublon : check by phone
  const { data: existing } = await supabase
    .from("lottery_entries")
    .select("id")
    .eq("lottery_id", lotteryId)
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Vous êtes déjà inscrit à cette loterie" },
      { status: 409 }
    );
  }

  // Insert entry
  const { data: entry, error: insertError } = await supabase
    .from("lottery_entries")
    .insert({
      lottery_id: lotteryId,
      first_name: firstName.trim(),
      phone: phone.trim(),
      email: email?.trim() ?? null,
      google_review_verified: false,
      is_winner: false,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Error inserting entry:", insertError);
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }

  return NextResponse.json({ entryId: entry.id, ok: true }, { status: 201 });
}
