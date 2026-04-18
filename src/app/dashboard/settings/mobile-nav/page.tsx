"use client";

import { useEffect, useState } from "react";
import DashboardNav from "@/components/DashboardNav";
import {
  DEFAULT_QUICK_ACTIONS,
  parseQuickActions,
  QUICK_ACTIONS,
  type QuickActionSlug,
} from "@/lib/mobileQuickActions";

const ALL_CHOICES: QuickActionSlug[] = [
  "dashboard",
  "commandes",
  "cards",
  "stats",
  "reservations",
  "spin-wheel",
  "lottery",
  "sms",
  "commandes-menu",
  "promotions",
  "gift-cards",
  "marketplace",
  "click-collect",
  "team",
  "billing",
  "appearance",
  "establishments",
  "settings",
];

export default function MobileNavCustomizationPage() {
  const [slots, setSlots] = useState<QuickActionSlug[]>(DEFAULT_QUICK_ACTIONS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/businesses/me/mobile-nav");
        if (res.ok) {
          const body = (await res.json()) as {
            mobile_quick_actions: QuickActionSlug[];
          };
          setSlots(parseQuickActions(body.mobile_quick_actions));
        }
      } catch {
        /* ignore */
      }
      setLoading(false);
    })();
  }, []);

  const setSlot = (idx: 0 | 1 | 2, value: QuickActionSlug) => {
    const next = [...slots] as QuickActionSlug[];
    next[idx] = value;
    setSlots(next);
    setSaved(false);
  };

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/businesses/me/mobile-nav", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mobile_quick_actions: slots }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((body as { error?: string }).error ?? "Échec de l'enregistrement");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        // Déclenche un re-fetch du DashboardNav (reload nécessaire)
        window.dispatchEvent(new CustomEvent("mobile-nav-updated", { detail: slots }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="md:ml-64 pb-28 md:pb-8 p-4 md:p-8">
        <div className="mx-auto max-w-xl">
          <h1 className="text-2xl font-black tracking-tight">
            Personnalisation du menu mobile
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Choisissez les 3 raccourcis visibles dans la barre du bas sur mobile.
            <br />
            <strong>Scanner</strong> et <strong>Menu</strong> sont toujours
            accessibles.
          </p>

          {loading ? (
            <div className="mt-8 text-sm text-gray-500">Chargement…</div>
          ) : (
            <div className="mt-6 space-y-6 rounded-2xl border border-gray-200 bg-white p-6">
              <section className="space-y-3">
                {[0, 1, 2].map((idx) => (
                  <SlotPicker
                    key={idx}
                    label={`Raccourci ${idx + 1}`}
                    value={slots[idx]}
                    onChange={(v) => setSlot(idx as 0 | 1 | 2, v)}
                  />
                ))}
              </section>

              <section>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Aperçu
                </h2>
                <Preview slots={slots} />
              </section>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-3">
                {saved && (
                  <span className="text-xs font-semibold text-emerald-600">
                    ✓ Enregistré — rechargez la page pour appliquer
                  </span>
                )}
                <button
                  type="button"
                  disabled={saving}
                  onClick={save}
                  className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                >
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SlotPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: QuickActionSlug;
  onChange: (v: QuickActionSlug) => void;
}) {
  const current = QUICK_ACTIONS[value];
  return (
    <label className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </div>
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="text-gray-400">{current.icon({ className: "w-4 h-4" })}</span>
          <span className="font-medium text-gray-900">{current.label}</span>
        </div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as QuickActionSlug)}
        className="min-w-[160px] rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
      >
        {ALL_CHOICES.map((slug) => (
          <option key={slug} value={slug}>
            {QUICK_ACTIONS[slug].label} — {QUICK_ACTIONS[slug].href}
          </option>
        ))}
      </select>
    </label>
  );
}

function Preview({ slots }: { slots: QuickActionSlug[] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-3 text-[11px] font-medium text-gray-500">
        Barre de navigation mobile
      </div>
      <div className="relative mx-auto w-full max-w-[360px] rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 items-end h-20">
          <PreviewSlot slug={slots[0]} />
          <PreviewSlot slug={slots[1]} />
          <div className="relative flex justify-center">
            <div className="absolute -top-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#1d9e75] text-white shadow-lg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <rect x="7" y="7" width="3" height="3" />
                <rect x="14" y="7" width="3" height="3" />
                <rect x="7" y="14" width="3" height="3" />
                <rect x="14" y="14" width="3" height="3" />
              </svg>
            </div>
            <div className="pb-2 pt-10 text-[10px] font-semibold text-gray-400">
              Scanner
            </div>
          </div>
          <PreviewSlot slug={slots[2]} />
          <div className="flex flex-col items-center pb-2 pt-3 text-gray-400">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span className="mt-0.5 text-[10px] font-semibold">Menu</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewSlot({ slug }: { slug: QuickActionSlug }) {
  const a = QUICK_ACTIONS[slug];
  return (
    <div className="flex flex-col items-center pb-2 pt-3 text-gray-400">
      {a.icon({ className: "w-5 h-5" })}
      <span className="mt-0.5 text-[10px] font-semibold">{a.label}</span>
    </div>
  );
}
