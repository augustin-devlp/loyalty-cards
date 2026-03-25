// TODO: vérifier via Google Business Profile API
// Pour l'instant, on fait confiance au client et on marque directement google_review_verified = true.
// Une vraie vérification nécessiterait OAuth Google + appel à l'API Google Business Profile.

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  let body: { entryId: string; lotteryId: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { entryId, lotteryId } = body;

  if (!entryId || !lotteryId) {
    return NextResponse.json({ error: "entryId et lotteryId sont requis" }, { status: 400 });
  }

  // Verify the entry belongs to this lottery
  const { data: entry, error: fetchError } = await supabase
    .from("lottery_entries")
    .select("id")
    .eq("id", entryId)
    .eq("lottery_id", lotteryId)
    .single();

  if (fetchError || !entry) {
    return NextResponse.json({ error: "Participation introuvable" }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from("lottery_entries")
    .update({
      google_review_verified: true,
      review_submitted_at: new Date().toISOString(),
    })
    .eq("id", entryId);

  if (updateError) {
    console.error("Error verifying review:", updateError);
    return NextResponse.json({ error: "Erreur lors de la vérification" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
