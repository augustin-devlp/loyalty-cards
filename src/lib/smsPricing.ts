/**
 * Barème SMS dégressif Stampify — version offre Mehmet finale (Avril 2026).
 *
 * IMPORTANT : tarification PROGRESSIVE par tranches mensuelles, PAS de tier
 * unique pour tout le volume. Les premiers 1500 SMS sont à 0.19, les
 * suivants à 0.15, etc.
 *
 * Aucun abonnement mensuel SMS. Le client paie uniquement les SMS envoyés.
 * Les campagnes marketing sont à la carte (59 CHF / 39 CHF dès la 3e du mois).
 *
 * Source : Offre_Finale_V2_Rialto_Mehmet (5).pdf — section 2 Tarifs SMS dégressifs.
 */

export type SmsPricingTier = {
  name: string;
  /** SMS de la 1re unité incluse à la dernière (incluse). */
  fromVolume: number;
  toVolume: number | null;
  pricePerSms: number;
  /** Économie par rapport à la tranche 1 (0.19), en pourcentage. */
  savingsVsT1Pct: number | null;
};

/** Les 5 tranches SMS officielles (tarification progressive). */
export const SMS_PRICING_TIERS: SmsPricingTier[] = [
  { name: "Tranche 1", fromVolume: 1, toVolume: 1500, pricePerSms: 0.19, savingsVsT1Pct: null },
  { name: "Tranche 2", fromVolume: 1501, toVolume: 3000, pricePerSms: 0.15, savingsVsT1Pct: 21 },
  { name: "Tranche 3", fromVolume: 3001, toVolume: 4500, pricePerSms: 0.13, savingsVsT1Pct: 32 },
  { name: "Tranche 4", fromVolume: 4501, toVolume: 6000, pricePerSms: 0.11, savingsVsT1Pct: 42 },
  { name: "Tranche 5", fromVolume: 6001, toVolume: null, pricePerSms: 0.09, savingsVsT1Pct: 53 },
];

/** Tarif d'une campagne marketing à la carte. */
export const CAMPAIGN_PRICING = {
  /** Campagne standard (1re et 2e du mois). */
  standardChf: 59,
  /** Tarif réduit dès la 3e campagne du même mois (-34%). */
  loyaltyDiscountChf: 39,
  loyaltyTriggerCount: 3,
};

/**
 * Calcul progressif du coût SMS pour un volume mensuel donné.
 * Renvoie le détail tranche par tranche + le sous-total.
 */
export function computeProgressiveSmsCost(volume: number): {
  breakdown: Array<{ tier: SmsPricingTier; smsInTier: number; subTotal: number }>;
  totalSmsCost: number;
} {
  const breakdown: Array<{ tier: SmsPricingTier; smsInTier: number; subTotal: number }> = [];
  let totalSmsCost = 0;

  if (volume <= 0) return { breakdown, totalSmsCost };

  for (const tier of SMS_PRICING_TIERS) {
    if (volume < tier.fromVolume) break;
    const upperBound = tier.toVolume ?? Number.POSITIVE_INFINITY;
    const smsInTier = Math.max(0, Math.min(volume, upperBound) - tier.fromVolume + 1);
    if (smsInTier <= 0) continue;
    const subTotal = Number((smsInTier * tier.pricePerSms).toFixed(2));
    breakdown.push({ tier, smsInTier, subTotal });
    totalSmsCost = Number((totalSmsCost + subTotal).toFixed(2));
  }

  return { breakdown, totalSmsCost };
}

/** Tier dans lequel se trouve actuellement ce volume (le dernier tier touché). */
export function resolveCurrentTier(volume: number): SmsPricingTier {
  if (volume <= 0) return SMS_PRICING_TIERS[0];
  let current = SMS_PRICING_TIERS[0];
  for (const t of SMS_PRICING_TIERS) {
    if (volume >= t.fromVolume) current = t;
  }
  return current;
}

/**
 * Calcul du coût total mensuel : SMS progressifs + campagnes marketing.
 * @param volume       SMS envoyés ce mois (transactionnels + événementiels + campagnes).
 * @param campaignCount Nombre de campagnes marketing lancées ce mois.
 */
export function estimateMonthlyCost(
  volume: number,
  campaignCount: number = 0,
): {
  current_tier: SmsPricingTier;
  sms_breakdown: ReturnType<typeof computeProgressiveSmsCost>["breakdown"];
  sms_cost: number;
  campaign_count: number;
  campaign_cost: number;
  campaign_breakdown: { standard: number; loyalty: number };
  total: number;
} {
  const { breakdown, totalSmsCost } = computeProgressiveSmsCost(volume);
  const standard = Math.min(campaignCount, CAMPAIGN_PRICING.loyaltyTriggerCount - 1);
  const loyalty = Math.max(0, campaignCount - (CAMPAIGN_PRICING.loyaltyTriggerCount - 1));
  const campaignCost = Number(
    (standard * CAMPAIGN_PRICING.standardChf + loyalty * CAMPAIGN_PRICING.loyaltyDiscountChf).toFixed(2),
  );

  return {
    current_tier: resolveCurrentTier(volume),
    sms_breakdown: breakdown,
    sms_cost: totalSmsCost,
    campaign_count: campaignCount,
    campaign_cost: campaignCost,
    campaign_breakdown: { standard, loyalty },
    total: Number((totalSmsCost + campaignCost).toFixed(2)),
  };
}
