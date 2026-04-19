"use client";

import { useState } from "react";

/**
 * Card affichée à la place du contenu SMS pour les comptes qui n'ont pas
 * le plan Pro. Permet de demander l'activation (upgrade_request) en 1 clic.
 */
export default function SMSLockCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/upgrade-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requested_plan: "pro",
          message: message.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError((body as { error?: string }).error ?? `Erreur ${res.status}`);
        return;
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="mx-auto max-w-xl p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">📱</div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-gray-900">
            Activez l&apos;envoi de SMS pour fidéliser vos clients
          </h2>
          <ul className="mt-5 space-y-2 text-left text-sm text-gray-700">
            <li>✓ Notifications de commande (acceptée, prête, etc.)</li>
            <li>✓ Messages marketing ciblés (campagnes, promotions)</li>
            <li>✓ Rappels automatiques de récompenses fidélité</li>
            <li>✓ Envoi depuis un sender personnalisé</li>
          </ul>
          <div className="mt-6 rounded-xl bg-indigo-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
              À partir de
            </div>
            <div className="mt-1 text-2xl font-black text-indigo-900">
              +29 CHF / mois
            </div>
            <div className="text-xs text-indigo-700">
              Sans engagement, résiliable à tout moment
            </div>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-6 w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700"
          >
            Demander l&apos;activation
          </button>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          onClick={() => !sending && setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
          >
            <header className="flex items-center justify-between border-b border-gray-100 p-5">
              <h3 className="text-lg font-bold">Demande d&apos;activation SMS</h3>
              {!sending && (
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="-mr-2 -mt-2 rounded-full p-2 text-gray-400 hover:bg-gray-50"
                >
                  ✕
                </button>
              )}
            </header>
            <div className="p-5">
              {sent ? (
                <div className="text-center">
                  <div className="text-4xl">✓</div>
                  <h4 className="mt-3 text-lg font-bold text-emerald-900">
                    Demande envoyée !
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    Vous recevrez une réponse sous <strong>24-48h</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="mt-5 w-full rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <>
                  <p className="mb-3 text-sm text-gray-600">
                    Envoyez un mot à notre équipe pour activer les SMS sur
                    votre compte. C&apos;est gratuit à tester.
                  </p>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Message (optionnel)
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ex. J'aimerais envoyer des campagnes SMS aux 50 clients de ma carte fidélité."
                    className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-gray-400"
                  />
                  {error && (
                    <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                      {error}
                    </div>
                  )}
                </>
              )}
            </div>
            {!sent && (
              <footer className="flex gap-2 border-t border-gray-100 p-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={sending}
                  className="flex-1 rounded-full px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={sending}
                  className="flex-1 rounded-full bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                >
                  {sending ? "Envoi…" : "Envoyer la demande"}
                </button>
              </footer>
            )}
          </div>
        </div>
      )}
    </>
  );
}
