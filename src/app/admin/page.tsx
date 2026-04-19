"use client";

import { useEffect, useState } from "react";
import AdminPendingActions from "@/components/AdminPendingActions";
import AdminUpgradeRequests from "@/components/AdminUpgradeRequests";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Business {
  id: string;
  business_name: string;
  email: string;
  country: string | null;
  plan: string | null;
  subscription_status: string | null;
  status: string;
  phone: string | null;
  activation_code: string | null;
  created_at: string;
}

interface UpgradeRequest {
  id: string;
  business_name: string;
  business_email: string;
  business_phone: string | null;
  current_plan: string;
  requested_item: string;
  request_type: string;
  created_at: string;
}

interface AdminData {
  businesses: Business[];
  upgradeRequests: UpgradeRequest[];
  totalCustomers: number;
  totalCards: number;
  totalTx: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PIN         = "0808";
const SESSION_KEY = "admin_unlocked";

// ── Helpers ───────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color = "indigo",
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: "indigo" | "violet" | "green" | "amber" | "gray";
}) {
  const colors: Record<string, { bg: string; text: string }> = {
    indigo: { bg: "#eef2ff", text: "#4338ca" },
    violet: { bg: "#f5f3ff", text: "#6d28d9" },
    green:  { bg: "#f0fdf4", text: "#15803d" },
    amber:  { bg: "#fffbeb", text: "#b45309" },
    gray:   { bg: "#f9fafb", text: "#374151" },
  };
  const c = colors[color];
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "20px 24px" }}>
      <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af" }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: c.text, background: c.bg, display: "inline-block", padding: "2px 12px", borderRadius: 8 }}>
        {value}
      </p>
      {sub && <p style={{ margin: "8px 0 0", fontSize: 12, color: "#6b7280" }}>{sub}</p>}
    </div>
  );
}

async function fetchDashboard(): Promise<AdminData | null> {
  try {
    const res = await fetch("/api/admin/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: PIN }),
    });
    if (!res.ok) return null;
    return await res.json() as AdminData;
  } catch {
    return null;
  }
}

// ── PIN form ──────────────────────────────────────────────────────────────────

function PinForm({
  onSuccess,
}: {
  onSuccess: (data: AdminData) => void;
}) {
  const [input, setInput]     = useState("");
  const [error, setError]     = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input !== PIN) {
      setError(true);
      setInput("");
      return;
    }
    setLoading(true);
    const data = await fetchDashboard();
    setLoading(false);
    if (!data) {
      setError(true);
      setInput("");
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "true");
    onSuccess(data);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, Arial, sans-serif" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: "40px 48px", width: 320, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ background: "#534AB7", borderRadius: 12, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <span style={{ color: "#fff", fontSize: 22, fontWeight: 900 }}>S</span>
        </div>
        <h1 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 800, color: "#111827" }}>Accès admin</h1>
        <p style={{ margin: "0 0 28px", fontSize: 13, color: "#9ca3af" }}>Entrez le code secret</p>
        <form onSubmit={submit}>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="••••"
            autoFocus
            disabled={loading}
            style={{
              width: "100%",
              border: `2px solid ${error ? "#ef4444" : "#e5e7eb"}`,
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 22,
              textAlign: "center",
              letterSpacing: "0.3em",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: 12,
              opacity: loading ? 0.6 : 1,
            }}
          />
          {error && (
            <p style={{ margin: "0 0 12px", color: "#ef4444", fontSize: 13, fontWeight: 600 }}>
              Code incorrect
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#534AB7",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Chargement…" : "Accéder"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ data }: { data: AdminData }) {
  const { businesses, upgradeRequests, totalCustomers, totalCards, totalTx } = data;

  const bizList       = businesses;
  const pendingList   = bizList.filter((b) => b.status === "pending");
  const activeList    = bizList.filter((b) => b.status !== "pending");
  const totalMerchants = bizList.length;
  const proCount      = bizList.filter((b) => b.plan === "pro"       && b.status === "active").length;
  const essentialCount = bizList.filter((b) => b.plan === "essential" && b.status === "active").length;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const newThisMonth = bizList.filter((b) => new Date(b.created_at) >= startOfMonth).length;

  const mrr = bizList
    .filter((b) => b.status === "active")
    .reduce((sum, b) => sum + (b.plan === "pro" ? 59 : 29), 0);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui, Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#534AB7", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 22, fontWeight: 900 }}>S</span>
          </div>
          <div>
            <p style={{ margin: 0, color: "#fff", fontSize: 18, fontWeight: 800 }}>Stampify Admin</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Tableau de bord administrateur</p>
          </div>
        </div>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{today}</p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* Upgrade requests */}
        {upgradeRequests.length > 0 && (
          <AdminUpgradeRequests requests={upgradeRequests} pin={PIN} />
        )}

        {/* Pending merchants */}
        {pendingList.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#b45309", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                ⏳ En attente d&apos;activation ({pendingList.length})
              </h2>
              <span style={{ background: "#fef3c7", color: "#92400e", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                ACTION REQUISE
              </span>
            </div>
            <div style={{ marginBottom: 40 }}>
              <AdminPendingActions pendingBusinesses={pendingList} pin={PIN} />
            </div>
          </>
        )}

        {/* Primary stats */}
        <h2 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Vue d&apos;ensemble
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          <StatCard label="Total commerçants" value={totalMerchants} color="indigo" />
          <StatCard label="Plan Pro actif" value={proCount} sub={`${essentialCount} Essentiel actif`} color="violet" />
          <StatCard label="MRR estimé" value={`${mrr} €`} sub="EUR uniquement" color="green" />
          <StatCard label="Nouveaux ce mois" value={newThisMonth} color="amber" />
        </div>

        {/* Secondary stats */}
        <h2 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Activité plateforme
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          <StatCard label="Total clients" value={totalCustomers} color="indigo" />
          <StatCard label="Cartes distribuées" value={totalCards} color="green" />
          <StatCard label="Transactions" value={totalTx} color="gray" />
        </div>

        {/* Merchant table */}
        <h2 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Commerçants actifs ({activeList.length})
        </h2>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                {["Commerce", "Email", "Plan", "Statut", "Pays", "Inscrit le", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeList.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "32px 16px", textAlign: "center", color: "#9ca3af" }}>
                    Aucun commerçant actif.
                  </td>
                </tr>
              ) : (
                activeList.map((biz, i) => {
                  const planLabel = biz.plan === "pro" ? "Pro" : biz.plan === "essential" ? "Essentiel" : "Aucun";
                  const planColor = biz.plan === "pro"
                    ? { bg: "#f5f3ff", text: "#6d28d9" }
                    : biz.plan === "essential"
                    ? { bg: "#f0fdf4", text: "#15803d" }
                    : { bg: "#fef2f2", text: "#b91c1c" };
                  const statusLabel = biz.status === "active" ? "Actif" : biz.status === "suspended" ? "Suspendu" : "Inactif";
                  const statusColor = biz.status === "active"
                    ? { bg: "#f0fdf4", text: "#15803d" }
                    : { bg: "#f9fafb", text: "#6b7280" };

                  return (
                    <tr key={biz.id} style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : undefined }}>
                      <td style={{ padding: "14px 16px", fontWeight: 600, color: "#111827" }}>
                        {biz.business_name || "—"}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#6b7280" }}>
                        {biz.email}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: planColor.bg, color: planColor.text, padding: "3px 10px", borderRadius: 20, fontWeight: 700, fontSize: 11 }}>
                          {planLabel}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: statusColor.bg, color: statusColor.text, padding: "3px 10px", borderRadius: 20, fontWeight: 600, fontSize: 11 }}>
                          {statusLabel}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#6b7280" }}>
                        {biz.country === "CH" ? "🇨🇭 CH" : biz.country === "FR" ? "🇫🇷 FR" : biz.country ?? "—"}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#9ca3af", fontSize: 12 }}>
                        {new Date(biz.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td style={{ padding: "10px 16px" }}>
                        <BusinessActions biz={biz} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [data,     setData]     = useState<AdminData | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  // On mount: restore session if already unlocked
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      fetchDashboard().then((d) => {
        if (d) { setData(d); setUnlocked(true); }
        else    { sessionStorage.removeItem(SESSION_KEY); }
      });
    }
  }, []);

  const handleSuccess = (d: AdminData) => {
    setData(d);
    setUnlocked(true);
  };

  if (unlocked && data) return <Dashboard data={data} />;

  return <PinForm onSuccess={handleSuccess} />;
}

