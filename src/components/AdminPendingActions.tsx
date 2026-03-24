"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PendingBusiness {
  id: string;
  business_name: string;
  email: string;
  plan: string | null;
  phone: string | null;
  activation_code: string | null;
  country: string | null;
  created_at: string;
}

export default function AdminPendingActions({
  pendingBusinesses,
}: {
  pendingBusinesses: PendingBusiness[];
}) {
  const router = useRouter();
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [loadingGen, setLoadingGen] = useState<string | null>(null);
  const [loadingAct, setLoadingAct] = useState<string | null>(null);

  const generateCode = async (businessId: string) => {
    setLoadingGen(businessId);
    try {
      const res = await fetch("/api/admin/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCodes((prev) => ({ ...prev, [businessId]: data.code }));
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoadingGen(null);
    }
  };

  const activateManually = async (businessId: string) => {
    if (!confirm("Activer ce commerçant manuellement ?")) return;
    setLoadingAct(businessId);
    try {
      const res = await fetch("/api/admin/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoadingAct(null);
    }
  };

  if (pendingBusinesses.length === 0) {
    return (
      <p style={{ color: "#9ca3af", fontSize: 13, padding: "16px 0" }}>
        Aucun commerçant en attente.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {pendingBusinesses.map((biz) => {
        const planLabel =
          biz.plan === "pro"
            ? "Pro"
            : biz.plan === "essential"
            ? "Essentiel"
            : "Non choisi";
        const generatedCode = codes[biz.id] ?? biz.activation_code;

        return (
          <div
            key={biz.id}
            style={{
              background: "#fff",
              border: "1px solid #fde68a",
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "#111827", fontSize: 14 }}>
                {biz.business_name}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
                {biz.email}
                {biz.phone && ` · ${biz.phone}`}
                {" · "}
                <span
                  style={{
                    background: "#f5f3ff",
                    color: "#6d28d9",
                    padding: "1px 8px",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 11,
                  }}
                >
                  {planLabel}
                </span>
              </p>
              {generatedCode && (
                <p style={{ margin: "6px 0 0", fontSize: 13 }}>
                  Code :{" "}
                  <span
                    style={{
                      background: "#fef3c7",
                      color: "#92400e",
                      fontWeight: 800,
                      fontSize: 18,
                      letterSpacing: "0.1em",
                      padding: "2px 10px",
                      borderRadius: 8,
                    }}
                  >
                    {generatedCode}
                  </span>
                  <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 8 }}>
                    (à envoyer par SMS/WhatsApp)
                  </span>
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => generateCode(biz.id)}
                disabled={loadingGen === biz.id}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: "#fef3c7",
                  color: "#92400e",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  opacity: loadingGen === biz.id ? 0.6 : 1,
                }}
              >
                {loadingGen === biz.id ? "…" : "🔑 Générer code"}
              </button>
              <button
                onClick={() => activateManually(biz.id)}
                disabled={loadingAct === biz.id}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: "#d1fae5",
                  color: "#065f46",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  opacity: loadingAct === biz.id ? 0.6 : 1,
                }}
              >
                {loadingAct === biz.id ? "…" : "✅ Activer manuellement"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
