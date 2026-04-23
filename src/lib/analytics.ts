/**
 * Analytics library — Phase 11 C2.
 *
 * Compute Recency/Frequency/Monetary + Age (RFM-A) segmentation
 * from orders + customers tables. Fully in-memory, no DB views.
 *
 * 11 segments basés sur matrice RFM standard :
 *   - champions       : R>=4, F>=4        → best customers
 *   - loyal           : R>=3, F>=3        → regulars
 *   - potential_loyal : R>=4, F=2         → promising recents
 *   - new             : R=5, F=1          → first-order recent
 *   - promising       : R=4, F=1
 *   - need_attention  : R=3, F=3          → neutral
 *   - about_to_sleep  : R=3, F=2          → slipping
 *   - at_risk         : R<=2, F>=3        → was loyal, now gone
 *   - cant_lose       : R<=2, F>=4, M>=4  → big spender lost
 *   - hibernating     : R<=2, F<=2        → dormant
 *   - lost            : R=1, F=1          → one-and-done
 */

export type RFMSegment =
  | "champions"
  | "loyal"
  | "potential_loyal"
  | "new"
  | "promising"
  | "need_attention"
  | "about_to_sleep"
  | "at_risk"
  | "cant_lose"
  | "hibernating"
  | "lost";

export const SEGMENT_META: Record<
  RFMSegment,
  { label: string; color: string; description: string }
> = {
  champions: {
    label: "Champions",
    color: "#C73E1D",
    description: "Clients récents, fréquents, dépensiers — tes meilleurs ambassadeurs.",
  },
  loyal: {
    label: "Fidèles",
    color: "#E6A12C",
    description: "Commandent régulièrement depuis un moment.",
  },
  potential_loyal: {
    label: "Fidèles potentiels",
    color: "#16A34A",
    description: "Récents avec 2-3 commandes, à chouchouter.",
  },
  new: {
    label: "Nouveaux",
    color: "#3B82F6",
    description: "1re commande ces 7 derniers jours. Fenêtre critique.",
  },
  promising: {
    label: "Prometteurs",
    color: "#8B5CF6",
    description: "1re commande récente, potentiel à confirmer.",
  },
  need_attention: {
    label: "Attention",
    color: "#F59E0B",
    description: "Clients moyens qui pourraient décrocher.",
  },
  about_to_sleep: {
    label: "En perte",
    color: "#F97316",
    description: "Pas revenus depuis 2-3 semaines. Relance SMS utile.",
  },
  at_risk: {
    label: "À risque",
    color: "#DC2626",
    description: "Anciennement fidèles, disparus depuis 1 mois.",
  },
  cant_lose: {
    label: "Ne pas perdre",
    color: "#7C2D12",
    description: "Gros dépensiers disparus — campagne win-back prioritaire.",
  },
  hibernating: {
    label: "Dormants",
    color: "#6B7280",
    description: "Inactifs depuis longtemps, peu engagés.",
  },
  lost: {
    label: "Perdus",
    color: "#374151",
    description: "1 seule commande, très ancienne.",
  },
};

/**
 * Retourne score R/F/M sur 1-5 avec quantiles simples.
 * - R (Recency) : jours depuis la dernière commande, 1=ancien 5=récent
 * - F (Frequency) : nombre total de commandes, 1=rare 5=fréquent
 * - M (Monetary) : montant total dépensé, 1=petit 5=gros
 */
export function computeRFM(
  lastOrderDays: number,
  orderCount: number,
  totalSpent: number,
): { r: number; f: number; m: number } {
  // Recency quintiles
  let r = 1;
  if (lastOrderDays <= 7) r = 5;
  else if (lastOrderDays <= 14) r = 4;
  else if (lastOrderDays <= 30) r = 3;
  else if (lastOrderDays <= 60) r = 2;

  // Frequency quintiles
  let f = 1;
  if (orderCount >= 10) f = 5;
  else if (orderCount >= 5) f = 4;
  else if (orderCount >= 3) f = 3;
  else if (orderCount >= 2) f = 2;

  // Monetary quintiles (CHF)
  let m = 1;
  if (totalSpent >= 500) m = 5;
  else if (totalSpent >= 200) m = 4;
  else if (totalSpent >= 100) m = 3;
  else if (totalSpent >= 50) m = 2;

  return { r, f, m };
}

export function assignSegment(r: number, f: number, m: number): RFMSegment {
  // Cant lose : gros M + anciens + frequency élevée
  if (r <= 2 && f >= 4 && m >= 4) return "cant_lose";
  // Champions
  if (r >= 4 && f >= 4) return "champions";
  // Loyal
  if (r >= 3 && f >= 3) return "loyal";
  // Potential loyal
  if (r >= 4 && f === 2) return "potential_loyal";
  // New vs promising (1 commande récente)
  if (r === 5 && f === 1) return "new";
  if (r === 4 && f === 1) return "promising";
  // Need attention
  if (r === 3 && f >= 2) return "need_attention";
  // About to sleep
  if (r === 3 && f <= 2) return "about_to_sleep";
  // At risk (anciens fidèles)
  if (r <= 2 && f >= 3) return "at_risk";
  // Lost (1 commande ancienne)
  if (r === 1 && f === 1) return "lost";
  // Default hibernating
  return "hibernating";
}

