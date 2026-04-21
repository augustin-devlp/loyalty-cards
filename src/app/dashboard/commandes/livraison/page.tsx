"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardNav from "@/components/DashboardNav";
import Toggle from "@/components/ui/Toggle";
import { RIALTO_ID } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import postalCodesData from "@/data/lausanne-postal-codes.json";

type Zone = {
  id: string;
  postal_code: string;
  city: string | null;
  delivery_fee: number;
  min_order_amount: number;
  estimated_delivery_minutes: number;
  is_active: boolean;
};

type PostalCode = {
  postal_code: string;
  city: string;
  lat: number;
  lng: number;
  distance_km: number;
};

type RestaurantSettings = {
  offers_pickup: boolean;
  offers_delivery: boolean;
  pickup_prep_time_minutes: number;
  delivery_prep_time_minutes: number;
  receipt_email: string;
};

const POSTAL_CODES = postalCodesData as PostalCode[];

export default function LivraisonSettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Add zone modal
  const [addOpen, setAddOpen] = useState(false);

  // Edit zone (inline row)
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const sb = createClient();
    const [{ data: r }, zonesRes] = await Promise.all([
      sb
        .from("restaurants")
        .select(
          "offers_pickup, offers_delivery, pickup_prep_time_minutes, delivery_prep_time_minutes, receipt_email",
        )
        .eq("id", RIALTO_ID)
        .single(),
      fetch(`/api/delivery-zones?restaurant_id=${RIALTO_ID}`),
    ]);
    if (r) {
      setSettings({
        offers_pickup: r.offers_pickup ?? true,
        offers_delivery: r.offers_delivery ?? true,
        pickup_prep_time_minutes: r.pickup_prep_time_minutes ?? 15,
        delivery_prep_time_minutes: r.delivery_prep_time_minutes ?? 30,
        receipt_email: r.receipt_email ?? "augustin-domenget@stampify.ch",
      });
    }
    if (zonesRes.ok) {
      const body = (await zonesRes.json()) as { zones: Zone[] };
      setZones(body.zones);
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function saveSettings() {
    if (!settings) return;
    setSaving(true);
    setSettingsSaved(false);
    const res = await fetch(`/api/restaurants/${RIALTO_ID}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) {
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    }
  }

  async function updateZone(id: string, patch: Partial<Zone>) {
    setZones((list) =>
      list.map((z) => (z.id === id ? { ...z, ...patch } : z)),
    );
    await fetch(`/api/delivery-zones/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  async function deleteZone(id: string) {
    if (!confirm("Supprimer cette zone ?")) return;
    setZones((list) => list.filter((z) => z.id !== id));
    await fetch(`/api/delivery-zones/${id}`, { method: "DELETE" });
  }

  async function addZone(z: {
    postal_code: string;
    city: string;
    delivery_fee: number;
    min_order_amount: number;
    estimated_delivery_minutes: number;
  }) {
    const res = await fetch("/api/delivery-zones", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        restaurant_id: RIALTO_ID,
        ...z,
        is_active: true,
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert((body as { error?: string }).error ?? "Erreur");
      return;
    }
    await load();
  }

  async function applyPreset(maxKm: number) {
    if (
      !confirm(
        `Ajouter toutes les communes dans un rayon de ${maxKm} km ?\n` +
          "Les zones déjà existantes seront conservées telles quelles.",
      )
    ) return;

    const existing = new Set(zones.map((z) => z.postal_code));
    const candidates = POSTAL_CODES.filter(
      (pc) => pc.distance_km <= maxKm && !existing.has(pc.postal_code),
    );

    // Barème automatique selon distance
    const feeFor = (km: number) => {
      if (km <= 1.5) return 0;
      if (km <= 3) return 5;
      if (km <= 5) return 7;
      if (km <= 10) return 10;
      return 15;
    };
    const minFor = (km: number) => {
      if (km <= 1.5) return 25;
      if (km <= 3) return 30;
      if (km <= 5) return 35;
      if (km <= 10) return 45;
      return 60;
    };
    const etaFor = (km: number) => 25 + Math.round(km * 4);

    for (const pc of candidates) {
      await addZone({
        postal_code: pc.postal_code,
        city: pc.city,
        delivery_fee: feeFor(pc.distance_km),
        min_order_amount: minFor(pc.distance_km),
        estimated_delivery_minutes: etaFor(pc.distance_km),
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="md:ml-64 pb-28 md:pb-8 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <header>
            <h1 className="text-2xl font-black tracking-tight">
              Retrait & livraison
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Configure les modes de service et les zones de livraison.
            </p>
          </header>

          {loading || !settings ? (
            <div className="mt-10 text-sm text-gray-500">Chargement…</div>
          ) : (
            <>
              {/* Section A — toggles généraux */}
              <section className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Modes de service
                </h2>
                <Toggle
                  label="Accepter le retrait en magasin (Click & Collect)"
                  checked={settings.offers_pickup}
                  onChange={(v) =>
                    setSettings({ ...settings, offers_pickup: v })
                  }
                  showStateText
                />
                <Toggle
                  label="Accepter la livraison à domicile"
                  checked={settings.offers_delivery}
                  onChange={(v) =>
                    setSettings({ ...settings, offers_delivery: v })
                  }
                  showStateText
                />

                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <NumberField
                    label="Temps prep retrait (min)"
                    value={settings.pickup_prep_time_minutes}
                    onChange={(v) =>
                      setSettings({ ...settings, pickup_prep_time_minutes: v })
                    }
                  />
                  <NumberField
                    label="Temps prep livraison (min)"
                    value={settings.delivery_prep_time_minutes}
                    onChange={(v) =>
                      setSettings({
                        ...settings,
                        delivery_prep_time_minutes: v,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Email de réception des tickets PDF
                  </label>
                  <input
                    type="email"
                    value={settings.receipt_email}
                    onChange={(e) =>
                      setSettings({ ...settings, receipt_email: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  {settingsSaved && (
                    <span className="text-xs font-semibold text-emerald-600">
                      ✓ Enregistré
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={saving}
                    onClick={saveSettings}
                    className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                  >
                    {saving ? "…" : "Enregistrer"}
                  </button>
                </div>
              </section>

              {/* Section B — zones */}
              <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                      Zones de livraison ({zones.length})
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                      Configure les codes postaux, frais et panier min par
                      zone.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          void applyPreset(Number(e.target.value));
                          e.target.value = "";
                        }
                      }}
                      className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs"
                    >
                      <option value="">Preset rayon…</option>
                      <option value="3">Rayon 3 km (Lausanne centre)</option>
                      <option value="5">Rayon 5 km (+ Pully, Prilly)</option>
                      <option value="10">Rayon 10 km (+ Morges, Lutry)</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setAddOpen(true)}
                      className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black"
                    >
                      + Ajouter une zone
                    </button>
                  </div>
                </div>

                {zones.length === 0 ? (
                  <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
                    Aucune zone configurée. Utilisez un preset ou ajoutez
                    manuellement.
                  </div>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                          <th className="py-2 pr-3">NPA</th>
                          <th className="py-2 pr-3">Ville</th>
                          <th className="py-2 pr-3">Frais</th>
                          <th className="py-2 pr-3">Min</th>
                          <th className="py-2 pr-3">ETA</th>
                          <th className="py-2 pr-3 text-center">Actif</th>
                          <th className="py-2 pr-3 w-0"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {zones.map((z) => {
                          const isEditing = editingId === z.id;
                          return (
                            <tr
                              key={z.id}
                              className="border-b border-gray-100 last:border-b-0"
                            >
                              <td className="py-2 pr-3 font-mono text-xs font-semibold">
                                {z.postal_code}
                              </td>
                              <td className="py-2 pr-3">
                                {isEditing ? (
                                  <input
                                    className="w-full rounded-md border border-gray-200 px-2 py-1 text-xs"
                                    value={z.city ?? ""}
                                    onChange={(e) =>
                                      updateZone(z.id, { city: e.target.value })
                                    }
                                  />
                                ) : (
                                  z.city ?? "—"
                                )}
                              </td>
                              <td className="py-2 pr-3 whitespace-nowrap">
                                <NumberInline
                                  value={z.delivery_fee}
                                  editing={isEditing}
                                  suffix="CHF"
                                  step={0.5}
                                  onChange={(v) =>
                                    updateZone(z.id, { delivery_fee: v })
                                  }
                                />
                              </td>
                              <td className="py-2 pr-3 whitespace-nowrap">
                                <NumberInline
                                  value={z.min_order_amount}
                                  editing={isEditing}
                                  suffix="CHF"
                                  step={1}
                                  onChange={(v) =>
                                    updateZone(z.id, { min_order_amount: v })
                                  }
                                />
                              </td>
                              <td className="py-2 pr-3 whitespace-nowrap">
                                <NumberInline
                                  value={z.estimated_delivery_minutes}
                                  editing={isEditing}
                                  suffix="min"
                                  step={5}
                                  onChange={(v) =>
                                    updateZone(z.id, {
                                      estimated_delivery_minutes: v,
                                    })
                                  }
                                />
                              </td>
                              <td className="py-2 pr-3 text-center">
                                <Toggle
                                  checked={z.is_active}
                                  size="sm"
                                  onChange={(v) =>
                                    updateZone(z.id, { is_active: v })
                                  }
                                />
                              </td>
                              <td className="py-2 pr-3 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingId(isEditing ? null : z.id)
                                  }
                                  className="mr-1 rounded-md px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-100"
                                >
                                  {isEditing ? "Fermer" : "✎"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteZone(z.id)}
                                  className="rounded-md px-2 py-1 text-[11px] text-red-600 hover:bg-red-50"
                                >
                                  🗑
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        {addOpen && (
          <AddZoneModal
            existing={new Set(zones.map((z) => z.postal_code))}
            onClose={() => setAddOpen(false)}
            onAdded={async (z) => {
              await addZone(z);
              setAddOpen(false);
            }}
          />
        )}
      </main>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-700">
        {label}
      </label>
      <input
        type="number"
        min={0}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
      />
    </div>
  );
}

function NumberInline({
  value,
  editing,
  suffix,
  step,
  onChange,
}: {
  value: number;
  editing: boolean;
  suffix: string;
  step: number;
  onChange: (v: number) => void;
}) {
  if (!editing) {
    return (
      <span className="font-mono text-xs">
        {Number(value).toFixed(step < 1 ? 2 : 0)} {suffix}
      </span>
    );
  }
  return (
    <div className="inline-flex items-center gap-1">
      <input
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-20 rounded-md border border-gray-200 px-2 py-1 text-xs"
      />
      <span className="text-[10px] text-gray-500">{suffix}</span>
    </div>
  );
}

function AddZoneModal({
  existing,
  onClose,
  onAdded,
}: {
  existing: Set<string>;
  onClose: () => void;
  onAdded: (z: {
    postal_code: string;
    city: string;
    delivery_fee: number;
    min_order_amount: number;
    estimated_delivery_minutes: number;
  }) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PostalCode | null>(null);
  const [fee, setFee] = useState(5);
  const [min, setMin] = useState(35);
  const [eta, setEta] = useState(40);
  const [submitting, setSubmitting] = useState(false);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return POSTAL_CODES.slice(0, 10);
    return POSTAL_CODES.filter(
      (pc) =>
        pc.postal_code.startsWith(q) ||
        pc.city.toLowerCase().includes(q),
    ).slice(0, 15);
  }, [query]);

  const pick = (pc: PostalCode) => {
    setSelected(pc);
    setQuery(`${pc.postal_code} · ${pc.city}`);
    // Auto-suggestion de frais/min selon distance
    if (pc.distance_km <= 1.5) { setFee(0); setMin(25); setEta(25); }
    else if (pc.distance_km <= 3) { setFee(5); setMin(30); setEta(35); }
    else if (pc.distance_km <= 5) { setFee(7); setMin(35); setEta(45); }
    else if (pc.distance_km <= 10) { setFee(10); setMin(45); setEta(55); }
    else { setFee(15); setMin(60); setEta(70); }
  };

  async function submit() {
    if (!selected) return;
    setSubmitting(true);
    await onAdded({
      postal_code: selected.postal_code,
      city: selected.city,
      delivery_fee: fee,
      min_order_amount: min,
      estimated_delivery_minutes: eta,
    });
    setSubmitting(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
      >
        <header className="flex items-center justify-between border-b border-gray-100 p-5">
          <h3 className="text-lg font-bold">Ajouter une zone</h3>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 -mt-2 rounded-full p-2 text-gray-400 hover:bg-gray-50"
          >
            ✕
          </button>
        </header>
        <div className="p-5 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Code postal ou ville
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(null);
              }}
              placeholder="Ex. 1066 ou Epalinges"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
            {!selected && (
              <div className="mt-2 max-h-48 overflow-auto rounded-lg border border-gray-100">
                {suggestions
                  .filter((pc) => !existing.has(pc.postal_code))
                  .map((pc) => (
                    <button
                      type="button"
                      key={pc.postal_code}
                      onClick={() => pick(pc)}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      <span>
                        <span className="font-mono font-semibold">
                          {pc.postal_code}
                        </span>{" "}
                        · {pc.city}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {pc.distance_km.toFixed(1)} km
                      </span>
                    </button>
                  ))}
                {suggestions.filter((pc) => !existing.has(pc.postal_code)).length === 0 && (
                  <div className="p-3 text-center text-xs text-gray-400">
                    Aucun résultat ou déjà configuré.
                  </div>
                )}
              </div>
            )}
          </div>

          {selected && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <NumberField label="Frais (CHF)" value={fee} onChange={setFee} />
                <NumberField label="Min (CHF)" value={min} onChange={setMin} />
                <NumberField label="ETA (min)" value={eta} onChange={setEta} />
              </div>
              <p className="text-[11px] text-gray-500">
                Distance depuis Rialto : ~{selected.distance_km.toFixed(1)} km
              </p>
            </>
          )}
        </div>
        <footer className="flex gap-2 border-t border-gray-100 p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={!selected || submitting}
            onClick={submit}
            className="flex-1 rounded-full bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
          >
            {submitting ? "…" : "Ajouter"}
          </button>
        </footer>
      </div>
    </div>
  );
}
