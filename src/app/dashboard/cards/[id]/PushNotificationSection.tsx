"use client";

import { useState } from "react";

interface Props {
  cardId: string;
}

export default function PushNotificationSection({ cardId }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent?: number; total?: number; message?: string } | null>(null);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_id: cardId, title: title.trim(), body: body.trim(), url: url.trim() || undefined }),
      });
      const data = await res.json() as { sent?: number; total?: number; message?: string };
      setResult(data);
    } catch {
      setResult({ message: "Erreur lors de l'envoi." });
    } finally {
      setSending(false);
    }
  };

  const vapidEnabled = !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!vapidEnabled) return null;

  return (
    <div className="rounded-2xl border p-8 shadow-sm" style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
          🔔 Notifications push
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--dash-muted)" }}>
          Envoyez une notification à tous les clients abonnés à cette carte.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: "var(--dash-muted)" }}>Titre *</label>
          <input
            type="text"
            placeholder="Ex: Offre spéciale ce weekend !"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
          />
        </div>

        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: "var(--dash-muted)" }}>Message *</label>
          <textarea
            placeholder="Ex: Profitez de -20% sur tous nos produits ce samedi..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            maxLength={200}
            className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
          />
        </div>

        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: "var(--dash-muted)" }}>URL de destination (optionnel)</label>
          <input
            type="url"
            placeholder="Ex: https://stampify.ch/card/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={sending || !title.trim() || !body.trim()}
          className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          style={{ background: "var(--dash-accent)" }}
        >
          {sending ? "Envoi en cours…" : "Envoyer la notification"}
        </button>

        {result && (
          <div className={`rounded-xl p-3 text-sm ${result.sent !== undefined && result.sent > 0 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
            {result.message
              ? result.message
              : `✅ Envoyé à ${result.sent} / ${result.total} abonné(s).`
            }
          </div>
        )}
      </div>
    </div>
  );
}
