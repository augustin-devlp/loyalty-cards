import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, getPlanKey, getPriceByLookupKey, PRICE_LOOKUP_KEYS } from "@/lib/stripe";

/**
 * POST /api/stripe/checkout
 * Body: { plan: "essential" | "pro" }
 * Returns: { url: string } — Stripe Checkout URL
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json() as { plan: "essential" | "pro"; country?: string };
  const { plan } = body;
  if (!plan || !["essential", "pro"].includes(plan)) {
    return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
  }

  // Fetch business info (country + existing customer ID)
  const { data: business } = await supabase
    .from("businesses")
    .select("email, business_name, country, stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!business) {
    return NextResponse.json({ error: "Commerce introuvable" }, { status: 404 });
  }

  const country = (
    (body.country === "CH" || body.country === "FR") ? body.country : (business.country ?? "FR")
  ) as "FR" | "CH";
  const planKey = getPlanKey(plan, country);
  const lookupKey = PRICE_LOOKUP_KEYS[planKey]; // "stampify_essential_fr" etc.

  // Get or create Stripe customer
  let customerId: string = business.stripe_customer_id ?? "";
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: business.email ?? user.email,
      name: business.business_name,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    // Persist the new customer ID immediately
    await supabase
      .from("businesses")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  // Resolve price ID via lookup key
  let priceId: string;
  try {
    priceId = await getPriceByLookupKey(lookupKey);
  } catch {
    return NextResponse.json(
      { error: "Les prix Stripe ne sont pas configurés. Appelez POST /api/stripe/setup d'abord." },
      { status: 503 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.stampify.ch";

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${baseUrl}/dashboard?checkout=success`,
    cancel_url:  `${baseUrl}/subscribe?canceled=1`,
    client_reference_id: user.id,
    metadata: {
      supabase_user_id: user.id,
      plan: planKey,
    },
    subscription_data: {
      metadata: {
        supabase_user_id: user.id,
        plan: planKey,
      },
    },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
