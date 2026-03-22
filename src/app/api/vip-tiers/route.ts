import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET  /api/vip-tiers?card_id=xxx  → list tiers for a card
 * POST /api/vip-tiers              → create a tier { card_id, tier_name, stamps_required, reward_description, discount_percentage? }
 */

export async function GET(req: NextRequest) {
  const card_id = req.nextUrl.searchParams.get("card_id");
  if (!card_id) return NextResponse.json({ error: "card_id required" }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify card belongs to user
  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("id")
    .eq("id", card_id)
    .eq("business_id", user.id)
    .single();
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("vip_tiers")
    .select("*")
    .eq("card_id", card_id)
    .order("position", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tiers: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    card_id: string;
    tier_name: string;
    stamps_required: number;
    reward_description: string;
    discount_percentage?: number | null;
  };
  const { card_id, tier_name, stamps_required, reward_description, discount_percentage } = body;

  // Verify ownership
  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("id, businesses(plan)")
    .eq("id", card_id)
    .eq("business_id", user.id)
    .single();
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const plan = (card as unknown as { businesses: { plan: string } | null }).businesses?.plan ?? "";
  if (plan !== "pro" && plan !== "business") {
    return NextResponse.json({ error: "Plan Pro ou Business requis" }, { status: 403 });
  }

  // Get current max position
  const { data: maxRow } = await supabase
    .from("vip_tiers")
    .select("position")
    .eq("card_id", card_id)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const position = (maxRow?.position ?? -1) + 1;

  const { data, error } = await supabase
    .from("vip_tiers")
    .insert({ card_id, tier_name, stamps_required, reward_description, discount_percentage: discount_percentage ?? null, position })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tier: data });
}
