"use client";

import { useState, useEffect } from "react";

const SECRET = "0808";
const SESSION_KEY = "admin_unlocked";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SESSION_KEY) === "true");
  }, []);

  if (unlocked === null) return null; // hydration guard

  if (unlocked) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === SECRET) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setUnlocked(true);
    } else {
      setError(true);
      setInput("");
    }
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
            }}
          />
          {error && (
            <p style={{ margin: "0 0 12px", color: "#ef4444", fontSize: 13, fontWeight: 600 }}>
              Code incorrect
            </p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#534AB7",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Accéder
          </button>
        </form>
      </div>
    </div>
  );
}
