import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminPendingActions from "@/components/AdminPendingActions";

const ADMIN_EMAIL = "augustin-domenget@stampify.ch";

// ─── helpers ─────────────────────────────────────────────────────────────────

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

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) redirect("/");

  // Fetch all businesses
  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, business_name, email, country, plan, subscription_status, status, phone, activation_code, created_at")
    .order("created_at", { ascending: false });

  const bizList = businesses ?? [];

  // Pending vs active
  const pendingList = bizList.filter((b) => b.status === "pending");
  const activeList = bizList.filter((b) => b.status !== "pending");

  // Stats
  const totalMerchants = bizList.length;
  const proCount = bizList.filter((b) => b.plan === "pro" && b.status === "active").length;
  const essentialCount = bizList.filter((b) => b.plan === "essential" && b.status === "active").length;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const newThisMonth = bizList.filter((b) => new Date(b.created_at) >= startOfMonth).length;

  const mrr = bizList
    .filter((b) => b.status === "active")
    .reduce((sum, b) => sum + (b.plan === "pro" ? 59 : 29), 0);

  // Global counts
  const { count: totalCustomers } = await supabase
    .from("customers")
    .select("id", { count: "exact", head: true });

  const { count: totalCards } = await supabase
    .from("customer_cards")
    .select("id", { count: "exact", head: true });

  const { count: totalTx } = await supabase
    .from("transactions")
    .select("id", { count: "exact", head: true });

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

        {/* Pending merchants section */}
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
              <AdminPendingActions pendingBusinesses={pendingList} />
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
          <StatCard label="Total clients" value={totalCustomers ?? 0} color="indigo" />
          <StatCard label="Cartes distribuées" value={totalCards ?? 0} color="green" />
          <StatCard label="Transactions" value={totalTx ?? 0} color="gray" />
        </div>

        {/* Merchant table */}
        <h2 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Commerçants actifs ({activeList.length})
        </h2>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                {["Commerce", "Email", "Plan", "Statut", "Pays", "Inscrit le"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeList.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "32px 16px", textAlign: "center", color: "#9ca3af" }}>
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
