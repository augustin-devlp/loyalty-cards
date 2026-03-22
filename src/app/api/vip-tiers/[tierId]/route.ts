import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * PATCH  /api/vip-tiers/[tierId]  → update tier fields
 * DELETE /api/vip-tiers/[tierId]  → delete tier
 */

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ tierId: string }> }
) {
  const { tierId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as Partial<{
    tier_name: string;
    stamps_required: number;
    reward_description: string;
    discount_percentage: number | null;
    position: number;
  }>;

  // Verify ownership via join
  const { data: tier } = await supabase
    .from("vip_tiers")
    .select("id, loyalty_cards(business_id)")
    .eq("id", tierId)
    .single();

  if (!tier) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const lc = tier as unknown as { loyalty_cards: { business_id: string } | null };
  if (lc.loyalty_cards?.business_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("vip_tiers")
    .update(body)
    .eq("id", tierId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tier: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ tierId: string }> }
) {
  const { tierId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify ownership
  const { data: tier } = await supabase
    .from("vip_tiers")
    .select("id, loyalty_cards(business_id)")
    .eq("id", tierId)
    .single();

  if (!tier) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const lc = tier as unknown as { loyalty_cards: { business_id: string } | null };
  if (lc.loyalty_cards?.business_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("vip_tiers").delete().eq("id", tierId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
