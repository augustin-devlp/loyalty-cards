"use client";

import { useEffect, useState } from "react";

type Tier = {
  name: string;
  minVolume: number;
  maxVolume: number | null;
  pricePerSms: number;
  monthlyFeeSuggested: number | null;
};

type BillingData = {
  ok: boolean;
  generated_at: string;
  restaurant: string;
  totals: {
    sms_sent_this_month: number;
    sms_failed_this_month: number;
    credits_this_month: number;
    credits_last_30d: number;
    credits_12_months: number;
    sms_sent_12_months: number;
    projected_credits_end_of_month: number;
  };
  current_tier: {
    tier: Tier;
    variable_cost: number;
    monthly_fee: number;
    total: number;
  };
  projected_tier: BillingData["current_tier"];
  tiers: Tier[];
  channels: { sms_rialto: number; sms_stampify: number; webpush: number };
  top_templates: Array<{ template: string; count: number }>;
};

export default function SmsBillingClient() {
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulateVolume, setSimulateVolume] = useState(500);

  useEffect(() => {
    fetch("/api/dashboard/billing/sms-usage")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center text-gray-400">Chargement…</div>;
  }
  if (!data || !data.ok) {
    return <div className="text-red-600">Erreur de chargement.</div>;
  }

  const simulatedTier =
    data.tiers.find(
      (t) =>
        simulateVolume >= t.minVolume &&
        (t.maxVolume === null || simulateVolume <= t.maxVolume),
    ) ?? data.tiers[0];
  const simulatedVariable = Number(
    (simulateVolume * simulatedTier.pricePerSms).toFixed(2),
  );
  const simulatedMonthlyFee = simulatedTier.monthlyFeeSuggested ?? 0;

  return (
    <div className="space-y-6">
      {/* Usage actuel */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          label="SMS ce mois"
          value={data.totals.sms_sent_this_month.toString()}
          sub={`${data.totals.credits_this_month} crédits`}
          color="#C73E1D"
        />
        <Stat
          label="Crédits 30j"
          value={data.totals.credits_last_30d.toString()}
          sub="glissant"
          color="#E6A12C"
        />
        <Stat
          label="Projection fin mois"
          value={data.totals.projected_credits_end_of_month.toString()}
          sub={`tier ${data.projected_tier.tier.name}`}
          color="#16A34A"
        />
        <Stat
          label="Total 12 mois"
          value={data.totals.sms_sent_12_months.toString()}
          sub={`${data.totals.credits_12_months} crédits`}
          color="#3B82F6"
        />
      </section>

      {/* Coût estimé */}
      <section className="rounded-2xl border-2 border-[#C73E1D] bg-gradient-to-br from-[#FFF2D1] to-[#FFE9B8] p-5 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#C73E1D]">
              Tier actuel
            </div>
            <div className="mt-1 text-2xl font-black">
              {data.current_tier.tier.name} · {data.current_tier.tier.pricePerSms.toFixed(2)} CHF/SMS
            </div>
            <div className="text-xs text-gray-600">
              Volume ce mois : {data.totals.credits_this_month} crédits
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600">Coût estimé ce mois</div>
            <div className="text-3xl font-black text-[#C73E1D]">
              {data.current_tier.total.toFixed(2)} CHF
            </div>
            <div className="text-xs text-gray-500">
              {data.current_tier.variable_cost.toFixed(2)} variable +{" "}
              {data.current_tier.monthly_fee.toFixed(0)} abo
            </div>
          </div>
        </div>
      </section>

      {/* Barème */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-3">
          <h2 className="font-bold text-gray-800">Barème dégressif SMS</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-5 py-2">Tier</th>
              <th className="px-5 py-2 text-right">Volume / mois</th>
              <th className="px-5 py-2 text-right">Prix / SMS</th>
              <th className="px-5 py-2 text-right">Abo suggéré</th>
            </tr>
          </thead>
          <tbody>
            {data.tiers.map((t) => {
              const isCurrent = t.name === data.current_tier.tier.name;
              return (
                <tr
                  key={t.name}
                  className={`border-t border-gray-100 ${
                    isCurrent ? "bg-[#FFF7E4]" : ""
                  }`}
                >
                  <td className="px-5 py-2.5 font-semibold">
                    {isCurrent && <span className="mr-2">✓</span>}
                    {t.name}
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    {t.minVolume}–{t.maxVolume ?? "∞"}
                  </td>
                  <td className="px-5 py-2.5 text-right font-bold">
                    {t.pricePerSms.toFixed(2)} CHF
                  </td>
                  <td className="px-5 py-2.5 text-right text-gray-500">
                    {t.monthlyFeeSuggested
                      ? `${t.monthlyFeeSuggested} CHF`
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Simulateur */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 font-bold text-gray-800">Simulateur</h2>
        <p className="text-xs text-gray-500">
          Combien ça coûte à différents volumes ?
        </p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="range"
            min={0}
            max={3000}
            step={50}
            value={simulateVolume}
            onChange={(e) => setSimulateVolume(Number(e.target.value))}
            className="flex-1"
          />
          <div className="font-mono text-lg font-bold">{simulateVolume} SMS</div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-gray-50 p-3 text-center">
            <div className="text-[10px] font-semibold uppercase text-gray-500">
              Tier
            </div>
            <div className="mt-1 text-base font-bold">{simulatedTier.name}</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-3 text-center">
            <div className="text-[10px] font-semibold uppercase text-gray-500">
              Variable
            </div>
            <div className="mt-1 text-base font-bold text-[#C73E1D]">
              {simulatedVariable.toFixed(2)} CHF
            </div>
          </div>
          <div className="rounded-xl bg-gray-50 p-3 text-center">
            <div className="text-[10px] font-semibold uppercase text-gray-500">
              Total
            </div>
            <div className="mt-1 text-base font-black text-[#C73E1D]">
              {(simulatedVariable + simulatedMonthlyFee).toFixed(2)} CHF
            </div>
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
            Par canal (12 mois)
          </h2>
          <dl className="space-y-2">
            <Row label="SMS Rialto (sender Rialto)" value={data.channels.sms_rialto} />
            <Row label="SMS Stampify (fallback sender)" value={data.channels.sms_stampify} />
            <Row
              label="Web Push (gratuit ✨)"
              value={data.channels.webpush}
              highlight
            />
          </dl>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
            Top templates
          </h2>
          <ul className="space-y-1.5 text-sm">
            {data.top_templates.length === 0 && (
              <li className="text-xs text-gray-400">Aucun SMS loggé.</li>
            )}
            {data.top_templates.map((t) => (
              <li
                key={t.template}
                className="flex items-center justify-between border-b border-gray-50 pb-1.5"
              >
                <span className="text-gray-700">{t.template}</span>
                <span className="font-bold tabular-nums">{t.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="mt-6 text-center text-[10px] text-gray-400">
        Tarifs indicatifs · Phase 11 C17 · Barème dégressif Stampify ·{" "}
        {new Date(data.generated_at).toLocaleString("fr-CH")}
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-black" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-gray-500">{sub}</div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl px-2 py-1.5 ${
        highlight ? "bg-emerald-50" : ""
      }`}
    >
      <dt className="text-sm text-gray-700">{label}</dt>
      <dd className="font-bold tabular-nums">{value}</dd>
    </div>
  );
}