export type CustomerAnalyticsRow = {
  customer_id: string | null;
  phone: string;
  first_name: string;
  last_name: string;
  age_range: string | null;
  gender: string | null;
  date_of_birth: string | null;
  order_count: number;
  total_spent: number;
  last_order_at: string | null;
  last_order_days: number;
  r: number;
  f: number;
  m: number;
  segment: RFMSegment;
};

/**
 * Aggregate orders par customer_phone, joint avec customers, calcule RFM.
 * @param orders  tous les orders d'un restaurant (status != 'cancelled')
 * @param customers  tous les customers qui ont au moins une carte
 */
export function buildCustomerAnalytics(
  orders: Array<{
    customer_phone: string | null;
    customer_id: string | null;
    customer_name: string | null;
    total_amount: number | string;
    created_at: string;
    status: string;
  }>,
  customers: Array<{
    id: string;
    phone: string;
    first_name: string | null;
    last_name: string | null;
    age_range: string | null;
    gender: string | null;
    date_of_birth: string | null;
  }>,
): CustomerAnalyticsRow[] {
  const now = Date.now();
  const customerByPhone = new Map<string, (typeof customers)[number]>();
  for (const c of customers) {
    if (c.phone) customerByPhone.set(normalizePhone(c.phone), c);
  }

  // Group orders par téléphone
  type OrderRow = (typeof orders)[number];
  const byPhone = new Map<
    string,
    {
      phone: string;
      orders: OrderRow[];
    }
  >();

  for (const o of orders) {
    if (o.status === "cancelled" || o.status === "refunded") continue;
    const phone = normalizePhone(o.customer_phone ?? "");
    if (!phone) continue;
    if (!byPhone.has(phone)) {
      byPhone.set(phone, { phone, orders: [] });
    }
    byPhone.get(phone)!.orders.push(o);
  }

  const rows: CustomerAnalyticsRow[] = [];
  byPhone.forEach((group, phone) => {
    const orderCount = group.orders.length;
    const totalSpent = group.orders.reduce(
      (sum: number, o: OrderRow) => sum + Number(o.total_amount ?? 0),
      0,
    );
    const lastOrderAt = group.orders
      .map((o) => o.created_at)
      .sort()
      .at(-1)!;
    const lastOrderDays = Math.floor(
      (now - new Date(lastOrderAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    const { r, f, m } = computeRFM(lastOrderDays, orderCount, totalSpent);
    const segment = assignSegment(r, f, m);

    const c = customerByPhone.get(phone);
    const fallbackName = group.orders[0]?.customer_name ?? "";
    rows.push({
      customer_id: c?.id ?? null,
      phone,
      first_name:
        c?.first_name ??
        fallbackName.split(" ")[0] ??
        "",
      last_name: c?.last_name ?? fallbackName.split(" ").slice(1).join(" ") ?? "",
      age_range: c?.age_range ?? null,
      gender: c?.gender ?? null,
      date_of_birth: c?.date_of_birth ?? null,
      order_count: orderCount,
      total_spent: Number(totalSpent.toFixed(2)),
      last_order_at: lastOrderAt,
      last_order_days: lastOrderDays,
      r,
      f,
      m,
      segment,
    });
  });

  // Tri par total_spent desc pour défaut
  rows.sort((a, b) => b.total_spent - a.total_spent);
  return rows;
}

/** Normalise phone pour clé de matching (enlève espaces, unifie +41). */
export function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "").toLowerCase();
}

/**
 * Agrège les KPIs temporels depuis orders.
 */
export function computeTimeKpis(
  orders: Array<{ created_at: string; total_amount: number | string; status: string }>,
): {
  today: { revenue: number; count: number };
  week: { revenue: number; count: number };
  month: { revenue: number; count: number };
  year: { revenue: number; count: number };
  aov: number;
} {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekAgo = now.getTime() - 7 * 86400000;
  const monthAgo = now.getTime() - 30 * 86400000;
  const yearAgo = now.getTime() - 365 * 86400000;

  const live = orders.filter((o) => o.status !== "cancelled" && o.status !== "refunded");

  const sumFilter = (filter: (o: (typeof orders)[number]) => boolean) => {
    const slice = live.filter(filter);
    return {
      revenue: slice.reduce((s, o) => s + Number(o.total_amount ?? 0), 0),
      count: slice.length,
    };
  };

  const today = sumFilter((o) => new Date(o.created_at).getTime() >= startOfDay);
  const week = sumFilter((o) => new Date(o.created_at).getTime() >= weekAgo);
  const month = sumFilter((o) => new Date(o.created_at).getTime() >= monthAgo);
  const year = sumFilter((o) => new Date(o.created_at).getTime() >= yearAgo);

  const aov =
    month.count > 0 ? Number((month.revenue / month.count).toFixed(2)) : 0;

  return {
    today: { revenue: Number(today.revenue.toFixed(2)), count: today.count },
    week: { revenue: Number(week.revenue.toFixed(2)), count: week.count },
    month: { revenue: Number(month.revenue.toFixed(2)), count: month.count },
    year: { revenue: Number(year.revenue.toFixed(2)), count: year.count },
    aov,
  };
}

/**
 * Revenus par jour des 30 derniers jours (pour LineChart).
 */
export function computeDailyRevenue(
  orders: Array<{ created_at: string; total_amount: number | string; status: string }>,
  days: number = 30,
): Array<{ date: string; revenue: number; count: number }> {
  const result: Array<{ date: string; revenue: number; count: number }> = [];
  const now = new Date();
  const map = new Map<string, { revenue: number; count: number }>();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    map.set(key, { revenue: 0, count: 0 });
  }

  for (const o of orders) {
    if (o.status === "cancelled" || o.status === "refunded") continue;
    const key = new Date(o.created_at).toISOString().slice(0, 10);
    const bucket = map.get(key);
    if (bucket) {
      bucket.revenue += Number(o.total_amount ?? 0);
      bucket.count += 1;
    }
  }

  map.forEach((val, date) => {
    result.push({ date, revenue: Number(val.revenue.toFixed(2)), count: val.count });
  });
  return result;
}

