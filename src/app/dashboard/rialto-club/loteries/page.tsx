"use client";

/**
 * /dashboard/rialto-club/loteries — UI Mehmet pour créer et tirer
 * des loteries. Pas de DashboardNav ici pour rester léger (accès via
 * lien direct), mais intégré dans l'univers Stampify.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";

type Lottery = {
  id: string;
  title: string;
  prize_description: string | null;
  reward_description: string | null;
  is_active: boolean;
  draw_date: string | null;
  start_date: string;
  end_date: string | null;
  created_at: string;
  entries_count: number;
};

export default function LotteriesAdminPage() {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [prize, setPrize] = useState("");
  const [drawDate, setDrawDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [drawingId, setDrawingId] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/lotteries", { cache: "no-store" });
      if (res.ok) {
        const body = (await res.json()) as { lotteries?: Lottery[] };
        setLotteries(body.lotteries ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/lotteries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          prize_description: prize.trim(),
          draw_date: drawDate,
        }),
      });
      const body = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        setMessage(`❌ ${body.error ?? "Erreur"}`);
      } else {
        setMessage(`✓ ${body.message ?? "Loterie créée"}`);
        setTitle("");
        setPrize("");
        setDrawDate("");
        setShowCreate(false);
        await refresh();
      }
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  }

  async function handleDraw(id: string) {
    if (!confirm("Tirer au sort maintenant ? SMS envoyés à tous les membres.")) {
      return;
    }
    setDrawingId(id);
    try {
      const res = await fetch(`/api/admin/lotteries/${id}/draw`, {
        method: "POST",
      });
      const body = (await res.json()) as {
        error?: string;
        winner?: { ticket_number: number; first_name: string; claim_token: string };
        total_entries?: number;
      };
      if (!res.ok || !body.winner) {
        setMessage(`❌ ${body.error ?? "Tirage échoué"}`);
      } else {
        setMessage(
          `🎉 Gagnant : n°${String(body.winner.ticket_number).padStart(4, "0")} (${body.winner.first_name}) · Token ${body.winner.claim_token} · SMS envoyés aux ${body.total_entries} participants`,
        );
        await refresh();
      }
    } finally {
      setDrawingId(null);
      setTimeout(() => setMessage(null), 10000);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">Rialto Club</p>
            <h1 className="text-2xl font-bold text-gray-900">Loteries</h1>
            <p className="mt-1 text-sm text-gray-500">
              Créer, suivre et tirer au sort les loteries du mois. Les membres
              Club sont alertés par SMS à chaque création et tirage.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(!showCreate)}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            {showCreate ? "Annuler" : "+ Nouvelle loterie"}
          </button>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-900">
            {message}
          </div>
        )}

        {showCreate && (
          <form
            onSubmit={handleCreate}
            className="mb-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="font-bold text-gray-900">Nouvelle loterie</h2>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Nom de la loterie <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Loterie de Mai"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Lot à gagner <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
                placeholder="Ex: Pizza Bethusy + 2 bières"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Date du tirage <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={drawDate}
                onChange={(e) => setDrawDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
              ⚠ À la création, un SMS est automatiquement envoyé à tous les
              membres du Rialto Club avec le lien de la loterie. Vérifie bien
              les infos avant de confirmer.
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Création en cours…" : "Créer et notifier les membres"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : lotteries.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Aucune loterie pour le moment. Clique sur &quot;+ Nouvelle
            loterie&quot; pour commencer.
          </div>
        ) : (
          <ul className="space-y-3">
            {lotteries.map((l) => {
              const status = l.is_active
                ? l.entries_count > 0
                  ? "active"
                  : "waiting"
                : "drawn";
              return (
                <li
                  key={l.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{l.title}</h3>
                        <StatusBadge status={status} />
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        🎁 {l.prize_description ?? l.reward_description}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Tirage prévu :{" "}
                        {l.draw_date
                          ? new Date(l.draw_date).toLocaleDateString("fr-CH", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "—"}
                        {" · "}
                        {l.entries_count} participant
                        {l.entries_count > 1 ? "s" : ""}
                      </p>
                    </div>
                    {l.is_active && l.entries_count > 0 && (
                      <button
                        type="button"
                        onClick={() => handleDraw(l.id)}
                        disabled={drawingId === l.id}
                        className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                      >
                        {drawingId === l.id ? "Tirage…" : "🎰 Tirer au sort"}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-8 border-t border-gray-200 pt-6">
          <Link
            href="/dashboard/spin-wheel"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            → Configurer la roue de la chance
          </Link>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: "active" | "waiting" | "drawn" }) {
  const map = {
    active: { label: "Active", color: "bg-emerald-100 text-emerald-700" },
    waiting: { label: "En attente", color: "bg-amber-100 text-amber-800" },
    drawn: { label: "Tirée", color: "bg-gray-100 text-gray-600" },
  };
  const { label, color } = map[status];
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${color}`}
    >
      {label}
    </span>
  );
}
