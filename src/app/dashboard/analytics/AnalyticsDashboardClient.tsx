"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Kpis = {
  today: { revenue: number; count: number };
  week: { revenue: number; count: number };
  month: { revenue: number; count: number };
  year: { revenue: number; count: number };
  aov: number;
};

type SegmentRow = {
  segment: string;
  label: string;
  color: string;
  count: number;
  revenue: number;
  pct: number;
};

type AnalyticsData = {
  ok: boolean;
  generated_at: string;
  totals: {
    total_orders: number;
    total_orders_raw: number;
    total_customers: number;
    total_registered: number;
  };
  kpis: Kpis;
  daily_revenue: Array<{ date: string; revenue: number; count: number }>;
  hourly_distribution: Array<{ hour: number; count: number }>;
  weekday_distribution: Array<{ day: string; count: number }>;
  segments: SegmentRow[];
  demographics: {
    ageRanges: Array<{ range: string; count: number; revenue: number }>;
    genders: Array<{ gender: string; count: number; revenue: number }>;
  };
  top_products: Array<{ name: string; count: number; revenue: number }>;
  top_customers: Array<{
    customer_id: string | null;
    phone: string;
    name: string;
    order_count: number;
    total_spent: number;
    last_order_days: number;
    segment: string;
  }>;
};

const RIALTO_PALETTE = ["#C73E1D", "#E6A12C", "#16A34A", "#3B82F6", "#8B5CF6", "#F59E0B", "#F97316", "#DC2626", "#7C2D12", "#6B7280", "#374151"];

