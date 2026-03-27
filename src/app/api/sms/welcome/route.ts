import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSms, normalizePhone } from "@/lib/brevo";

/**
 * POST /api/sms/welcome
 * Body: { customer_card_id: string }
 * Envoie un SMS de bienvenue au client avec le lien vers sa carte.
 * Uniquement si le commerçant est en plan Pro ou Business et si le client a un téléphone.
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
      customers ( first_name, phone ),
      loyalty_cards (
        businesses ( plan, business_name )
      )
    `)
    .eq("id", customer_card_id)
    .single();

  if (!data) {
    return NextResponse.json({ sent: false, reason: "card not found" });
  }

  const customer = data.customers as unknown as { first_name: string; phone: string | null } | null;
  const loyaltyCard = data.loyalty_cards as unknown as {
    businesses: { plan: string | null; business_name: string | null } | null;
  } | null;

  const plan = loyaltyCard?.businesses?.plan ?? null;
  const businessName = loyaltyCard?.businesses?.business_name ?? "votre commerce";
  const firstName = customer?.first_name ?? "vous";
  const phone = customer?.phone ?? null;

  if (plan !== "pro" && plan !== "business") {
    return NextResponse.json({ sent: false, reason: "plan not eligible" });
  }
  if (!phone) {
    return NextResponse.json({ sent: false, reason: "no phone" });
  }

  const cardUrl = `https://stampify.ch/card/${customer_card_id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(cardUrl)}`;
  const message = `Bonjour ${firstName} ! 🎁 Carte fidélité ${businessName} : ${cardUrl}\nVotre QR code (à screenshotter) : ${qrUrl}`;

  try {
    await sendSms(normalizePhone(phone), message);
    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Brevo welcome SMS error:", err);
    return NextResponse.json({ sent: false, reason: "sms_error" }, { status: 500 });
  }
}
