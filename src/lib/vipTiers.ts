/**
 * VIP Tiers — Phase 11 C11.
 *
 * Seuils :
 *   - bronze : 10+ commandes OU 500+ CHF lifetime
 *   - silver : 25+ commandes OU 1500+ CHF lifetime
 *   - gold   : 50+ commandes OU 3000+ CHF lifetime
 *
 * Avantages :
 *   - bronze : -5% permanent, code BRONZE-{id}
 *   - silver : -10% permanent, code SILVER-{id}, dessert offert à l'anniversaire
 *   - gold   : -15% permanent, code GOLD-{id}, dessert offert + 1 pizza offerte
 *     tous les 5 commandes (automatique, pas besoin de carte fidélité
 *     classique), passage en début de liste commande dashboard (priorité)
 */

export type VipTier = "bronze" | "silver" | "gold" | null;

export const VIP_THRESHOLDS = {
  bronze: { minOrders: 10, minSpend: 500 },
  silver: { minOrders: 25, minSpend: 1500 },
  gold: { minOrders: 50, minSpend: 3000 },
};

export const VIP_META: Record<
  Exclude<VipTier, null>,
  {
    label: string;
    color: string;
    discount_percent: number;
    dessert_on_birthday: boolean;
    free_pizza_every_n_orders: number | null;
    priority_dashboard: boolean;
    description: string;
  }
> = {
  bronze: {
    label: "Bronze",
    color: "#B08D57",
    discount_percent: 5,
    dessert_on_birthday: false,
    free_pizza_every_n_orders: null,
    priority_dashboard: false,
    description: "10+ commandes ou 500+ CHF dépensés",
  },
  silver: {
    label: "Silver",
    color: "#A8A9AD",
    discount_percent: 10,
    dessert_on_birthday: true,
    free_pizza_every_n_orders: null,
    priority_dashboard: false,
    description:
      "25+ commandes ou 1500+ CHF · -10% permanent + dessert anniversaire",
  },
  gold: {
    label: "Gold",
    color: "#E6A12C",
    discount_percent: 15,
    dessert_on_birthday: true,
    free_pizza_every_n_orders: 5,
    priority_dashboard: true,
    description:
      "50+ commandes ou 3000+ CHF · -15% + dessert + pizza offerte tous les 5 commandes",
  },
};

/**
 * Calcule le tier VIP basé sur ordre count et lifetime spend.
 * Retourne le tier le plus haut atteignable.
 */
export function computeVipTier(
  orderCount: number,
  lifetimeSpend: number,
): VipTier {
  if (
    orderCount >= VIP_THRESHOLDS.gold.minOrders ||
    lifetimeSpend >= VIP_THRESHOLDS.gold.minSpend
  )
    return "gold";
  if (
    orderCount >= VIP_THRESHOLDS.silver.minOrders ||
    lifetimeSpend >= VIP_THRESHOLDS.silver.minSpend
  )
    return "silver";
  if (
    orderCount >= VIP_THRESHOLDS.bronze.minOrders ||
    lifetimeSpend >= VIP_THRESHOLDS.bronze.minSpend
  )
    return "bronze";
  return null;
}

export function nextTierProgress(
  orderCount: number,
  lifetimeSpend: number,
): {
  next: VipTier;
  orders_to_go: number;
  spend_to_go: number;
} {
  const current = computeVipTier(orderCount, lifetimeSpend);
  if (current === "gold") {
    return { next: null, orders_to_go: 0, spend_to_go: 0 };
  }
  const target: Exclude<VipTier, null> =
    current === "silver" ? "gold" : current === "bronze" ? "silver" : "bronze";
  const threshold = VIP_THRESHOLDS[target];
  return {
    next: target,
    orders_to_go: Math.max(0, threshold.minOrders - orderCount),
    spend_to_go: Math.max(0, threshold.minSpend - lifetimeSpend),
  };
}