export default function AnalyticsDashboardClient() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [segmentList, setSegmentList] = useState<{
    count: number;
    customers: Array<{ phone: string; first_name: string; last_name: string; total_spent: number; order_count: number; last_order_days: number }>;
  } | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/analytics")
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok) throw new Error(d.error ?? "load failed");
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const loadSegment = async (segment: string) => {
    setActiveSegment(segment);
    setSegmentList(null);
    try {
      const res = await fetch(`/api/dashboard/analytics/segment?segment=${segment}`);
      const body = await res.json();
      setSegmentList({ count: body.count, customers: body.customers });
    } catch (e) {
      console.error("[analytics] load segment failed", e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-400">
        Chargement des analytics…
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 text-red-700">
        Erreur : {error ?? "pas de données"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── SECTION 1 : KPIs globaux ─────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          1. KPIs globaux
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KpiCard label="CA aujourd'hui" value={`${data.kpis.today.revenue.toFixed(0)} CHF`} sub={`${data.kpis.today.count} commandes`} color="#C73E1D" />
          <KpiCard label="CA 7 jours" value={`${data.kpis.week.revenue.toFixed(0)} CHF`} sub={`${data.kpis.week.count} commandes`} color="#E6A12C" />
          <KpiCard label="CA 30 jours" value={`${data.kpis.month.revenue.toFixed(0)} CHF`} sub={`${data.kpis.month.count} commandes`} color="#16A34A" />
          <KpiCard label="Panier moyen (30j)" value={`${data.kpis.aov.toFixed(2)} CHF`} sub={`${data.totals.total_customers} clients`} color="#3B82F6" />
        </div>
      </section>

      {/* ─── SECTION 2 : Revenus 30 jours ──────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
          2. Revenus 30 derniers jours
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.daily_revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#C73E1D" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ─── SECTION 3 : Heures de rush ────────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
          3. Répartition par heure (heures de rush)
        </h2>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.hourly_distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}h`} fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="#E6A12C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ─── SECTION 4 : Jours de la semaine ───────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
          4. Commandes par jour de la semaine
        </h2>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.weekday_distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="#C73E1D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ─── SECTION 5 : Segments RFM-A ────────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">
          5. Segments RFM-A (11 segments)
        </h2>
        <p className="mb-4 text-xs text-gray-500">
          Click sur un segment pour voir les clients et lancer une campagne
          SMS ciblée.
        </p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {data.segments.map((s) => (
            <button
              key={s.segment}
              type="button"
              onClick={() => loadSegment(s.segment)}
              className={`rounded-xl border-2 p-3 text-left transition ${
                activeSegment === s.segment
                  ? "border-[#C73E1D] shadow-md"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: s.color }} />
                <span className="truncate text-xs font-bold text-gray-800">{s.label}</span>
              </div>
              <div className="mt-2 text-xl font-black" style={{ color: s.color }}>
                {s.count}
              </div>
              <div className="text-[10px] text-gray-500">
                {s.pct}% · {s.revenue.toFixed(0)} CHF
              </div>
            </button>
          ))}
        </div>

        {activeSegment && segmentList && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-bold text-gray-800">
                {segmentList.count} clients dans ce segment
              </div>
              <button
                type="button"
                onClick={() => setActiveSegment(null)}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                Fermer ✕
              </button>
            </div>
            {segmentList.customers.length === 0 ? (
              <p className="text-xs text-gray-500">Aucun client.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr className="text-left text-gray-500">
                      <th className="py-2">Nom</th>
                      <th className="py-2">Téléphone</th>
                      <th className="py-2 text-right">Commandes</th>
                      <th className="py-2 text-right">Total</th>
                      <th className="py-2 text-right">Derniere</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segmentList.customers.slice(0, 50).map((c) => (
                      <tr key={c.phone} className="border-t border-gray-200">
                        <td className="py-1.5 font-medium">{c.first_name} {c.last_name}</td>
                        <td className="py-1.5 font-mono text-[10px]">{c.phone}</td>
                        <td className="py-1.5 text-right">{c.order_count}</td>
                        <td className="py-1.5 text-right font-semibold">{c.total_spent.toFixed(0)} CHF</td>
                        <td className="py-1.5 text-right">{c.last_order_days}j</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ─── SECTION 6 : Demographic age ───────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
          6. Démographie — tranches d&apos;âge
        </h2>
        {data.demographics.ageRanges.length === 0 ? (
          <p className="text-xs text-gray-500">Pas assez de données (clients n&apos;ont pas encore activé leur carte étape 2).</p>
        ) : (
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.demographics.ageRanges}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="range" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* ─── SECTION 7 : Demographic gender ────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
          7. Démographie — genre
        </h2>
        {data.demographics.genders.length === 0 ? (
          <p className="text-xs text-gray-500">Pas assez de données.</p>
        ) : (
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="count"
                  data={data.demographics.genders}
                  nameKey="gender"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry: { gender?: string; count?: number; name?: string; value?: number }) =>
                    `${entry.gender ?? entry.name ?? ""}: ${entry.count ?? entry.value ?? 0}`
                  }
                >
                  {data.demographics.genders.map((_, i) => (
                    <Cell key={i} fill={RIALTO_PALETTE[i % RIALTO_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* ─── SECTION 8 : Top produits ──────────────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
          8. Top 10 produits (30 derniers jours)
        </h2>
        {data.top_products.length === 0 ? (
          <p className="text-xs text-gray-500">Aucune commande sur 30 jours.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="pb-2">#</th>
                <th className="pb-2">Produit</th>
                <th className="pb-2 text-right">Ventes</th>
                <th className="pb-2 text-right">CA</th>
              </tr>
            </thead>
            <tbody>
              {data.top_products.map((p, i) => (
                <tr key={p.name} className="border-t border-gray-100">
                  <td className="py-2 text-gray-400">{i + 1}</td>
                  <td className="py-2 font-medium">{p.name}</td>
                  <td className="py-2 text-right">{p.count}</td>
                  <td className="py-2 text-right font-semibold">{p.revenue.toFixed(0)} CHF</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ─── SECTION 9 : Top clients dépensiers ────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
          9. Top 10 clients dépensiers (12 mois)
        </h2>
        {data.top_customers.length === 0 ? (
          <p className="text-xs text-gray-500">Aucun client acheteur.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="pb-2">#</th>
                <th className="pb-2">Client</th>
                <th className="pb-2">Segment</th>
                <th className="pb-2 text-right">Commandes</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.top_customers.map((c, i) => (
                <tr key={c.phone} className="border-t border-gray-100">
                  <td className="py-2 text-gray-400">{i + 1}</td>
                  <td className="py-2">
                    <div className="font-medium">{c.name}</div>
                    <div className="font-mono text-[10px] text-gray-500">{c.phone}</div>
                  </td>
                  <td className="py-2">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold">{c.segment}</span>
                  </td>
                  <td className="py-2 text-right">{c.order_count}</td>
                  <td className="py-2 text-right font-bold">{c.total_spent.toFixed(0)} CHF</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ─── SECTION 10 : Totaux base clients ──────────────────────────── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
          10. Totaux base clients
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <div className="text-xs text-gray-500">Clients acheteurs</div>
            <div className="text-3xl font-black text-[#C73E1D]">{data.totals.total_customers}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Inscrits carte fidélité</div>
            <div className="text-3xl font-black text-[#E6A12C]">{data.totals.total_registered}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Commandes 12 mois</div>
            <div className="text-3xl font-black text-[#16A34A]">{data.totals.total_orders}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Conversion inscrits → acheteurs</div>
            <div className="text-3xl font-black text-[#3B82F6]">
              {data.totals.total_registered > 0
                ? Math.round((data.totals.total_customers / data.totals.total_registered) * 100)
                : 0}
              %
            </div>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-gray-400">
          Généré à {new Date(data.generated_at).toLocaleTimeString("fr-CH")} · RFM-A basé sur les commandes des 12 derniers mois
        </p>
      </section>
    </div>
  );
}

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{label}</div>
      <div className="mt-1.5 text-2xl font-black" style={{ color }}>{value}</div>
      <div className="text-xs text-gray-500">{sub}</div>
    </div>
  );
}
