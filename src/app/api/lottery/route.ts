import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fetchEntries = searchParams.get("entries") === "true";
  const lotteryId = searchParams.get("lotteryId");

  // Return entries for a specific lottery (verify ownership first)
  if (fetchEntries && lotteryId) {
    const { data: lottery, error: lotteryError } = await supabase
      .from("lotteries")
      .select("id")
      .eq("id", lotteryId)
      .eq("business_id", user.id)
      .single();

    if (lotteryError || !lottery) {
      return NextResponse.json({ error: "Loterie introuvable" }, { status: 404 });
    }

    const { data: entries, error: entriesError } = await supabase
      .from("lottery_entries")
      .select("id, first_name, phone, email, google_review_verified, is_winner, created_at")
      .eq("lottery_id", lotteryId)
      .order("created_at", { ascending: false });

    if (entriesError) {
      console.error("Error fetching entries:", entriesError);
      return NextResponse.json({ error: "Erreur lors de la récupération des participants" }, { status: 500 });
    }

    return NextResponse.json({ entries: entries ?? [] });
  }

  // Default: return all lotteries with entry count
  const { data: lotteries, error } = await supabase
    .from("lotteries")
    .select("*, lottery_entries(count)")
    .eq("business_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching lotteries:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des loteries" }, { status: 500 });
  }

  return NextResponse.json({ lotteries: lotteries ?? [] });
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

  let body: {
    title: string;
    reward_description: string;
    max_winners: number;
    is_permanent: boolean;
    start_date?: string | null;
    end_date?: string | null;
    draw_date?: string | null;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { title, reward_description, max_winners, is_permanent, start_date, end_date, draw_date } = body;

  if (!title || !reward_description || !max_winners) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  const { data: lottery, error } = await supabase
    .from("lotteries")
    .insert({
      business_id: user.id,
      title: title.trim(),
      reward_description: reward_description.trim(),
      max_winners,
      is_permanent: is_permanent ?? false,
      is_active: true,
      start_date: is_permanent ? null : (start_date ?? null),
      end_date: is_permanent ? null : (end_date ?? null),
      draw_date: draw_date ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating lottery:", error);
    return NextResponse.json({ error: "Erreur lors de la création de la loterie" }, { status: 500 });
  }

  return NextResponse.json({ lottery }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id: string } & Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "id manquant" }, { status: 400 });
  }

  const { data: lottery, error } = await supabase
    .from("lotteries")
    .update(updates)
    .eq("id", id)
    .eq("business_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating lottery:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }

  return NextResponse.json({ lottery });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id manquant" }, { status: 400 });
  }

  const { error } = await supabase
    .from("lotteries")
    .delete()
    .eq("id", id)
    .eq("business_id", user.id);

  if (error) {
    console.error("Error deleting lottery:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
