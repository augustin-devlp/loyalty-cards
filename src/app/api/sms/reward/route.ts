import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSms, normalizePhone } from "@/lib/brevo";

/**
 * POST /api/sms/reward
 * Body: { customer_card_id: string }
 * Sends a reward notification SMS if the business is on the Pro plan.
 * Called from the dashboard scan page after stamp/points threshold is reached.
 */
export async function POST(req: NextRequest) {
  const { customer_card_id } = await req.json() as { customer_card_id: string };
  if (!customer_card_id) {
    return NextResponse.json({ error: "customer_card_id required" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch customer phone + business plan + reward description
  const { data } = await supabase
    .from("customer_cards")
    .select(`
      id,
      customers (first_name, phone),
      loyalty_cards (
        reward_description,
        businesses (plan)
      )
    `)
    .eq("id", customer_card_id)
    .single();

  if (!data) {
    return NextResponse.json({ sent: false, reason: "card not found" });
  }

  const customer = data.customers as unknown as { first_name: string; phone: string | null } | null;
  const loyaltyCard = data.loyalty_cards as unknown as {
    reward_description: string;
    businesses: { plan: string | null } | null;
  } | null;
  const plan = loyaltyCard?.businesses?.plan ?? null;
  const phone = customer?.phone ?? null;

  if (plan !== "pro") {
    return NextResponse.json({ sent: false, reason: "not pro plan" });
  }
  if (!phone) {
    return NextResponse.json({ sent: false, reason: "no phone" });
  }

  const reward = loyaltyCard?.reward_description ?? "votre récompense";
  const message = `${customer?.first_name ?? "Bonjour"}, votre récompense est disponible ! Présentez votre carte pour obtenir : ${reward}`;

  try {
    await sendSms(normalizePhone(phone), message);
    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Brevo reward SMS error:", err);
    return NextResponse.json({ sent: false, reason: "sms_error" }, { status: 500 });
  }
}
