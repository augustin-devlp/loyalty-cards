import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return _stripe;
}

// Lookup keys for Stripe prices — created once by /api/stripe/setup
export const PRICE_LOOKUP_KEYS = {
  essential_fr: "stampify_essential_fr",
  essential_ch: "stampify_essential_ch",
  pro_fr:       "stampify_pro_fr",
  pro_ch:       "stampify_pro_ch",
} as const;

export type PlanKey = keyof typeof PRICE_LOOKUP_KEYS;

export function getPlanKey(
  plan: "essential" | "pro",
  country: "FR" | "CH"
): PlanKey {
  return `${plan}_${country.toLowerCase()}` as PlanKey;
}

/** Resolve a Stripe Price ID from its lookup key (throws if not found) */
export async function getPriceByLookupKey(lookupKey: string): Promise<string> {
  const prices = await getStripe().prices.list({
    lookup_keys: [lookupKey],
    active: true,
    limit: 1,
  });
  if (!prices.data.length) {
    throw new Error(
      `Stripe price not found for lookup key "${lookupKey}". ` +
        "Run POST /api/stripe/setup to create products and prices."
    );
  }
  return prices.data[0].id;
}
