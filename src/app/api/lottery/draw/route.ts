import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface LotteryEntry {
  id: string;
  first_name: string;
  phone: string;
  email: string | null;
  google_review_verified: boolean;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { lotteryId: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { lotteryId } = body;

  if (!lotteryId) {
    return NextResponse.json({ error: "lotteryId manquant" }, { status: 400 });
  }

  // Verify the lottery belongs to this business
  const { data: lottery, error: lotteryError } = await supabase
    .from("lotteries")
    .select("id, max_winners, business_id")
    .eq("id", lotteryId)
    .eq("business_id", user.id)
    .single();

  if (lotteryError || !lottery) {
    return NextResponse.json({ error: "Loterie introuvable" }, { status: 404 });
  }

  // Fetch all entries for this lottery
  const { data: allEntries, error: entriesError } = await supabase
    .from("lottery_entries")
    .select("id, first_name, phone, email, google_review_verified")
    .eq("lottery_id", lotteryId);

  if (entriesError) {
    console.error("Error fetching entries:", entriesError);
    return NextResponse.json({ error: "Erreur lors de la récupération des participants" }, { status: 500 });
  }

  const entries = (allEntries ?? []) as LotteryEntry[];

  if (entries.length === 0) {
    return NextResponse.json({ error: "Aucun participant dans cette loterie" }, { status: 400 });
  }

  // Prefer verified Google reviewers; fall back to all entries
  const verifiedEntries = entries.filter((e) => e.google_review_verified);
  const pool = verifiedEntries.length > 0 ? verifiedEntries : entries;

  // Fisher-Yates shuffle on the pool, then pick max_winners
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const winnerCount = Math.min(lottery.max_winners, shuffled.length);
  const winners = shuffled.slice(0, winnerCount);
  const winnerIds = winners.map((w) => w.id);

  // Mark winners in the database
  const { error: updateError } = await supabase
    .from("lottery_entries")
    .update({ is_winner: true })
    .in("id", winnerIds);

  if (updateError) {
    console.error("Error marking winners:", updateError);
    return NextResponse.json({ error: "Erreur lors de la mise à jour des gagnants" }, { status: 500 });
  }

  return NextResponse.json({
    winners: winners.map((w) => ({ first_name: w.first_name, phone: w.phone })),
  });
}
