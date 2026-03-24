import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSms, normalizePhone } from "@/lib/brevo";

/**
 * POST /api/sms/welcome
 * Body: { customer_card_id: string }
 * Sends a welcome SMS to the customer if the business is on the Pro plan.
 * Called from the public /join page — no auth required.
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

  // Fetch customer phone + business plan in one query
  const { data } = await supabase
    .from("customer_cards")
    .select(`
      id,
      customers (phone),
      loyalty_cards (
        businesses (plan)
      )
    `)
    .eq("id", customer_card_id)
    .single();

  if (!data) {
    return NextResponse.json({ sent: false, reason: "card not found" });
  }

  const customer = data.customers as unknown as { phone: string | null } | null;
  const loyaltyCard = data.loyalty_cards as unknown as { businesses: { plan: string | null } | null } | null;
  const plan = loyaltyCard?.businesses?.plan ?? null;
  const phone = customer?.phone ?? null;

  if (plan !== "pro") {
    return NextResponse.json({ sent: false, reason: "not pro plan" });
  }
  if (!phone) {
    return NextResponse.json({ sent: false, reason: "no phone" });
  }

  const cardUrl = `https://www.stampify.ch/card/${customer_card_id}`;
  const message = `Bienvenue sur Stampify ! Retrouvez votre carte de fidélité ici : ${cardUrl}`;

  try {
    await sendSms(normalizePhone(phone), message);
    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Brevo welcome SMS error:", err);
    return NextResponse.json({ sent: false, reason: "sms_error" }, { status: 500 });
  }
}
