"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FEATURES,
  FEATURE_CATEGORIES,
  FEATURE_PRESETS,
  type FeatureDef,
} from "@/lib/adminFeatures";

const PIN = "0808";
const SESSION_KEY = "admin_unlocked";

type Business = {
  id: string;
  business_name: string;
  email: string;
  country: string | null;
  plan: string | null;
  subscription_status: string | null;
  status: string;
  phone: string | null;
  created_at: string;
  enabled_features: string[] | null;
  google_place_id: string | null;
  onboarding_completed: boolean | null;
};

type Stats = {
  orders_count: number;
  cards_count: number;
};

type Tab = "aperçu" | "features" | "commandes" | "clients" | "fidelite" | "sms" | "historique";

export default function AdminBusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("features");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) !== "true") {
      router.replace("/admin");
      return;
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/business?pin=${PIN}&id=${id}`);
      if (!res.ok) {
        setError("Impossible de charger le business.");
        return;
      }
      const body = (await res.json()) as { business: Business; stats: Stats };
      setBusiness(body.business);
      setStats(body.stats);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Chargement…
      </div>
    );
  }
  if (error || !business) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#dc2626" }}>
        {error ?? "Business introuvable"}
      </div>
    );
  }

  const planBadge = (plan: string | null) => {
    if (plan === "pro") return { bg: "#f5f3ff", text: "#6d28d9", label: "Pro" };
    if (plan === "business") return { bg: "#fff7ed", text: "#ea580c", label: "Business" };
    if (plan === "essential") return { bg: "#f0fdf4", text: "#15803d", label: "Essentiel" };
    return { bg: "#fef2f2", text: "#b91c1c", label: "Aucun" };
  };
  const pb = planBadge(business.plan);

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
      <header style={{ borderBottom: "1px solid #e5e7eb", background: "#fff", padding: "16px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Link href="/admin" style={{ color: "#6b7280", fontSize: 13, textDecoration: "none" }}>
            ← Admin Stampify
          </Link>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              {business.business_name?.slice(0, 1)?.toUpperCase() ?? "?"}
            </div>
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  margin: 0,
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 26,
                  fontWeight: 700,
                }}
              >
                {business.business_name}
              </h1>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
                {business.email} · {business.country ?? "—"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  background: pb.bg,
                  color: pb.text,
                }}
              >
                {pb.label}
              </span>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  background: business.subscription_status === "active" ? "#f0fdf4" : "#f9fafb",
                  color: business.subscription_status === "active" ? "#15803d" : "#6b7280",
                }}
              >
                {business.subscription_status === "active" ? "✓ Actif" : "⏸ Inactif"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "24px auto", padding: "0 24px" }}>
        {/* Quick stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <StatCard label="Commandes" value={stats?.orders_count ?? 0} />
          <StatCard label="Cartes actives" value={stats?.cards_count ?? 0} />
          <StatCard label="Onboarding" value={business.onboarding_completed ? "Terminé" : "En cours"} />
          <StatCard label="Créé le" value={new Date(business.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })} />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #e5e7eb", marginBottom: 20 }}>
          {(
            [
              { key: "aperçu", label: "Aperçu" },
              { key: "features", label: "Features" },
              { key: "commandes", label: "Commandes" },
              { key: "clients", label: "Clients" },
              { key: "sms", label: "SMS" },
            ] as { key: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                padding: "10px 16px",
                border: "none",
                background: "transparent",
                fontSize: 13,
                fontWeight: 600,
                color: tab === t.key ? "#1D4ED8" : "#6b7280",
                borderBottom: tab === t.key ? "2px solid #1D4ED8" : "2px solid transparent",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "features" && (
          <FeaturesTab business={business} onUpdated={(b) => setBusiness(b)} />
        )}
        {tab === "aperçu" && (
          <OverviewTab business={business} />
        )}
        {(tab === "commandes" || tab === "clients" || tab === "sms") && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 32, textAlign: "center", color: "#6b7280" }}>
            Section « {tab} » en cours de développement.
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: "#111827" }}>
        {value}
      </div>
    </div>
  );
}

function OverviewTab({ business }: { business: Business }) {
  const row: React.CSSProperties = { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6", fontSize: 14 };
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700 }}>Infos business</h3>
      <div style={row}><span style={{ color: "#6b7280" }}>Nom</span><span>{business.business_name}</span></div>
      <div style={row}><span style={{ color: "#6b7280" }}>Email</span><span>{business.email}</span></div>
      <div style={row}><span style={{ color: "#6b7280" }}>Téléphone</span><span>{business.phone ?? "—"}</span></div>
      <div style={row}><span style={{ color: "#6b7280" }}>Pays</span><span>{business.country ?? "—"}</span></div>
      <div style={row}><span style={{ color: "#6b7280" }}>Google Place ID</span><span style={{ fontFamily: "monospace", fontSize: 12 }}>{business.google_place_id ?? "—"}</span></div>
      <div style={{ ...row, borderBottom: "none" }}><span style={{ color: "#6b7280" }}>Stripe customer</span><span style={{ fontFamily: "monospace", fontSize: 12 }}>—</span></div>
    </div>
  );
}

function FeaturesTab({
  business,
  onUpdated,
}: {
  business: Business;
  onUpdated: (next: Business) => void;
}) {
  const [enabled, setEnabled] = useState<string[]>(business.enabled_features ?? []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (slug: string) => {
    setEnabled((list) =>
      list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug],
    );
    setSaved(false);
  };

  const applyPreset = (presetKey: string) => {
    const preset = FEATURE_PRESETS[presetKey];
    if (!preset) return;
    setEnabled(preset.features);
    setSaved(false);
  };

  async function save() {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/update-business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pin: PIN,
        business_id: business.id,
        enabled_features: enabled,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      onUpdated({ ...business, enabled_features: enabled });
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Features visibles dans la sidebar</h3>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
            Coche les rubriques visibles dans le dashboard de ce business.
            {" "}{enabled.length} sur {FEATURES.length} activées.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            onChange={(e) => e.target.value && applyPreset(e.target.value)}
            value=""
            style={{ padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13 }}
          >
            <option value="">Preset…</option>
            {Object.entries(FEATURE_PRESETS).map(([k, p]) => (
              <option key={k} value={k}>{p.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => { setEnabled(FEATURES.map((f) => f.slug)); setSaved(false); }}
            style={{ padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, background: "#fff", cursor: "pointer" }}
          >
            Tout activer
          </button>
          <button
            type="button"
            onClick={() => { setEnabled(["dashboard"]); setSaved(false); }}
            style={{ padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, background: "#fff", cursor: "pointer" }}
          >
            Tout désactiver
          </button>
        </div>
      </div>

      {FEATURE_CATEGORIES.map((category) => {
        const list = FEATURES.filter((f) => f.category === category);
        if (!list.length) return null;
        return (
          <div key={category} style={{ marginBottom: 20 }}>
            <h4 style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.8 }}>
              {category}
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
              {list.map((f) => (
                <FeatureCheckbox
                  key={f.slug}
                  feature={f}
                  checked={enabled.includes(f.slug)}
                  onToggle={() => toggle(f.slug)}
                />
              ))}
            </div>
          </div>
        );
      })}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, marginTop: 20, paddingTop: 16, borderTop: "1px solid #e5e7eb" }}>
        {saved && (
          <span style={{ fontSize: 13, fontWeight: 600, color: "#15803d" }}>
            ✓ Enregistré — le dashboard se met à jour au prochain chargement
          </span>
        )}
        <button
          type="button"
          disabled={saving}
          onClick={save}
          style={{
            padding: "10px 20px",
            background: "#1D4ED8",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

function FeatureCheckbox({
  feature,
  checked,
  onToggle,
}: {
  feature: FeatureDef;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: 12,
        border: `1.5px solid ${checked ? "#2563EB" : "#e5e7eb"}`,
        background: checked ? "#eff6ff" : "#fff",
        borderRadius: 10,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        style={{ marginTop: 2, accentColor: "#2563EB" }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
          <span style={{ marginRight: 6 }}>{feature.icon}</span>
          {feature.name}
          {feature.requiresPro && (
            <span
              style={{
                marginLeft: 6,
                padding: "1px 6px",
                borderRadius: 4,
                background: "#f5f3ff",
                color: "#6d28d9",
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Pro
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2, lineHeight: 1.4 }}>
          {feature.description}
        </div>
      </div>
    </label>
  );
}
