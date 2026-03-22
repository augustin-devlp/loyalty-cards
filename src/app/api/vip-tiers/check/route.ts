import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendSms, normalizePhone } from "@/lib/brevo";

/**
 * POST /api/vip-tiers/check
 * Body: { customer_card_id: string }
 *
 * Called after a stamp/points is added.
 * Checks if the customer reached a new VIP tier, updates current_tier_id,
 * and sends an SMS congratulation.
 *
 * Returns: { upgraded: boolean, new_tier?: string }
 */
export async function POST(req: NextRequest) {
  const { customer_card_id } = await req.json() as { customer_card_id: string };
  if (!customer_card_id) {
    return NextResponse.json({ error: "customer_card_id required" }, { status: 400 });
  }

  // Use service role to bypass RLS for internal logic
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch customer card with all needed context
  const { data: cc } = await supabase
    .from("customer_cards")
    .select(`
      id,
      current_stamps,
      current_points,
      current_tier_id,
      card_id,
      customers ( first_name, phone ),
      loyalty_cards (
        id,
        card_type,
        stamps_required,
        businesses ( business_name, plan )
      )
    `)
    .eq("id", customer_card_id)
    .single();

  if (!cc) return NextResponse.json({ upgraded: false, reason: "not found" });

  const card = cc.loyalty_cards as unknown as {
    id: string;
    card_type: "stamp" | "points";
    stamps_required: number | null;
    businesses: { business_name: string; plan: string | null } | null;
  };

  const plan = card.businesses?.plan ?? "";
  if (plan !== "pro" && plan !== "business") {
    return NextResponse.json({ upgraded: false, reason: "plan not eligible" });
  }

  // Fetch all tiers for this card ordered by stamps_required desc
  const { data: tiers } = await supabase
    .from("vip_tiers")
    .select("id, tier_name, stamps_required, reward_description")
    .eq("card_id", card.id)
    .order("stamps_required", { ascending: false });

  if (!tiers || tiers.length === 0) {
    return NextResponse.json({ upgraded: false, reason: "no tiers" });
  }

  // Current progress
  const progress = card.card_type === "stamp"
    ? (cc.current_stamps ?? 0)
    : (cc.current_points ?? 0);

  // Find the highest tier the customer qualifies for
  const newTier = tiers.find((t) => progress >= t.stamps_required) ?? null;

  if (!newTier) {
    return NextResponse.json({ upgraded: false, reason: "no tier reached yet" });
  }

  // No change if already on this tier
  if (cc.current_tier_id === newTier.id) {
    return NextResponse.json({ upgraded: false, reason: "already on this tier" });
  }

  // Update current_tier_id
  await supabase
    .from("customer_cards")
    .update({ current_tier_id: newTier.id })
    .eq("id", customer_card_id);

  // Send SMS if customer has phone
  const customer = cc.customers as unknown as { first_name: string; phone: string | null } | null;
  if (customer?.phone) {
    const businessName = card.businesses?.business_name ?? "votre commerce";
    const message = `Félicitations ${customer.first_name} ! Vous passez au palier ${newTier.tier_name} chez ${businessName}. Votre récompense : ${newTier.reward_description}`;
    try {
      await sendSms(normalizePhone(customer.phone), message);
    } catch (err) {
      console.error("VIP tier SMS error:", err);
    }
  }

  return NextResponse.json({ upgraded: true, new_tier: newTier.tier_name });
}
