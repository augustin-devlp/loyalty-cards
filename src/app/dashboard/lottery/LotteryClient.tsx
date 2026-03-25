"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LotteryEntry {
  id: string;
  first_name: string;
  phone: string;
  email: string | null;
  google_review_verified: boolean;
  is_winner: boolean;
  created_at: string;
}

interface Lottery {
  id: string;
  title: string;
  reward_description: string;
  is_active: boolean;
  is_permanent: boolean;
  start_date: string | null;
  end_date: string | null;
  max_winners: number;
  draw_date: string | null;
  created_at: string;
  lottery_entries: { count: number }[];
}

interface DrawWinner {
  first_name: string;
  phone: string;
}

const ACCENT = "#534AB7";

export default function LotteryClient() {
  const router = useRouter();

  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create form
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formReward, setFormReward] = useState("");
  const [formMaxWinners, setFormMaxWinners] = useState(1);
  const [formIsPermanent, setFormIsPermanent] = useState(false);
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Participants panel
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [entriesMap, setEntriesMap] = useState<Record<string, LotteryEntry[]>>({});
  const [entriesLoading, setEntriesLoading] = useState<string | null>(null);

  // Draw results
  const [drawResults, setDrawResults] = useState<Record<string, DrawWinner[]>>({});
  const [drawLoading, setDrawLoading] = useState<string | null>(null);
  const [drawError, setDrawError] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchLotteries();
  }, []);

  const fetchLotteries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/lottery");
      if (!res.ok) {
        if (res.status === 401) { router.push("/login"); return; }
        throw new Error("Erreur lors du chargement des loteries");
      }
      const data = await res.json();
      setLotteries(data.lotteries ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      const res = await fetch("/api/lottery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          reward_description: formReward,
          max_winners: formMaxWinners,
          is_permanent: formIsPermanent,
          start_date: formIsPermanent ? null : (formStartDate || null),
          end_date: formIsPermanent ? null : (formEndDate || null),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de la création");

      setLotteries((prev) => [{ ...data.lottery, lottery_entries: [] }, ...prev]);
      setShowForm(false);
      setFormTitle("");
      setFormReward("");
      setFormMaxWinners(1);
      setFormIsPermanent(false);
      setFormStartDate("");
      setFormEndDate("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleActive = async (lottery: Lottery) => {
    const res = await fetch("/api/lottery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lottery.id, is_active: !lottery.is_active }),
    });
    if (res.ok) {
      setLotteries((prev) =>
        prev.map((l) => (l.id === lottery.id ? { ...l, is_active: !l.is_active } : l))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette loterie et tous ses participants ?")) return;
    const res = await fetch(`/api/lottery?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setLotteries((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const handleToggleParticipants = async (lotteryId: string) => {
    if (expandedId === lotteryId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(lotteryId);

    if (entriesMap[lotteryId]) return; // already loaded

    setEntriesLoading(lotteryId);
    try {
      // Use the same /api/lottery route but fetch entries directly via client-side supabase
      // We fetch from a dedicated entries sub-path using query param
      const res = await fetch(`/api/lottery?entries=true&lotteryId=${lotteryId}`);
      if (res.ok) {
        const data = await res.json();
        setEntriesMap((prev) => ({ ...prev, [lotteryId]: data.entries ?? [] }));
      }
    } finally {
      setEntriesLoading(null);
    }
  };

  const handleDraw = async (lottery: Lottery) => {
    if (
      !confirm(
        `Lancer le tirage au sort pour "${lottery.title}" ? Cette action est irréversible.`
      )
    )
      return;

    setDrawLoading(lottery.id);
    setDrawError((prev) => ({ ...prev, [lottery.id]: "" }));

    try {
      const res = await fetch("/api/lottery/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lotteryId: lottery.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors du tirage");
      setDrawResults((prev) => ({ ...prev, [lottery.id]: data.winners }));
    } catch (err) {
      setDrawError((prev) => ({
        ...prev,
        [lottery.id]: err instanceof Error ? err.message : "Erreur inconnue",
      }));
    } finally {
      setDrawLoading(null);
    }
  };

  const entryCount = (lottery: Lottery) => {
    const arr = lottery.lottery_entries;
    if (!arr || arr.length === 0) return 0;
    return arr[0]?.count ?? 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: ACCENT }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-700 font-medium">{error}</p>
        <button
          onClick={fetchLotteries}
          className="mt-3 text-red-600 hover:text-red-700 font-medium text-sm"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loteries</h1>
          <p className="text-sm mt-1 text-gray-500">
            Organisez des tirages au sort et récompensez vos clients.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
          style={{ background: ACCENT }}
        >
          {showForm ? "Annuler" : "+ Nouvelle loterie"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-lg text-gray-900">Créer une loterie</h2>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {formError}
            </div>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Titre *
              </label>
              <input
                required
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex : Grande loterie de printemps"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#534AB7]/30 bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Récompense à gagner *
              </label>
              <input
                required
                type="text"
                value={formReward}
                onChange={(e) => setFormReward(e.target.value)}
                placeholder="Ex : Un bon d'achat de 100€"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#534AB7]/30 bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Nombre de gagnants *
              </label>
              <input
                required
                type="number"
                min={1}
                value={formMaxWinners}
                onChange={(e) => setFormMaxWinners(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#534AB7]/30 bg-white text-gray-900"
              />
            </div>

            {/* Permanent toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormIsPermanent((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formIsPermanent ? "bg-[#534AB7]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    formIsPermanent ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700">
                Loterie permanente (sans dates de début/fin)
              </span>
            </div>

            {/* Dates – shown only if not permanent */}
            {!formIsPermanent && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#534AB7]/30 bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#534AB7]/30 bg-white text-gray-900"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-60 transition-opacity hover:opacity-90"
              style={{ background: ACCENT }}
            >
              {formLoading ? "Création…" : "Créer la loterie"}
            </button>
          </form>
        </div>
      )}

      {/* Lottery list */}
      {lotteries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-400 text-sm">
            Aucune loterie pour l'instant. Créez-en une pour commencer !
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {lotteries.map((lottery) => (
            <div
              key={lottery.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Lottery header row */}
              <div className="p-5 flex items-start gap-4">
                {/* Icon */}
                <div
                  className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white font-black"
                  style={{ background: ACCENT }}
                >
                  🎰
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-gray-900">{lottery.title}</p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        lottery.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {lottery.is_active ? "Active" : "Inactive"}
                    </span>
                    {lottery.is_permanent && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        Permanente
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{lottery.reward_description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {entryCount(lottery)} participant{entryCount(lottery) !== 1 ? "s" : ""} ·{" "}
                    {lottery.max_winners} gagnant{lottery.max_winners !== 1 ? "s" : ""} max
                    {!lottery.is_permanent && lottery.start_date && (
                      <>
                        {" · "}
                        {new Date(lottery.start_date).toLocaleDateString("fr-FR")}
                        {lottery.end_date &&
                          ` → ${new Date(lottery.end_date).toLocaleDateString("fr-FR")}`}
                      </>
                    )}
                  </p>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => handleToggleParticipants(lottery.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors"
                  >
                    {expandedId === lottery.id ? "Masquer" : "Voir les participants"}
                  </button>
                  <button
                    onClick={() => handleDraw(lottery)}
                    disabled={drawLoading === lottery.id}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white disabled:opacity-60 transition-opacity hover:opacity-90"
                    style={{ background: ACCENT }}
                  >
                    {drawLoading === lottery.id ? "Tirage…" : "Lancer le tirage"}
                  </button>
                  <button
                    onClick={() => handleToggleActive(lottery)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors"
                  >
                    {lottery.is_active ? "Désactiver" : "Activer"}
                  </button>
                  <button
                    onClick={() => handleDelete(lottery.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-200 font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              {/* Draw error */}
              {drawError[lottery.id] && (
                <div className="px-5 pb-3">
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    {drawError[lottery.id]}
                  </p>
                </div>
              )}

              {/* Draw results */}
              {drawResults[lottery.id] && drawResults[lottery.id].length > 0 && (
                <div className="px-5 pb-5">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-yellow-800 mb-3">
                      Gagnants du tirage
                    </p>
                    <ul className="space-y-2">
                      {drawResults[lottery.id].map((w, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-yellow-900">
                          <span className="text-base">🏆</span>
                          <span className="font-semibold">{w.first_name}</span>
                          <span className="text-yellow-700">— {w.phone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Participants list */}
              {expandedId === lottery.id && (
                <div className="border-t border-gray-100 px-5 py-4">
                  {entriesLoading === lottery.id ? (
                    <div className="flex items-center justify-center py-6">
                      <div
                        className="w-6 h-6 border-4 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: ACCENT }}
                      />
                    </div>
                  ) : !entriesMap[lottery.id] || entriesMap[lottery.id].length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Aucun participant pour l'instant.
                    </p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                          <th className="pb-2 font-medium">Prénom</th>
                          <th className="pb-2 font-medium">Téléphone</th>
                          <th className="pb-2 font-medium">Email</th>
                          <th className="pb-2 font-medium">Avis Google</th>
                          <th className="pb-2 font-medium">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entriesMap[lottery.id].map((entry) => (
                          <tr key={entry.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-2 font-medium text-gray-900">{entry.first_name}</td>
                            <td className="py-2 text-gray-600">{entry.phone}</td>
                            <td className="py-2 text-gray-500">{entry.email ?? "—"}</td>
                            <td className="py-2">
                              {entry.google_review_verified ? (
                                <span className="text-green-600 font-semibold" title="Vérifié">
                                  ✓
                                </span>
                              ) : (
                                <span className="text-gray-400" title="En attente">
                                  ⏳
                                </span>
                              )}
                            </td>
                            <td className="py-2">
                              {entry.is_winner ? (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                                  Gagnant
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">Participant</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
