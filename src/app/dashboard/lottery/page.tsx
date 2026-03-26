"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import { createClient } from "@/lib/supabase/client";

interface Lottery {
  id: string;
  business_id: string;
  title: string;
  reward_description: string;
  is_active: boolean;
  draw_date: string | null;
  created_at: string;
  require_google_review: boolean;
  participant_count?: number;
}

interface Participant {
  id: string;
  first_name: string;
  phone: string;
  created_at: string;
}

export default function LotteryPage() {
  const router = useRouter();
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [businessId, setBusinessId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [openParticipants, setOpenParticipants] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  // New lottery form
  const [form, setForm] = useState({ title: "", reward: "", drawDate: "", requireGoogleReview: false });
  const [formOpen, setFormOpen] = useState(false);
  const [formErr, setFormErr] = useState<string | null>(null);

  const loadLotteries = useCallback(async (uid: string) => {
    const sb = createClient();
    const { data } = await sb
      .from("lotteries")
      .select("id, business_id, title, reward_description, is_active, draw_date, created_at, require_google_review")
      .eq("business_id", uid)
      .order("created_at", { ascending: false });

    if (!data) { setLotteries([]); return; }

    // Count participants per lottery
    const enriched = await Promise.all(
      data.map(async (lot) => {
        const { count } = await sb
          .from("lottery_participants")
          .select("id", { count: "exact", head: true })
          .eq("lottery_id", lot.id);
        return { ...lot, participant_count: count ?? 0 };
      })
    );
    setLotteries(enriched as Lottery[]);
  }, []);

  useEffect(() => {
    const sb = createClient();
    sb.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setBusinessId(user.id);
      await loadLotteries(user.id);
      setLoading(false);
    });
  }, [router, loadLotteries]);

  const createLottery = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr(null);
    if (!form.title.trim() || !form.reward.trim()) {
      setFormErr("Le nom et la récompense sont obligatoires.");
      return;
    }
    setCreating(true);
    const sb = createClient();
    await sb.from("lotteries").insert({
      business_id: businessId,
      title: form.title.trim(),
      reward_description: form.reward.trim(),
      draw_date: form.drawDate || null,
      is_active: true,
      require_google_review: form.requireGoogleReview,
    });
    setForm({ title: "", reward: "", drawDate: "", requireGoogleReview: false });
    setFormOpen(false);
    setCreating(false);
    await loadLotteries(businessId);
  };

  const toggleActive = async (lot: Lottery) => {
    const sb = createClient();
    await sb.from("lotteries").update({ is_active: !lot.is_active }).eq("id", lot.id);
    setLotteries(prev => prev.map(l => l.id === lot.id ? { ...l, is_active: !l.is_active } : l));
  };

  const toggleGoogleReview = async (lot: Lottery) => {
    const sb = createClient();
    await sb.from("lotteries").update({ require_google_review: !lot.require_google_review }).eq("id", lot.id);
    setLotteries(prev => prev.map(l => l.id === lot.id ? { ...l, require_google_review: !l.require_google_review } : l));
  };

  const deleteLottery = async (id: string) => {
    if (!confirm("Supprimer cette loterie et tous ses participants ?")) return;
    const sb = createClient();
    await sb.from("lotteries").delete().eq("id", id);
    setLotteries(prev => prev.filter(l => l.id !== id));
  };

  const viewParticipants = async (lotteryId: string) => {
    if (openParticipants === lotteryId) { setOpenParticipants(null); return; }
    setOpenParticipants(lotteryId);
    setLoadingParticipants(true);
    const sb = createClient();
    const { data } = await sb
      .from("lottery_participants")
      .select("id, first_name, phone, created_at")
      .eq("lottery_id", lotteryId)
      .order("created_at", { ascending: false });
    setParticipants((data ?? []) as Participant[]);
    setLoadingParticipants(false);
  };

  const copyLink = (lotteryId: string) => {
    navigator.clipboard.writeText(`https://stampify.ch/lottery/${lotteryId}`);
    setCopied(lotteryId);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) return (
    <div className="min-h-screen"><DashboardNav />
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#534AB7] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🎁 Loterie</h1>
            <p className="text-sm text-gray-500 mt-0.5">Créez des loteries pour engager vos clients.</p>
          </div>
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="bg-[#534AB7] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-md"
          >
            {formOpen ? "✕ Annuler" : "+ Créer une loterie"}
          </button>
        </div>

        {/* Create form */}
        {formOpen && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">Nouvelle loterie</h2>
            <form onSubmit={createLottery} className="space-y-4">
              {formErr && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{formErr}</p>}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Nom de la loterie *</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex : Tirage de printemps"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Récompense à gagner *</label>
                <input type="text" required value={form.reward} onChange={e => setForm({ ...form, reward: e.target.value })}
                  placeholder="Ex : Bon d'achat 50€"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Date du tirage (optionnel)</label>
                <input type="date" value={form.drawDate} onChange={e => setForm({ ...form, drawDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50" />
              </div>

              {/* Google Review toggle in create form */}
              <div className="flex items-center justify-between gap-4 bg-gray-50 rounded-xl px-4 py-3.5">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Exiger un avis Google</p>
                  <p className="text-xs text-gray-400 mt-0.5">Le client laisse un avis avant de participer</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, requireGoogleReview: !form.requireGoogleReview })}
                  className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${form.requireGoogleReview ? "bg-[#534AB7]" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.requireGoogleReview ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                </button>
              </div>

              <button type="submit" disabled={creating}
                className="w-full py-3 bg-[#534AB7] text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors">
                {creating ? "Création…" : "Créer la loterie"}
              </button>
            </form>
          </div>
        )}

        {/* Lotteries list */}
        {lotteries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <div className="text-4xl mb-3">🎁</div>
            <p className="text-gray-500 text-sm">Aucune loterie pour l&apos;instant.</p>
            <p className="text-gray-400 text-xs mt-1">Créez votre première loterie pour engager vos clients.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lotteries.map(lot => (
              <div key={lot.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-bold text-gray-900">{lot.title}</h2>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${lot.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {lot.is_active ? "● Active" : "○ Inactive"}
                        </span>
                        {lot.require_google_review && (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                            ⭐ Avis requis
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">🎁 {lot.reward_description}</p>
                      {lot.draw_date && (
                        <p className="text-xs text-gray-400 mt-1">
                          Tirage : {new Date(lot.draw_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                        {lot.participant_count} participant{(lot.participant_count ?? 0) > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => viewParticipants(lot.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors">
                      {openParticipants === lot.id ? "▲ Masquer" : "▼ Voir participants"}
                    </button>
                    <button onClick={() => copyLink(lot.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors">
                      {copied === lot.id ? "✓ Copié !" : "🔗 Copier lien"}
                    </button>
                    <a href={`/lottery/${lot.id}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors">
                      Aperçu →
                    </a>
                    <button onClick={() => toggleActive(lot)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${lot.is_active ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
                      {lot.is_active ? "Désactiver" : "Activer"}
                    </button>
                    <button onClick={() => toggleGoogleReview(lot)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${lot.require_google_review ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                      {lot.require_google_review ? "⭐ Désactiver avis" : "⭐ Exiger avis Google"}
                    </button>
                    <button onClick={() => deleteLottery(lot.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors">
                      Supprimer
                    </button>
                  </div>
                </div>

                {/* Participants panel */}
                {openParticipants === lot.id && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-3">Participants</p>
                    {loadingParticipants ? (
                      <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-3 border-[#534AB7] border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : participants.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">Aucun participant pour l&apos;instant.</p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {participants.map(p => (
                          <div key={p.id} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border border-gray-100">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                              {p.first_name[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800">{p.first_name}</p>
                              <p className="text-xs text-gray-400">{p.phone}</p>
                            </div>
                            <p className="text-xs text-gray-400 shrink-0">
                              {new Date(p.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
