"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { detectCountry } from "@/lib/detectCountry";

const PLANS = {
  essential: {
    name: "Essentiel",
    priceEur: 19,
    priceCHF: 29,
    features: [
      "1 carte de fidélité",
      "Design personnalisé (logo + couleurs)",
      "QR code boutique (impression)",
      "Scanner QR intégré",
      "Statistiques de base",
      "Clients illimités",
      "1 compte employé",
    ],
  },
  pro: {
    name: "Pro",
    priceEur: 49,
    priceCHF: 79,
    popular: true,
    features: [
      "Tout ce qu'inclut Essentiel",
      "Cartes de fidélité illimitées",
      "5 comptes employés",
      "Intégration Google Wallet",
      "Emails automatiques aux clients",
      "Promotions temporaires",
      "Programme de parrainage",
      "Statistiques avancées + export PDF",
      "Avis Google automatique",
      "Support prioritaire",
    ],
  },
} as const;

type PlanId = keyof typeof PLANS;

const BUSINESS_FEATURES = [
  "Tout ce qu'inclut Pro",
  "Comptes employés illimités",
  "Multi-établissements (jusqu'à 10)",
  "Intégration caisse / API",
  "Campagnes SMS & push",
  "Rapport mensuel automatique",
  "Onboarding personnalisé inclus",
  "Account manager dédié",
  "SLA 99,9% garanti",
];

function SubscribeContent() {
  const router = useRouter();

  const [country, setCountry] = useState<"FR" | "CH">(() =>
    typeof window !== "undefined" ? detectCountry() : "FR"
  );
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setCountry(detectCountry());
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        // Non connecté : montrer la page normalement
        setIsChecking(false);
        return;
      }
      setEmail(user.email ?? "");
      const { data: biz } = await supabase
        .from("businesses")
        .select("status, plan")
        .eq("id", user.id)
        .single();
      if (!biz) { setIsChecking(false); return; }
      if (biz.status === "active") { router.push("/dashboard"); return; }
      if (biz.status === "pending" && biz.plan) {
        router.push("/subscribe/confirmation");
        return;
      }
      setIsChecking(false);
    });
  }, [router]);

  const handleSubscribe = async (plan: PlanId) => {
    // Non connecté : rediriger vers l'inscription avec le plan présélectionné
    if (!email) {
      router.push(`/signup?plan=${plan}`);
      return;
    }
    setLoading(plan);
    setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, phone, country }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'envoi.");
      router.push("/subscribe/confirmation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
      setLoading(null);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400 text-sm">Chargement…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-black">S</span>
        </div>
        <span className="font-black text-2xl text-gray-900">Stampify</span>
      </div>

      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Choisissez votre formule
          </h1>
          <p className="text-gray-500">
            {email && <span className="text-gray-700 font-medium">{email} · </span>}
            {country === "CH" ? "🇨🇭 Prix en CHF" : "🇫🇷 Prix en €"}
          </p>
          <p className="text-sm text-indigo-600 mt-2 font-medium">
            Votre compte sera activé sous 24h après validation par notre équipe.
          </p>
        </div>

        {/* Phone field */}
        <div className="max-w-sm mx-auto mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numéro de téléphone <span className="text-gray-400">(pour votre code d'activation)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+33 6 12 34 56 78"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {(Object.entries(PLANS) as [PlanId, (typeof PLANS)[PlanId]][]).map(
            ([id, plan]) => {
              const price = country === "CH" ? plan.priceCHF : plan.priceEur;
              const currency = country === "CH" ? " CHF" : "€";
              const isPopular = "popular" in plan && plan.popular;

              return (
                <div
                  key={id}
                  className={`relative flex flex-col rounded-3xl p-8 shadow-xl ${
                    isPopular
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-400 ring-offset-2"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      ⚡ Populaire
                    </span>
                  )}

                  <div className="mb-6">
                    <h2 className={`text-xl font-bold mb-1 ${isPopular ? "text-white" : "text-gray-900"}`}>
                      {plan.name}
                    </h2>
                    <div className="flex items-end gap-1">
                      <span className={`text-5xl font-black ${isPopular ? "text-white" : "text-gray-900"}`}>
                        {price}
                      </span>
                      <span className={`text-lg font-semibold mb-1 ${isPopular ? "text-indigo-200" : "text-gray-500"}`}>
                        {currency}/mois
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${isPopular ? "text-indigo-200" : "text-gray-500"}`}>
                      Sans engagement · Résiliable à tout moment
                    </p>
                  </div>

                  <ul className="space-y-2.5 flex-1 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <svg viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 shrink-0 mt-0.5 ${isPopular ? "text-indigo-200" : "text-indigo-600"}`}>
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                        <span className={`text-sm ${isPopular ? "text-indigo-100" : "text-gray-700"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(id)}
                    disabled={!!loading}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-60 ${
                      isPopular
                        ? "bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                    }`}
                  >
                    {loading === id ? "Envoi en cours…" : `Choisir ${plan.name}`}
                  </button>
                </div>
              );
            }
          )}

          {/* Business plan — contact CTA */}
          <div className="relative flex flex-col rounded-3xl p-8 shadow-xl bg-indigo-600 text-white ring-4 ring-yellow-400 ring-offset-2">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
              💎 Premium
            </span>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1 text-white">Business</h2>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black text-white">{country === "CH" ? "149" : "99"}</span>
                <span className="text-lg font-semibold mb-1 text-indigo-200">{country === "CH" ? " CHF" : "€"}/mois</span>
              </div>
              <p className="text-sm mt-1 text-indigo-200">Engagement 3 mois minimum</p>
            </div>
            <ul className="space-y-2.5 flex-1 mb-8">
              {BUSINESS_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 mt-0.5 text-indigo-200">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-indigo-100">{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={`mailto:augustin-domenget@stampify.ch?subject=${encodeURIComponent("Demande forfait Business Stampify")}`}
              className="block w-full py-3.5 rounded-2xl font-bold text-sm text-center transition-all bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg"
            >
              Nous contacter →
            </a>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
            Se connecter
          </Link>
          {" · "}
          <Link href="/" className="text-gray-400 hover:text-gray-600">
            Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense>
      <SubscribeContent />
    </Suspense>
  );
}