// ── Business quick actions (change plan + status) ────────────────────────────
function BusinessActions({ biz }: { biz: Business }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function call(update: { plan?: string | null; subscription_status?: string | null }, key: string) {
    if (busy) return;
    setBusy(key);
    setError(null);
    try {
      const res = await fetch("/api/admin/update-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: PIN, business_id: biz.id, ...update }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError((body as { error?: string }).error ?? `Erreur ${res.status}`);
      } else {
        // Reload to reflect changes
        location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(null);
    }
  }

  const btn: React.CSSProperties = {
    border: "1px solid #d1d5db",
    background: "#fff",
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
      <button
        type="button"
        style={{
          ...btn,
          color: biz.plan === "essential" ? "#9ca3af" : "#15803d",
          borderColor: biz.plan === "essential" ? "#e5e7eb" : "#86efac",
        }}
        disabled={busy !== null || biz.plan === "essential"}
        onClick={() => call({ plan: "essential" }, "essential")}
        title="Passer en plan Essentiel"
      >
        {busy === "essential" ? "…" : "→ Essentiel"}
      </button>
      <button
        type="button"
        style={{
          ...btn,
          color: biz.plan === "pro" ? "#9ca3af" : "#6d28d9",
          borderColor: biz.plan === "pro" ? "#e5e7eb" : "#c4b5fd",
        }}
        disabled={busy !== null || biz.plan === "pro"}
        onClick={() => call({ plan: "pro" }, "pro")}
        title="Passer en plan Pro (active l'accès SMS)"
      >
        {busy === "pro" ? "…" : "→ Pro"}
      </button>
      <button
        type="button"
        style={{
          ...btn,
          color: biz.subscription_status === "active" ? "#9ca3af" : "#15803d",
        }}
        disabled={busy !== null || biz.subscription_status === "active"}
        onClick={() => call({ subscription_status: "active" }, "active")}
        title="Activer l'abonnement"
      >
        {busy === "active" ? "…" : "Activer"}
      </button>
      <button
        type="button"
        style={{
          ...btn,
          color: biz.subscription_status !== "active" ? "#9ca3af" : "#b91c1c",
        }}
        disabled={busy !== null || biz.subscription_status !== "active"}
        onClick={() => call({ subscription_status: "inactive" }, "inactive")}
        title="Désactiver l'abonnement"
      >
        {busy === "inactive" ? "…" : "Désactiver"}
      </button>
      {error && (
        <span style={{ fontSize: 10, color: "#b91c1c", marginLeft: 4 }}>
          {error}
        </span>
      )}
    </div>
  );
}
