"use client";

import { useEffect, useMemo, useState } from "react";

type Tier = {
  name: string;
  fromVolume: number;
  toVolume: number | null;
  pricePerSms: number;
  savingsVsT1Pct: number | null;
};

type CostBreakdown = {
  current_tier: Tier;
  sms_breakdown: Array<{ tier: Tier; smsInTier: number; subTotal: number }>;
  sms_cost: number;
  campaign_count: number;
  campaign_cost: number;
  campaign_breakdown: { standard: number; loyalty: number };
  total: number;
};

type Scenario = CostBreakdown & {
  label: string;
  sms_volume: number;
  campaigns: number;
};

type BillingData = {
  ok: boolean;
  generated_at: string;
  restaurant: string;
  pricing: {
    tiers: Tier[];
    campaign_standard_chf: number;
    campaign_loyalty_chf: number;
    campaign_loyalty_trigger: number;
    monthly_subscription_chf: number;
  };
  totals: {
    sms_sent_this_month: number;
    sms_failed_this_month: number;
    credits_this_month: number;
    credits_last_30d: number;
    credits_12_months: number;
    sms_sent_12_months: number;
    projected_credits_end_of_month: number;
    campaigns_this_month: number;
  };
  current_cost: CostBreakdown;
  projected_cost: CostBreakdown;
  scenarios: { a: Scenario; b: Scenario; c: Scenario };
  channels: { sms_rialto: number; sms_stampify: number; webpush: number };
  top_templates: Array<{ template: string; count: number }>;
};

/** Calcule progressivement côté client le coût SMS pour un volume custom. */
function computeProgressive(
  volume: number,
  tiers: Tier[],
): { breakdown: Array<{ tier: Tier; smsInTier: number; subTotal: number }>; total: number } {
  const breakdown: Array<{ tier: Tier; smsInTier: number; subTotal: number }> = [];
  let total = 0;
  if (volume <= 0) return { breakdown, total };
  for (const t of tiers) {
    if (volume < t.fromVolume) break;
    const upper = t.toVolume ?? Number.POSITIVE_INFINITY;
    const smsInTier = Math.max(0, Math.min(volume, upper) - t.fromVolume + 1);
    if (smsInTier <= 0) continue;
    const sub = Number((smsInTier * t.pricePerSms).toFixed(2));
    breakdown.push({ tier: t, smsInTier, subTotal: sub });
    total += sub;
  }
  return { breakdown, total: Number(total.toFixed(2)) };
}

