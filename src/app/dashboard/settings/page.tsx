"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardNav from "@/components/DashboardNav";

export default function SettingsPage() {
  const [placeId, setPlaceId]   = useState("");
  const [saved, setSaved]       = useState(false);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [plan, setPlan]         = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("businesses")
        .select("google_place_id, plan")
        .eq("id", user.id)
        .single();
      if (data) {
        setPlaceId(data.google_place_id ?? "");
        setPlan(data.plan ?? null);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("businesses")
      .update({ google_place_id: placeId.trim() || null })
      .eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isPro = plan === "pro" || plan === "business";

  return (
    <div className="min-h-screen" style={{ background: "var(--dash-bg)" }}>
      <DashboardNav />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-black mb-1" style={{ color: "var(--dash-text)" }}>Paramètres</h1>
        <p className="text-sm mb-8" style={{ color: "var(--dash-muted)" }}>
          Configuration avancée de votre compte Stampify.
        </p>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">

            {/* Google Place ID */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-gray-900">
                  Google Place ID
                  {!isPro && (
                    <span className="ml-2 text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      Pro &amp; Business
                    </span>
                  )}
                </label>
                <a
                  href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Comment trouver mon Place ID →
                </a>
              </div>
              <input
                type="text"
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                disabled={!isPro}
                placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Quand un client atteint sa récompense, un SMS lui est envoyé avec un lien vers votre fiche Google pour laisser un avis.
              </p>
              {!isPro && (
                <p className="text-xs text-amber-600 mt-1.5 font-medium">
                  ⚡ Fonctionnalité réservée aux plans Pro et Business.
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving || !isPro}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
              {saved && (
                <span className="text-sm text-green-600 font-medium">✓ Sauvegardé</span>
              )}
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
