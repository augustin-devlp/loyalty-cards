/**
 * Barème SMS dégressif — Phase 11 C17.
 *
 * Volumes en nombre de SMS facturés / mois.
 * Prix par SMS CHF (arrondi centime).
 */

export type SmsPricingTier = {
  name: string;
  minVolume: number;
  maxVolume: number | null;
  pricePerSms: number;
  monthlyFeeSuggested: number | null;
};

export const SMS_PRICING_TIERS: SmsPricingTier[] = [
  {
    name: "Starter",
    minVolume: 0,
    maxVolume: 199,
    pricePerSms: 0.2,
    monthlyFeeSuggested: null,
  },
  {
    name: "Growth",
    minVolume: 200,
    maxVolume: 499,
    pricePerSms: 0.17,
    monthlyFeeSuggested: 49,
  },
  {
    name: "Scale",
    minVolume: 500,
    maxVolume: 999,
    pricePerSms: 0.14,
    monthlyFeeSuggested: 79,
  },
  {
    name: "Pro",
    minVolume: 1000,
    maxVolume: 1999,
    pricePerSms: 0.12,
    monthlyFeeSuggested: 99,
  },
  {
    name: "Enterprise",
    minVolume: 2000,
    maxVolume: null,
    pricePerSms: 0.1,
    monthlyFeeSuggested: 99,
  },
];

export function resolveTier(volume: number): SmsPricingTier {
  for (const tier of SMS_PRICING_TIERS) {
    if (volume >= tier.minVolume && (tier.maxVolume === null || volume <= tier.maxVolume)) {
      return tier;
    }
  }
  return SMS_PRICING_TIERS[0];
}

export function estimateMonthlyCost(volume: number): {
  tier: SmsPricingTier;
  variable_cost: number;
  monthly_fee: number;
  total: number;
} {
  const tier = resolveTier(volume);
  const variable = Number((volume * tier.pricePerSms).toFixed(2));
  const fee = tier.monthlyFeeSuggested ?? 0;
  return {
    tier,
    variable_cost: variable,
    monthly_fee: fee,
    total: Number((variable + fee).toFixed(2)),
  };
}
