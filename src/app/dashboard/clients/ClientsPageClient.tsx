"use client";

import { useEffect, useState } from "react";

type ClientRow = {
  customer_id: string | null;
  phone: string;
  first_name: string;
  last_name: string;
  age_range: string | null;
  gender: string | null;
  order_count: number;
  total_spent: number;
  last_order_days: number;
  segment: string;
};

type ClientDetail = {
  ok: boolean;
  phone: string;
  customer: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string;
    email: string | null;
    date_of_birth: string | null;
    age_range: string | null;
    gender: string | null;
    activated_at: string | null;
    created_at: string | null;
  } | null;
  card: {
    id: string;
    short_code: string;
    current_stamps: number;
    rewards_claimed: number;
    is_fully_activated: boolean | null;
    created_at: string;
  } | null;
  orders: Array<{
    id: string;
    order_number: string;
    total_amount: string | number;
    status: string;
    created_at: string;
    fulfillment_type: string | null;
    promo_discount_amount: string | number | null;
  }>;
  sms_logs: Array<{
    id: string;
    created_at: string;
    template_key: string | null;
    sender_used: string | null;
    content: string;
    status: string;
    error_message: string | null;
    cost_credits: number | null;
    order_id: string | null;
  }>;
  promo_codes: Array<{
    code: string;
    discount_type: string;
    discount_value: number;
    uses_count: number;
    max_uses: number;
    valid_until: string | null;
    source: string | null;
  }>;
  totals: {
    orders: number;
    revenue: number;
    sms_count: number;
    sms_sent: number;
    sms_failed: number;
  };
};

const SEGMENT_COLORS: Record<string, string> = {
  champions: "#C73E1D",
  loyal: "#E6A12C",
  potential_loyal: "#16A34A",
  new: "#3B82F6",
  promising: "#8B5CF6",
  need_attention: "#F59E0B",
  about_to_sleep: "#F97316",
  at_risk: "#DC2626",
  cant_lose: "#7C2D12",
  hibernating: "#6B7280",
  lost: "#374151",
};

type CustomerTag = {
  id: string;
  tag: string;
  note: string | null;
  created_at: string;
};

const TAG_PRESETS = [
  "VIP",
  "Allergique arachide",
  "Allergique gluten",
  "Allergique lactose",
  "Halal",
  "Cash uniquement",
  "Difficile",
  "Regulier",
  "Ami",
  "Mauvais payeur",
];