export default function SmsBillingClient() {
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulateVolume, setSimulateVolume] = useState(3055);
  const [simulateCampaigns, setSimulateCampaigns] = useState(2);

  useEffect(() => {
    fetch("/api/dashboard/billing/sms-usage")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const simulated = useMemo(() => {
    if (!data) return null;
    const { breakdown, total: smsTotal } = computeProgressive(
      simulateVolume,
      data.pricing.tiers,
    );
    const standard = Math.min(
      simulateCampaigns,
      data.pricing.campaign_loyalty_trigger - 1,
    );
    const loyalty = Math.max(
      0,
      simulateCampaigns - (data.pricing.campaign_loyalty_trigger - 1),
    );
    const campaignCost = Number(
      (
        standard * data.pricing.campaign_standard_chf +
        loyalty * data.pricing.campaign_loyalty_chf
      ).toFixed(2),
    );
    return {
      breakdown,
      smsTotal,
      campaignCost,
      total: Number((smsTotal + campaignCost).toFixed(2)),
    };
  }, [simulateVolume, simulateCampaigns, data]);

  if (loading) {
    return <div className="text-center text-gray-400">Chargement…</div>;
  }
  if (!data || !data.ok) {
    return <div className="text-red-600">Erreur de chargement.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Bandeau zero abonnement */}
      <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
        <strong>0 CHF d&apos;abonnement mensuel</strong> · tu paies uniquement
        les SMS envoyés et les campagnes marketing que tu lances.
      </div>

      {/* Stats live */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          label="SMS ce mois"
          value={data.totals.sms_sent_this_month.toString()}
          sub={`${data.totals.credits_this_month} crédits facturés`}
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
          sub={`tier ${data.projected_cost.current_tier.name}`}
          color="#16A34A"
        />
        <Stat
          label="Campagnes ce mois"
          value={data.totals.campaigns_this_month.toString()}
          sub={`${data.pricing.campaign_standard_chf} CHF (3e+: ${data.pricing.campaign_loyalty_chf})`}
          color="#3B82F6"
        />
      </section>

      {/* Coût estimé ce mois */}
      <section className="rounded-2xl border-2 border-[#C73E1D] bg-gradient-to-br from-[#FFF2D1] to-[#FFE9B8] p-5 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#C73E1D]">
              Coût ce mois (en cours)
            </div>
            <div className="mt-1 text-2xl font-black">
              {data.current_cost.current_tier.name} active ·{" "}
              {data.current_cost.current_tier.pricePerSms.toFixed(2)} CHF/SMS
            </div>
            <div className="text-xs text-gray-700">
              Volume : {data.totals.credits_this_month} SMS ·{" "}
              {data.totals.campaigns_this_month} campagne
              {data.totals.campaigns_this_month > 1 ? "s" : ""}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-700">Total estimé</div>
            <div className="text-3xl font-black text-[#C73E1D]">
              {data.current_cost.total.toFixed(2)} CHF
            </div>
            <div className="text-xs text-gray-600">
              {data.current_cost.sms_cost.toFixed(2)} SMS +{" "}
              {data.current_cost.campaign_cost.toFixed(2)} campagnes
            </div>
          </div>
        </div>

        {/* Détail tranches actives */}
        {data.current_cost.sms_breakdown.length > 0 && (
          <div className="mt-4 space-y-1 rounded-xl bg-white/70 p-3 text-xs">
            <div className="font-semibold text-gray-700">
              Détail tarification progressive :
            </div>
            {data.current_cost.sms_breakdown.map((b) => (
              <div key={b.tier.name} className="flex justify-between">
                <span className="text-gray-600">
                  {b.tier.name} ({b.tier.fromVolume}–{b.tier.toVolume ?? "∞"}) ·{" "}
                  {b.smsInTier} × {b.tier.pricePerSms.toFixed(2)} CHF
                </span>
                <span className="font-semibold tabular-nums">
                  {b.subTotal.toFixed(2)} CHF
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Barème 5 tranches */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-3">
          <h2 className="font-bold text-gray-800">
            Barème SMS dégressif (par tranches mensuelles)
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Les premiers 1 500 SMS du mois sont à 0.19 CHF, les suivants
            tombent automatiquement à 0.15, etc. Pas de facture si tu n&apos;envoies pas.
          </p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-5 py-2">Tranche</th>
              <th className="px-5 py-2 text-right">Volume / mois</th>
              <th className="px-5 py-2 text-right">Prix / SMS</th>
              <th className="px-5 py-2 text-right">Économie vs T1</th>
            </tr>
          </thead>
          <tbody>
            {data.pricing.tiers.map((t) => {
              const isCurrent = t.name === data.current_cost.current_tier.name;
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
                    {t.fromVolume}–{t.toVolume ?? "∞"}
                  </td>
                  <td className="px-5 py-2.5 text-right font-bold">
                    {t.pricePerSms.toFixed(2)} CHF
                  </td>
                  <td className="px-5 py-2.5 text-right text-[#C73E1D]">
                    {t.savingsVsT1Pct !== null
                      ? `−${t.savingsVsT1Pct} %`
                      : "Tarif d'entrée"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Campagnes marketing */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 font-bold text-gray-800">
          Campagnes marketing à la carte
        </h2>
        <p className="mb-3 text-xs text-gray-500">
          Aucun engagement. Tu décides quand lancer. Inclus : segmentation +
          rédaction + envoi + rapport.
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Tarif standard
            </div>
            <div className="mt-1 text-2xl font-black text-[#C73E1D]">
              {data.pricing.campaign_standard_chf} CHF
            </div>
            <div className="text-xs text-gray-600">
              1re et 2e campagne du mois
            </div>
          </div>
          <div className="rounded-xl border-2 border-[#16A34A] bg-emerald-50 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Remise fidélité
            </div>
            <div className="mt-1 text-2xl font-black text-emerald-700">
              {data.pricing.campaign_loyalty_chf} CHF{" "}
              <span className="text-xs font-semibold">−34%</span>
            </div>
            <div className="text-xs text-gray-700">
              Dès la 3e campagne du même mois
            </div>
          </div>
        </div>
      </section>

      {/* Simulateur */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 font-bold text-gray-800">Simulateur</h2>
        <p className="mb-4 text-xs text-gray-500">
          Combien ça coûte à différents volumes + nombres de campagnes ?
        </p>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-700">
              SMS / mois : <span className="font-mono">{simulateVolume}</span>
            </label>
            <input
              type="range"
              min={0}
              max={8000}
              step={50}
              value={simulateVolume}
              onChange={(e) => setSimulateVolume(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">
              Campagnes / mois : <span className="font-mono">{simulateCampaigns}</span>
            </label>
            <input
              type="range"
              min={0}
              max={6}
              step={1}
              value={simulateCampaigns}
              onChange={(e) => setSimulateCampaigns(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        {simulated && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <div className="text-[10px] font-semibold uppercase text-gray-500">
                Coût SMS
              </div>
              <div className="mt-1 text-base font-bold text-[#C73E1D]">
                {simulated.smsTotal.toFixed(2)} CHF
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <div className="text-[10px] font-semibold uppercase text-gray-500">
                Campagnes
              </div>
              <div className="mt-1 text-base font-bold text-[#3B82F6]">
                {simulated.campaignCost.toFixed(2)} CHF
              </div>
            </div>
            <div className="rounded-xl bg-[#FFF7E4] p-3 text-center">
              <div className="text-[10px] font-semibold uppercase text-gray-500">
                Total mensuel
              </div>
              <div className="mt-1 text-base font-black text-[#C73E1D]">
                {simulated.total.toFixed(2)} CHF
              </div>
            </div>
          </div>
        )}
        {simulated && simulated.breakdown.length > 0 && (
          <div className="mt-3 space-y-1 rounded-xl bg-gray-50 p-3 text-xs">
            <div className="font-semibold text-gray-700">Détail SMS :</div>
            {simulated.breakdown.map((b) => (
              <div key={b.tier.name} className="flex justify-between">
                <span className="text-gray-600">
                  {b.tier.name} · {b.smsInTier} × {b.tier.pricePerSms.toFixed(2)}
                </span>
                <span className="tabular-nums font-medium">
                  {b.subTotal.toFixed(2)} CHF
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3 scénarios PDF */}
      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          3 scénarios types Rialto (PDF offre Mehmet)
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {(["a", "b", "c"] as const).map((k) => {
            const s = data.scenarios[k];
            const isRecommended = k === "b";
            return (
              <div
                key={k}
                className={`rounded-2xl border-2 p-4 ${
                  isRecommended
                    ? "border-[#C73E1D] bg-[#FFF7E4] shadow-pop"
                    : "border-gray-200 bg-white shadow-sm"
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#C73E1D]">
                  {s.label}
                  {isRecommended && (
                    <span className="ml-2 rounded-full bg-[#C73E1D] px-2 py-0.5 text-[9px] text-white">
                      RECOMMANDÉ
                    </span>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {s.sms_volume} SMS · {s.campaigns} campagne
                  {s.campaigns > 1 ? "s" : ""}
                </div>
                <div className="mt-1 text-2xl font-black text-[#C73E1D]">
                  {s.total.toFixed(2)} CHF
                </div>
                <div className="text-xs text-gray-500">
                  ({s.sms_cost.toFixed(2)} SMS + {s.campaign_cost.toFixed(2)} camp.)
                </div>
                <div className="mt-2 text-[10px] text-gray-400">
                  Annuel ≈ {(s.total * 12).toFixed(0)} CHF
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Channels & top templates */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
            Par canal (12 mois)
          </h2>
          <dl className="space-y-2">
            <Row label="SMS Rialto (sender)" value={data.channels.sms_rialto} />
            <Row
              label="SMS Stampify (fallback)"
              value={data.channels.sms_stampify}
            />
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
        Tarification offre Avril 2026 · Aligné sur PDF Mehmet · Aucun
        abonnement mensuel · {new Date(data.generated_at).toLocaleString("fr-CH")}
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
