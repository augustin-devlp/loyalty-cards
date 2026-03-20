"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardNav from "@/components/DashboardNav";

interface LoyaltyCard {
  id: string;
  card_name: string;
}

interface Promotion {
  id: string;
  card_id: string | null;
  title: string;
  description: string | null;
  multiplier: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

function getStatus(promo: Promotion): { label: string; color: string } {
  if (!promo.is_active) return { label: "Désactivée", color: "bg-gray-100 text-gray-500" };
  const now = new Date();
  const start = new Date(promo.start_date);
  const end = new Date(promo.end_date);
  if (now < start) return { label: "À venir", color: "bg-blue-100 text-blue-700" };
  if (now > end) return { label: "Expirée", color: "bg-red-100 text-red-600" };
  return { label: "Active", color: "bg-green-100 text-green-700" };
}

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function PromotionsPage() {
  const router = useRouter();
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formCardId, setFormCardId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formMultiplier, setFormMultiplier] = useState(2);
  const now = new Date();
  const defaultEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const [formStartDate, setFormStartDate] = useState(toLocalDatetimeString(now));
  const [formEndDate, setFormEndDate] = useState(toLocalDatetimeString(defaultEnd));
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: biz } = await supabase
        .from("businesses")
        .select("plan, subscription_status")
        .eq("id", user.id)
        .single();

      if (!biz || biz.plan !== "pro" || biz.subscription_status !== "active") {
        setIsPro(false);
        setLoading(false);
        return;
      }
      setIsPro(true);

      const [{ data: cardsData }, { data: promoData }] = await Promise.all([
        supabase.from("loyalty_cards").select("id, card_name").eq("is_active", true),
        supabase.from("promotions").select("*").order("created_at", { ascending: false }),
      ]);

      setCards(cardsData ?? []);
      setPromotions((promoData ?? []) as Promotion[]);
      setLoading(false);
    })();
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("promotions")
      .insert({
        business_id: user.id,
        card_id: formCardId || null,
        title: formTitle.trim(),
        description: formDescription.trim() || null,
        multiplier: formMultiplier,
        start_date: new Date(formStartDate).toISOString(),
        end_date: new Date(formEndDate).toISOString(),
      })
      .select()
      .single();

    if (error) {
      setFormError(error.message);
      setFormLoading(false);
      return;
    }

    setPromotions((prev) => [data as Promotion, ...prev]);
    setShowForm(false);
    setFormTitle("");
    setFormDescription("");
    setFormMultiplier(2);
    setFormCardId("");
    setFormLoading(false);
  };

  const handleToggle = async (promo: Promotion) => {
    const supabase = createClient();
    await supabase
      .from("promotions")
      .update({ is_active: !promo.is_active })
      .eq("id", promo.id);
    setPromotions((prev) =>
      prev.map((p) => (p.id === promo.id ? { ...p, is_active: !p.is_active } : p))
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette promotion ?")) return;
    const supabase = createClient();
    await supabase.from("promotions").delete().eq("id", id);
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--dash-bg)" }}>
        <DashboardNav />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--dash-accent)" }} />
        </div>
      </div>
    );
  }

  if (isPro === false) {
    return (
      <div className="min-h-screen" style={{ background: "var(--dash-bg)" }}>
        <DashboardNav />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--dash-text)" }}>
            Fonctionnalité Pro
          </h1>
          <p className="mb-6" style={{ color: "var(--dash-muted)" }}>
            Les promotions temporaires sont réservées aux abonnés Pro. Passez à Pro pour créer des opérations à tampons multipliés.
          </p>
          <a
            href="/dashboard/billing"
            className="inline-block px-6 py-3 rounded-xl font-semibold text-white text-sm"
            style={{ background: "var(--dash-accent)" }}
          >
            Passer à Pro
          </a>
        </main>
      </div>
    );
  }

  const cardName = (id: string | null) =>
    id ? (cards.find((c) => c.id === id)?.card_name ?? "Carte inconnue") : "Toutes les cartes";

  return (
    <div className="min-h-screen" style={{ background: "var(--dash-bg)" }}>
      <DashboardNav />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--dash-text)" }}>
              Promotions temporaires
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--dash-muted)" }}>
              Multipliez les tampons pendant des périodes définies.
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2 rounded-xl font-semibold text-sm text-white"
            style={{ background: "var(--dash-accent)" }}
          >
            {showForm ? "Annuler" : "+ Nouvelle promo"}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div
            className="rounded-2xl border p-6 space-y-4"
            style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
          >
            <h2 className="font-bold text-lg" style={{ color: "var(--dash-text)" }}>
              Créer une promotion
            </h2>
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {formError}
              </div>
            )}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--dash-text)" }}>
                  Carte concernée
                </label>
                <select
                  value={formCardId}
                  onChange={(e) => setFormCardId(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--dash-border)", background: "var(--dash-bg)", color: "var(--dash-text)" }}
                >
                  <option value="">Toutes les cartes</option>
                  {cards.map((c) => (
                    <option key={c.id} value={c.id}>{c.card_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--dash-text)" }}>
                  Titre *
                </label>
                <input
                  required
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex : Double tampons week-end"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--dash-border)", background: "var(--dash-bg)", color: "var(--dash-text)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--dash-text)" }}>
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Détails de la promotion…"
                  rows={2}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none"
                  style={{ borderColor: "var(--dash-border)", background: "var(--dash-bg)", color: "var(--dash-text)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--dash-text)" }}>
                  Multiplicateur
                </label>
                <select
                  value={formMultiplier}
                  onChange={(e) => setFormMultiplier(Number(e.target.value))}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--dash-border)", background: "var(--dash-bg)", color: "var(--dash-text)" }}
                >
                  {[2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>x{n}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--dash-text)" }}>
                    Début *
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--dash-border)", background: "var(--dash-bg)", color: "var(--dash-text)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--dash-text)" }}>
                    Fin *
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--dash-border)", background: "var(--dash-bg)", color: "var(--dash-text)" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-60"
                style={{ background: "var(--dash-accent)" }}
              >
                {formLoading ? "Création…" : "Créer la promotion"}
              </button>
            </form>
          </div>
        )}

        {/* List */}
        {promotions.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed p-12 text-center"
            style={{ borderColor: "var(--dash-border)" }}
          >
            <p className="text-sm" style={{ color: "var(--dash-muted)" }}>
              Aucune promotion pour l'instant. Créez-en une pour booster votre programme !
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {promotions.map((promo) => {
              const status = getStatus(promo);
              return (
                <div
                  key={promo.id}
                  className="rounded-2xl border p-5 flex items-start gap-4"
                  style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
                >
                  {/* Multiplier badge */}
                  <div
                    className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white"
                    style={{ background: "var(--dash-accent)" }}
                  >
                    x{promo.multiplier}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm" style={{ color: "var(--dash-text)" }}>
                        {promo.title}
                      </p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    {promo.description && (
                      <p className="text-xs mt-0.5" style={{ color: "var(--dash-muted)" }}>
                        {promo.description}
                      </p>
                    )}
                    <p className="text-xs mt-1" style={{ color: "var(--dash-muted)" }}>
                      {cardName(promo.card_id)} ·{" "}
                      {new Date(promo.start_date).toLocaleDateString("fr-FR")} →{" "}
                      {new Date(promo.end_date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex gap-2">
                    <button
                      onClick={() => handleToggle(promo)}
                      className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors"
                      style={{
                        borderColor: "var(--dash-border)",
                        color: "var(--dash-muted)",
                        background: "var(--dash-bg)",
                      }}
                    >
                      {promo.is_active ? "Désactiver" : "Activer"}
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="text-xs px-3 py-1.5 rounded-lg border font-medium text-red-500 border-red-200 transition-colors hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
