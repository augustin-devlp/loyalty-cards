"use client";

import { useState } from "react";

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

const PLAN_LABELS: Record<string, string> = {
  essential: "Essentiel",
  pro:       "Pro",
  business:  "Business",
  none:      "Aucun",
};

const ADDON_LABELS: Record<string, string> = {
  "onboarding":         "Onboarding guidé (19€/mois)",
  "sms-campaign":       "Campagne SMS ponctuelle (19€/mois)",
  "google-review-auto": "Demande avis Google auto (29€/mois)",
  "photo-shoot":        "Shooting photo produits (99€ one-shot)",
  "website":            "Site vitrine one-page (149€ one-shot)",
};

function itemLabel(req: UpgradeRequest) {
  if (req.request_type === "plan") return `Plan ${PLAN_LABELS[req.requested_item] ?? req.requested_item}`;
  return ADDON_LABELS[req.requested_item] ?? req.requested_item;
}

export default function AdminUpgradeRequests({ requests: initial, pin }: { requests: UpgradeRequest[]; pin: string }) {
  const [requests, setRequests] = useState(initial);
  const [approving, setApproving] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const approve = async (req: UpgradeRequest) => {
    setApproving(req.id);
    setErrors(e => { const n = { ...e }; delete n[req.id]; return n; });

    const res = await fetch("/api/admin/approve-upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: req.id, pin }),
    });
    const data = await res.json();
    setApproving(null);

    if (!res.ok) {
      setErrors(e => ({ ...e, [req.id]: data.error ?? "Erreur" }));
    } else {
      setDone(d => { const n = new Set(Array.from(d)); n.add(req.id); return n; });
      setRequests(r => r.filter(x => x.id !== req.id));
    }
  };

  if (requests.length === 0 && done.size === 0) return null;

  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#6d28d9", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          🚀 Demandes d&apos;upgrade / add-on ({requests.length})
        </h2>
        {requests.length > 0 && (
          <span style={{ background: "#ede9fe", color: "#5b21b6", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
            ACTION REQUISE
          </span>
        )}
      </div>

      {requests.length === 0 ? (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "16px 20px" }}>
          <p style={{ margin: 0, color: "#15803d", fontSize: 14, fontWeight: 600 }}>✓ Toutes les demandes ont été traitées.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {requests.map((req) => (
            <div key={req.id} style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>
                    {req.business_name}
                  </span>
                  <span style={{
                    background: req.request_type === "plan" ? "#ede9fe" : "#f0fdf4",
                    color: req.request_type === "plan" ? "#5b21b6" : "#15803d",
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase",
                  }}>
                    {req.request_type === "plan" ? "upgrade plan" : "add-on"}
                  </span>
                </div>
                <p style={{ margin: "0 0 2px", fontSize: 13, color: "#4b5563" }}>{req.business_email}</p>
                {req.business_phone && (
                  <p style={{ margin: "0 0 6px", fontSize: 12, color: "#9ca3af" }}>{req.business_phone}</p>
                )}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ background: "#f3f4f6", color: "#6b7280", fontSize: 11, padding: "2px 8px", borderRadius: 20 }}>
                    Actuel : {PLAN_LABELS[req.current_plan] ?? req.current_plan}
                  </span>
                  <span style={{ background: "#ede9fe", color: "#4c1d95", fontWeight: 700, fontSize: 11, padding: "2px 8px", borderRadius: 20 }}>
                    → {itemLabel(req)}
                  </span>
                  <span style={{ color: "#9ca3af", fontSize: 11 }}>
                    {new Date(req.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {errors[req.id] && (
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "#dc2626" }}>⚠ {errors[req.id]}</p>
                )}
              </div>

              <button
                onClick={() => approve(req)}
                disabled={approving === req.id}
                style={{
                  background: approving === req.id ? "#a78bfa" : "#7c3aed",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 20px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: approving === req.id ? "not-allowed" : "pointer",
                  opacity: approving === req.id ? 0.7 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {approving === req.id ? "Approbation…" : "✓ Approuver"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