export default function ClientsPageClient() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [detail, setDetail] = useState<ClientDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [tags, setTags] = useState<CustomerTag[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [tagSubmitting, setTagSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (segmentFilter) params.set("segment", segmentFilter);
    setLoading(true);
    fetch(`/api/dashboard/clients?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setClients(d.customers);
          setTotal(d.total);
        }
      })
      .finally(() => setLoading(false));
  }, [search, segmentFilter]);

  const openDetail = async (phone: string) => {
    setSelectedPhone(phone);
    setDetailLoading(true);
    setDetail(null);
    setTags([]);
    try {
      const res = await fetch(`/api/dashboard/clients/${encodeURIComponent(phone)}`);
      const body = await res.json();
      if (body.ok) {
        setDetail(body);
        // Phase 11 C16 : load tags
        if (body.customer?.id) {
          const tRes = await fetch(
            `/api/dashboard/customer-tags?customer_id=${body.customer.id}`,
          );
          const tBody = await tRes.json();
          if (tBody.ok) setTags(tBody.tags);
        }
      }
    } finally {
      setDetailLoading(false);
    }
  };

  async function addTag(tag: string) {
    if (!detail?.customer?.id || !tag.trim()) return;
    setTagSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/customer-tags", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer_id: detail.customer.id,
          tag: tag.trim(),
        }),
      });
      const body = await res.json();
      if (body.ok) {
        setTags((prev) => [body.tag, ...prev]);
        setNewTagInput("");
      } else {
        alert(body.error ?? "Erreur");
      }
    } finally {
      setTagSubmitting(false);
    }
  }

  async function removeTag(id: string) {
    await fetch(`/api/dashboard/customer-tags?id=${id}`, { method: "DELETE" });
    setTags((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="search"
          placeholder="Rechercher nom ou téléphone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C73E1D] focus:outline-none md:flex-1"
        />
        <select
          value={segmentFilter}
          onChange={(e) => setSegmentFilter(e.target.value)}
          className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#C73E1D] focus:outline-none"
        >
          <option value="">Tous segments</option>
          <option value="champions">Champions</option>
          <option value="loyal">Fidèles</option>
          <option value="potential_loyal">Fidèles potentiels</option>
          <option value="new">Nouveaux</option>
          <option value="promising">Prometteurs</option>
          <option value="need_attention">Attention</option>
          <option value="about_to_sleep">En perte</option>
          <option value="at_risk">À risque</option>
          <option value="cant_lose">Ne pas perdre</option>
          <option value="hibernating">Dormants</option>
          <option value="lost">Perdus</option>
        </select>
        <div className="text-xs text-gray-500">
          {total} client{total > 1 ? "s" : ""}
        </div>
      </div>

      {/* Liste */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Chargement…</div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Aucun client.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Téléphone</th>
                <th className="px-4 py-3">Segment</th>
                <th className="px-4 py-3 text-right">Commandes</th>
                <th className="px-4 py-3 text-right">Total CHF</th>
                <th className="px-4 py-3 text-right">Dernière</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr
                  key={c.phone}
                  className="cursor-pointer border-t border-gray-100 hover:bg-gray-50"
                  onClick={() => openDetail(c.phone)}
                >
                  <td className="px-4 py-3 font-medium">
                    {c.first_name} {c.last_name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    {c.phone}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                      style={{ background: SEGMENT_COLORS[c.segment] ?? "#999" }}
                    >
                      {c.segment}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{c.order_count}</td>
                  <td className="px-4 py-3 text-right font-bold">
                    {c.total_spent.toFixed(0)}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-gray-500">
                    {c.last_order_days}j
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[#C73E1D]">→</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Détail modal */}
      {selectedPhone && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm md:items-center md:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPhone(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl md:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Fiche client
                </div>
                <div className="font-bold text-lg">
                  {detail?.customer
                    ? `${detail.customer.first_name ?? ""} ${detail.customer.last_name ?? ""}`.trim() || "Client"
                    : selectedPhone}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhone(null)}
                className="rounded-full p-2 hover:bg-gray-100"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            {detailLoading ? (
              <div className="p-8 text-center text-gray-400">Chargement…</div>
            ) : !detail ? (
              <div className="p-8 text-center text-gray-400">Introuvable.</div>
            ) : (
              <div className="space-y-6 p-6">
                {/* Infos & totaux */}
                <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <StatBlock label="Commandes" value={detail.totals.orders.toString()} />
                  <StatBlock label="CA total" value={`${detail.totals.revenue.toFixed(0)} CHF`} />
                  <StatBlock label="SMS envoyés" value={detail.totals.sms_sent.toString()} />
                  <StatBlock
                    label="SMS échoués"
                    value={detail.totals.sms_failed.toString()}
                    color={detail.totals.sms_failed > 0 ? "#DC2626" : "#374151"}
                  />
                </section>

                {/* Phase 11 C16 : Tags clients */}
                {detail.customer && (
                  <section>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Tags 🏷️
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.length === 0 && (
                        <span className="text-xs text-gray-400">
                          Pas encore de tag.
                        </span>
                      )}
                      {tags.map((t) => (
                        <span
                          key={t.id}
                          className="inline-flex items-center gap-1 rounded-full bg-[#C73E1D]/10 px-2.5 py-0.5 text-xs font-semibold text-[#C73E1D]"
                        >
                          {t.tag}
                          <button
                            type="button"
                            onClick={() => removeTag(t.id)}
                            className="rounded-full text-[#C73E1D]/60 hover:text-[#C73E1D]"
                            aria-label="Retirer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {TAG_PRESETS.filter(
                        (p) => !tags.find((t) => t.tag === p),
                      ).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => addTag(p)}
                          disabled={tagSubmitting}
                          className="rounded-full border border-gray-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-600 hover:border-[#C73E1D] hover:text-[#C73E1D] disabled:opacity-50"
                        >
                          + {p}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag(newTagInput);
                          }
                        }}
                        placeholder="Tag personnalisé…"
                        maxLength={40}
                        className="flex-1 rounded-xl border border-gray-300 px-3 py-1.5 text-xs focus:border-[#C73E1D] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => addTag(newTagInput)}
                        disabled={!newTagInput.trim() || tagSubmitting}
                        className="rounded-xl bg-[#C73E1D] px-3 py-1.5 text-xs font-bold text-white hover:bg-red-900 disabled:opacity-50"
                      >
                        Ajouter
                      </button>
                    </div>
                  </section>
                )}

                {detail.customer && (
                  <section>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Profil
                    </h3>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <Row label="Téléphone" value={detail.phone} />
                      <Row label="Email" value={detail.customer.email ?? "—"} />
                      <Row label="Né(e) le" value={detail.customer.date_of_birth ?? "—"} />
                      <Row label="Tranche âge" value={detail.customer.age_range ?? "—"} />
                      <Row label="Genre" value={detail.customer.gender ?? "—"} />
                      <Row
                        label="Inscrit(e)"
                        value={
                          detail.customer.created_at
                            ? new Date(detail.customer.created_at).toLocaleDateString("fr-CH")
                            : "—"
                        }
                      />
                    </dl>
                  </section>
                )}

                {detail.card && (
                  <section>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Carte fidélité
                    </h3>
                    <div className="rounded-xl bg-gradient-to-r from-[#C73E1D] to-[#8F2B14] p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs opacity-80">Code</div>
                          <div className="font-mono text-xl font-bold">
                            #{detail.card.short_code}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs opacity-80">Tampons</div>
                          <div className="text-xl font-bold">
                            {detail.card.current_stamps}/10
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs opacity-80">
                        {detail.card.is_fully_activated
                          ? "✓ Activation complète"
                          : "⚠ Étape 2 non complétée (pas d'anniversaire)"}{" "}
                        · {detail.card.rewards_claimed} récompense
                        {detail.card.rewards_claimed > 1 ? "s" : ""} réclamée(s)
                      </div>
                    </div>
                  </section>
                )}

                {/* Orders */}
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Commandes ({detail.orders.length})
                  </h3>
                  {detail.orders.length === 0 ? (
                    <p className="text-xs text-gray-500">Aucune commande.</p>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50 text-left">
                          <tr>
                            <th className="px-3 py-2">N°</th>
                            <th className="px-3 py-2">Date</th>
                            <th className="px-3 py-2">Statut</th>
                            <th className="px-3 py-2">Type</th>
                            <th className="px-3 py-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detail.orders.slice(0, 20).map((o) => (
                            <tr key={o.id} className="border-t border-gray-100">
                              <td className="px-3 py-1.5 font-mono">{o.order_number}</td>
                              <td className="px-3 py-1.5">
                                {new Date(o.created_at).toLocaleDateString("fr-CH")}
                              </td>
                              <td className="px-3 py-1.5">{o.status}</td>
                              <td className="px-3 py-1.5">{o.fulfillment_type ?? "—"}</td>
                              <td className="px-3 py-1.5 text-right font-semibold">
                                {Number(o.total_amount).toFixed(2)} CHF
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                {/* Promo codes */}
                {detail.promo_codes.length > 0 && (
                  <section>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                      Codes promo ({detail.promo_codes.length})
                    </h3>
                    <div className="space-y-1.5">
                      {detail.promo_codes.map((p) => {
                        const expired =
                          p.valid_until && new Date(p.valid_until) < new Date();
                        const used = p.uses_count >= p.max_uses;
                        return (
                          <div
                            key={p.code}
                            className={`flex items-center justify-between rounded-xl border p-2 text-xs ${
                              expired || used
                                ? "border-gray-200 bg-gray-50 opacity-60"
                                : "border-green-200 bg-green-50"
                            }`}
                          >
                            <div className="font-mono font-bold">{p.code}</div>
                            <div className="text-gray-600">
                              {p.discount_type === "percent"
                                ? `-${p.discount_value}%`
                                : `-${p.discount_value} CHF`}{" "}
                              · {p.source ?? "?"} ·{" "}
                              {p.valid_until
                                ? `exp ${new Date(p.valid_until).toLocaleDateString("fr-CH")}`
                                : "—"}
                              {used && " · utilisé"}
                              {expired && " · expiré"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* SMS logs */}
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Historique SMS ({detail.sms_logs.length})
                  </h3>
                  {detail.sms_logs.length === 0 ? (
                    <p className="text-xs text-gray-500">
                      Aucun SMS envoyé à ce client (ou logs plus anciens que
                      Phase 11 C3).
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {detail.sms_logs.slice(0, 30).map((l) => (
                        <div
                          key={l.id}
                          className={`rounded-xl border p-3 text-xs ${
                            l.status === "sent"
                              ? "border-green-200 bg-green-50"
                              : "border-red-200 bg-red-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                {l.status === "sent" ? "✅" : "❌"}
                              </span>
                              <span className="font-semibold">
                                {l.template_key ?? "?"}
                              </span>
                              <span className="text-gray-500">
                                · {l.sender_used ?? "?"}
                              </span>
                              {l.cost_credits && (
                                <span className="text-gray-500">
                                  · {l.cost_credits} cr.
                                </span>
                              )}
                            </div>
                            <span className="text-gray-400">
                              {new Date(l.created_at).toLocaleString("fr-CH")}
                            </span>
                          </div>
                          <p className="mt-1.5 text-gray-700">{l.content}</p>
                          {l.error_message && (
                            <p className="mt-1 text-red-700">
                              Erreur: {l.error_message}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBlock({
  label,
  value,
  color = "#111827",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-xl font-black" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
