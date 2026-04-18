"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardNav from "@/components/DashboardNav";

export default function SettingsPage() {
  const [placeId, setPlaceId]           = useState("");
  const [saved, setSaved]               = useState(false);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [plan, setPlan]                 = useState<string | null>(null);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleMsg, setGoogleMsg]       = useState<"connected" | "error" | null>(null);

  useEffect(() => {
    // Handle OAuth callback result via URL param
    const params = new URLSearchParams(window.location.search);
    const g = params.get("google");
    if (g === "connected") setGoogleMsg("connected");
    else if (g === "error")  setGoogleMsg("error");
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("businesses")
        .select("google_place_id, plan, google_refresh_token")
        .eq("id", user.id)
        .single();
      if (data) {
        setPlaceId(data.google_place_id ?? "");
        setPlan(data.plan ?? null);
        setGoogleConnected(!!data.google_refresh_token);
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

            {/* ── Google Business OAuth ───────────────────────────── */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-gray-900">
                  Google Business Profile
                  {!isPro && (
                    <span className="ml-2 text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      Pro &amp; Business
                    </span>
                  )}
                </label>
                {googleConnected && (
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                    ✓ Connecté
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Connectez votre compte Google Business pour activer la vérification automatique des avis
                sur la roue de la fortune et la loterie.
              </p>

              {/* Status messages */}
              {googleMsg === "connected" && (
                <div className="mb-3 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-sm text-green-700 font-medium">
                  ✅ Google Business connecté avec succès !
                </div>
              )}
              {googleMsg === "error" && (
                <div className="mb-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-600 font-medium">
                  ⚠ La connexion a échoué. Réessayez ou vérifiez vos permissions Google.
                </div>
              )}

              {isPro ? (
                <a
                  href="/api/auth/google/connect"
                  className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.3 6.4 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" fill="#FFC107"/>
                    <path d="M6.3 14.7l6.6 4.8C14.6 16.3 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.3 6.4 29.4 4 24 4c-7.8 0-14.5 4.4-17.7 10.7z" fill="#FF3D00"/>
                    <path d="M24 44c5.2 0 10-1.9 13.7-5l-6.3-5.3C29.4 35.5 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-7.9L6 33.3C9.2 39.7 16 44 24 44z" fill="#4CAF50"/>
                    <path d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.3 5.3C37.4 38.8 44 34 44 24c0-1.2-.1-2.4-.4-3.5z" fill="#1976D2"/>
                  </svg>
                  {googleConnected ? "Reconnecter Google Business" : "Connecter Google Business"}
                </a>
              ) : (
                <p className="text-xs text-amber-600 font-medium">
                  ⚡ Fonctionnalité réservée aux plans Pro et Business.
                </p>
              )}
            </div>
          </form>
        )}

        {/* ── Personnalisation du menu mobile ─────────────────────────── */}
        <a
          href="/dashboard/settings/mobile-nav"
          className="mt-6 block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-gray-900">
                📱 Personnaliser le menu mobile
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Choisissez les 3 raccourcis visibles dans la barre du bas
                sur mobile.
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </a>
      </main>
    </div>
  );
}
