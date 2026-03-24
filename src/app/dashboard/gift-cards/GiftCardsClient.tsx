"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  is_used: boolean;
  created_at: string;
  used_at: string | null;
  customer_email?: string | null;
}

export default function GiftCardsClient({ initialCards }: { initialCards: GiftCard[] }) {
  const [cards, setCards] = useState<GiftCard[]>(initialCards);
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newCard, setNewCard] = useState<GiftCard | null>(null);
  const router = useRouter();

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/gift-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), customer_email: email || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Erreur ${res.status}`);
      setCards([data, ...cards]);
      setNewCard(data);
      setAmount("");
      setEmail("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 mb-1">Cartes cadeaux</h1>
        <p className="text-gray-500 text-sm">Générez des codes à offrir à vos clients ou à vendre en caisse.</p>
      </div>

      {/* Création */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">Générer une carte cadeau</h2>
        <form onSubmit={create} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Montant (€)</label>
              <input
                type="number"
                min={1}
                max={10000}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex : 20"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email du destinataire (optionnel)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="destinataire@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            {loading ? "Génération…" : "Créer et envoyer"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {/* Nouvelle carte générée */}
      {newCard && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Carte générée ✓</p>
          <div className="flex items-center gap-4">
            <div className="font-black text-3xl tracking-widest text-indigo-700">{newCard.code}</div>
            <div className="text-gray-600 text-sm">
              <p className="font-semibold">{newCard.amount}€</p>
              <p className="text-gray-400">Lien : <a href={`/gift/${newCard.code}`} target="_blank" rel="noreferrer" className="text-indigo-600 underline">/gift/{newCard.code}</a></p>
            </div>
          </div>
          <button
            onClick={() => setNewCard(null)}
            className="mt-3 text-xs text-indigo-400 hover:text-indigo-600"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Liste */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">Toutes les cartes ({cards.length})</h2>
        {cards.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm border border-dashed border-gray-200 rounded-2xl">
            Aucune carte cadeau pour l&apos;instant.
          </div>
        ) : (
          <div className="space-y-3">
            {cards.map((c) => (
              <div
                key={c.id}
                className={`flex items-center justify-between bg-white border rounded-2xl px-5 py-4 shadow-sm ${c.is_used ? "opacity-50" : "border-gray-200"}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-mono font-black text-lg tracking-widest text-gray-900">{c.code}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.is_used ? "bg-gray-100 text-gray-400" : "bg-green-100 text-green-700"}`}>
                      {c.is_used ? "Utilisée" : "Disponible"}
                    </span>
                  </div>
                  {c.customer_email && (
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold">Email :</span> {c.customer_email}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-black text-indigo-600">{c.amount}€</p>
                  <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
