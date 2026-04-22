import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  RIALTO_BASE_URL,
  RIALTO_BUSINESS_ID,
  RIALTO_CARD_ID,
  RIALTO_RESTAURANT_ID,
} from "@/lib/rialtoConstants";
import { notifyAllClubMembers } from "@/lib/notifyAll";

/**
 * GET /api/admin/lotteries?business_id=X
 * Liste toutes les loteries d'un business (actives + archivées).
 *
 * POST /api/admin/lotteries
 * Crée une nouvelle loterie + déclenche SMS batch aux membres Club.
 * Body: { business_id, title, prize_description, draw_date,
 *         start_date?, end_date? }
 *
 * Auth : session Supabase (Mehmet connecté au dashboard).
 */

async function requireAuth() {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  return user;
}

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const businessId =
    url.searchParams.get("business_id") ?? RIALTO_BUSINESS_ID;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("lotteries")
    .select(
      "id, title, prize_description, reward_description, is_active, is_permanent, start_date, end_date, draw_date, created_at",
    )
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Enrichit chaque loterie avec le nombre de participants
  const lotteries = await Promise.all(
    (data ?? []).map(async (lot) => {
      const { count } = await admin
        .from("lottery_entries")
        .select("id", { count: "exact", head: true })
        .eq("lottery_id", lot.id);
      return { ...lot, entries_count: count ?? 0 };
    }),
  );

  return NextResponse.json({ lotteries });
}

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    business_id?: string;
    title?: string;
    prize_description?: string;
    draw_date?: string;
    start_date?: string | null;
    end_date?: string | null;
  } | null;

  if (!body?.title?.trim() || !body.prize_description?.trim() || !body.draw_date) {
    return NextResponse.json(
      { error: "title, prize_description et draw_date requis" },
      { status: 400 },
    );
  }

  const businessId = body.business_id ?? RIALTO_BUSINESS_ID;
  const admin = createAdminClient();

  // Crée la loterie
  const { data: lottery, error } = await admin
    .from("lotteries")
    .insert({
      business_id: businessId,
      title: body.title.trim(),
      prize_description: body.prize_description.trim(),
      reward_description: body.prize_description.trim(), // alias legacy
      draw_date: body.draw_date,
      start_date: body.start_date ?? new Date().toISOString(),
      end_date: body.end_date ?? null,
      is_active: true,
      is_permanent: false,
      max_winners: 1,
    })
    .select("*")
    .single();

  if (error || !lottery) {
    console.error("[admin/lotteries] insert failed", error);
    return NextResponse.json(
      { error: error?.message ?? "Création échouée" },
      { status: 500 },
    );
  }

  // Lance le batch SMS en arrière-plan (non bloquant pour la réponse)
  const lotteryUrl = `${RIALTO_BASE_URL.replace(/\/$/, "")}/rialto-club/loterie`;
  const drawDateFormatted = new Date(body.draw_date).toLocaleDateString(
    "fr-CH",
    {
      day: "numeric",
      month: "long",
    },
  );

  void notifyAllClubMembers({
    business_id: businessId,
    restaurant_id: RIALTO_RESTAURANT_ID,
    card_id: RIALTO_CARD_ID,
    template_key: "lottery_new",
    context_builder: (c) => ({
      customer_name: c.first_name ?? "",
      prize_description: body.prize_description!.trim(),
      draw_date: drawDateFormatted,
      lottery_url: lotteryUrl,
    }),
  }).then(
    (result) => {
      console.log(
        `[admin/lotteries] lottery=${lottery.id} SMS batch sent=${result.sent}/${result.total_targeted}`,
      );
    },
    (err) => {
      console.error(`[admin/lotteries] lottery=${lottery.id} SMS batch failed`, err);
    },
  );

  return NextResponse.json({
    lottery,
    message: `Loterie créée. SMS en cours d'envoi aux membres Club.`,
  });
}
