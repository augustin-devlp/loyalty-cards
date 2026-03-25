"use client";

import { useState } from "react";

interface Props {
  cardId: string;
  cardName: string;
  businessName: string;
}

export default function SmsSendModal({ cardId, cardName, businessName }: Props) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    `Bonjour ! Voici votre carte de fidélité ${businessName} : ${
      typeof window !== "undefined" ? window.location.origin : "https://www.stampify.ch"
    }/join/${cardId}. Présentez ce QR code à chaque visite pour cumuler vos tampons 🎁`
  );
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<"ok" | "error" | null>(null);

  const joinUrl = `${typeof window !== "undefined" ? window.location.origin : "https://www.stampify.ch"}/join/${cardId}`;

  const openModal = () => {
    setMessage(
      `Bonjour ! Voici votre carte de fidélité ${businessName} : ${joinUrl}. Présentez ce QR code à chaque visite pour cumuler vos tampons 🎁`
    );
    setPhone("");
    setResult(null);
    setOpen(true);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/sms/send-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, message }),
      });
      setResult(res.ok ? "ok" : "error");
    } catch {
      setResult("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all bg-white border-gray-200 text-gray-700 hover:border-violet-400 hover:text-violet-700"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Envoyer par SMS
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Envoyer la carte par SMS</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">×</button>
            </div>

            {result === "ok" ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-semibold text-gray-900">SMS envoyé avec succès !</p>
                <button onClick={() => setOpen(false)} className="mt-5 w-full bg-violet-600 text-white font-semibold py-2.5 rounded-xl">
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={send} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="font-normal text-gray-400">(modifiable)</span>
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">{message.length} caractères</p>
                </div>

                {result === "error" && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">Erreur lors de l&apos;envoi. Vérifiez le numéro.</p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold"
                  >
                    {sending ? "Envoi…" : "Envoyer"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