/** Répartition par heure (0-23). */
export function computeHourlyDistribution(
  orders: Array<{ created_at: string; status: string }>,
): Array<{ hour: number; count: number }> {
  const arr: Array<{ hour: number; count: number }> = [];
  for (let h = 0; h < 24; h++) arr.push({ hour: h, count: 0 });
  for (const o of orders) {
    if (o.status === "cancelled") continue;
    const h = new Date(o.created_at).getHours();
    arr[h].count += 1;
  }
  return arr;
}

/** Répartition par jour de la semaine (0=dimanche, 1=lundi…). */
export function computeWeekdayDistribution(
  orders: Array<{ created_at: string; status: string }>,
): Array<{ day: string; count: number }> {
  const labels = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const arr = labels.map((day) => ({ day, count: 0 }));
  for (const o of orders) {
    if (o.status === "cancelled") continue;
    const d = new Date(o.created_at).getDay();
    arr[d].count += 1;
  }
  return arr;
}

/**
 * Demographics breakdown — age_range + gender counts.
 */
export function computeDemographics(rows: CustomerAnalyticsRow[]): {
  ageRanges: Array<{ range: string; count: number; revenue: number }>;
  genders: Array<{ gender: string; count: number; revenue: number }>;
} {
  const ageMap = new Map<string, { count: number; revenue: number }>();
  const genderMap = new Map<string, { count: number; revenue: number }>();

  for (const r of rows) {
    const age = r.age_range ?? "Inconnu";
    const g = r.gender ?? "Non precise";
    const aBucket = ageMap.get(age) ?? { count: 0, revenue: 0 };
    aBucket.count += 1;
    aBucket.revenue += r.total_spent;
    ageMap.set(age, aBucket);

    const gBucket = genderMap.get(g) ?? { count: 0, revenue: 0 };
    gBucket.count += 1;
    gBucket.revenue += r.total_spent;
    genderMap.set(g, gBucket);
  }

  const ageRanges: Array<{ range: string; count: number; revenue: number }> = [];
  ageMap.forEach((v, range) => {
    ageRanges.push({ range, count: v.count, revenue: Number(v.revenue.toFixed(2)) });
  });
  ageRanges.sort((a, b) => a.range.localeCompare(b.range));

  const genders: Array<{ gender: string; count: number; revenue: number }> = [];
  genderMap.forEach((v, gender) => {
    genders.push({ gender, count: v.count, revenue: Number(v.revenue.toFixed(2)) });
  });
  genders.sort((a, b) => b.count - a.count);

  return { ageRanges, genders };
}

/**
 * Segments breakdown avec compteur + CA total par segment.
 */
export function computeSegmentBreakdown(
  rows: CustomerAnalyticsRow[],
): Array<{
  segment: RFMSegment;
  label: string;
  color: string;
  count: number;
  revenue: number;
  pct: number;
}> {
  const map = new Map<RFMSegment, { count: number; revenue: number }>();
  for (const r of rows) {
    const b = map.get(r.segment) ?? { count: 0, revenue: 0 };
    b.count += 1;
    b.revenue += r.total_spent;
    map.set(r.segment, b);
  }
  const total = rows.length || 1;
  const segments = (Object.keys(SEGMENT_META) as RFMSegment[]).map((s) => {
    const b = map.get(s) ?? { count: 0, revenue: 0 };
    return {
      segment: s,
      label: SEGMENT_META[s].label,
      color: SEGMENT_META[s].color,
      count: b.count,
      revenue: Number(b.revenue.toFixed(2)),
      pct: Number(((b.count / total) * 100).toFixed(1)),
    };
  });
  return segments.sort((a, b) => b.count - a.count);
}
