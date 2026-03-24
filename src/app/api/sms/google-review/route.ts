import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSms, normalizePhone } from "@/lib/brevo";

/**
 * POST /api/sms/google-review
 * Body: { customer_card_id: string }
 * Sends a Google review request SMS after a reward is earned.
 * Only sent if:
 *   - business is on Pro or Business plan
 *   - business has google_place_id configured
 *   - customer has a phone number
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

  const { data } = await supabase
    .from("customer_cards")
    .select(`
      id,
      customers (first_name, phone),
      loyalty_cards (
        businesses (plan, business_name, google_place_id)
      )
    `)
    .eq("id", customer_card_id)
    .single();

  if (!data) return NextResponse.json({ sent: false, reason: "card not found" });

  const customer = data.customers as unknown as { first_name: string; phone: string | null } | null;
  const business = (data.loyalty_cards as unknown as {
    businesses: { plan: string | null; business_name: string; google_place_id: string | null } | null;
  } | null)?.businesses ?? null;

  const plan = business?.plan ?? null;
  const phone = customer?.phone ?? null;
  const placeId = business?.google_place_id ?? null;

  if (plan !== "pro" && plan !== "business") {
    return NextResponse.json({ sent: false, reason: "not pro/business plan" });
  }
  if (!placeId) return NextResponse.json({ sent: false, reason: "no google_place_id" });
  if (!phone)   return NextResponse.json({ sent: false, reason: "no phone" });

  const firstName = customer?.first_name ?? "Bonjour";
  const bizName   = business?.business_name ?? "notre commerce";
  const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
  const message   = `Félicitations ${firstName} ! Vous avez gagné votre récompense chez ${bizName}. Laissez-nous un avis : ${reviewUrl}`;

  try {
    await sendSms(normalizePhone(phone), message);
    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Brevo google-review SMS error:", err);
    return NextResponse.json({ sent: false, reason: "sms_error" }, { status: 500 });
  }
}
