import { NextResponse } from "next/server";
import { getStripe, PRICE_LOOKUP_KEYS } from "@/lib/stripe";

/**
 * POST /api/stripe/setup
 * Creates the 6 Stampify products/prices in Stripe (idempotent via lookup_keys).
 * Call this once after deploying to production.
 */
export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY not set" }, { status: 500 });
  }

  const plans = [
    { key: PRICE_LOOKUP_KEYS.essential_fr, name: "Stampify Essentiel",  currency: "eur", amount: 1900 },
    { key: PRICE_LOOKUP_KEYS.essential_ch, name: "Stampify Essentiel",  currency: "chf", amount: 2900 },
    { key: PRICE_LOOKUP_KEYS.pro_fr,       name: "Stampify Pro",        currency: "eur", amount: 5900 },
    { key: PRICE_LOOKUP_KEYS.pro_ch,       name: "Stampify Pro",        currency: "chf", amount: 8900 },
    { key: PRICE_LOOKUP_KEYS.business_fr,  name: "Stampify Business",   currency: "eur", amount: 9900 },
    { key: PRICE_LOOKUP_KEYS.business_ch,  name: "Stampify Business",   currency: "chf", amount: 14900 },
  ];

  const results: Record<string, string> = {};

  for (const plan of plans) {
    const existing = await getStripe().prices.list({
      lookup_keys: [plan.key],
      active: true,
      limit: 1,
    });

    if (existing.data.length > 0) {
      results[plan.key] = existing.data[0].id;
      continue;
    }

    const price = await getStripe().prices.create({
      currency: plan.currency,
      unit_amount: plan.amount,
      recurring: { interval: "month" },
      lookup_key: plan.key,
      transfer_lookup_key: true,
      product_data: {
        name: plan.name,
        metadata: { stampify_plan: plan.key },
      },
    });

    results[plan.key] = price.id;
  }

  return NextResponse.json({
    message: "Stripe products and prices are ready.",
    prices: results,
  });
}
