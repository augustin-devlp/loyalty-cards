"use client";

import { useState } from "react";

type Props = {
  orderNumber: string;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
};

const QUICK_REASONS = [
  "Nous sommes fermés exceptionnellement",
  "Plat indisponible",
  "Délai de préparation impossible",
  "Erreur dans la commande, merci d'appeler",
];

export default function RefuseOrderModal({
  orderNumber,
  onClose,
  onConfirm,
}: Props) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm(reason.trim());
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
      >
        <header className="flex items-start justify-between border-b border-gray-100 p-5">
          <div>
            <h3 className="text-lg font-bold">Refuser la commande</h3>
            <p className="mt-0.5 text-xs text-gray-500">
              N° {orderNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 -mt-2 rounded-full p-2 text-gray-400 hover:bg-gray-50"
          >
            ✕
          </button>
        </header>

        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Motif (envoyé au client par SMS)
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex : Nous sommes fermés exceptionnellement."
              className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Motifs rapides
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <footer className="flex gap-2 border-t border-gray-100 p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleConfirm}
            className="flex-1 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {busy ? "…" : "Confirmer le refus"}
          </button>
        </footer>
      </div>
    </div>
  );
}
