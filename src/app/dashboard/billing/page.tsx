"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface BizInfo {
  plan: string | null;
  subscription_status: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  country: string | null;
}

const PLAN_LABELS: Record<string, string> = {
  essential: "Essentiel",
  pro:       "Pro",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active:   { label: "Actif",         color: "bg-green-100 text-green-700" },
  past_due: { label: "Paiement en retard", color: "bg-amber-100 text-amber-700" },
  canceled: { label: "Annulé",        color: "bg-red-100 text-red-700" },
  inactive: { label: "Inactif",       color: "bg-gray-100 text-gray-600" },
};

export default function BillingPage() {
  const [biz, setBiz] = useState<BizInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase
        .from("businesses")
        .select("plan, subscription_status, stripe_customer_id, stripe_subscription_id, country")
        .eq("id", user.id)
        .single();
      setBiz(data ?? null);
      setLoading(false);
    });
  }, []);

  const openPortal = async () => {
    setPortalLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Erreur");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
      setPortalLoading(false);
    }
  };

  const startCheckout = async (plan: "essential" | "pro") => {
    setCheckoutLoading(plan);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Erreur");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statusKey = biz?.subscription_status ?? "inactive";
  const status = STATUS_LABELS[statusKey] ?? STATUS_LABELS.inactive;
  const isActive = statusKey === "active";
  const country = (biz?.country ?? "FR") as "FR" | "CH";

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            ← Tableau de bord
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-700 font-medium">Facturation</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Facturation & Abonnement</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Current plan card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Plan actuel</p>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-gray-900">
                  {biz?.plan ? (PLAN_LABELS[biz.plan] ?? biz.plan) : "Aucun abonnement"}
                </h2>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                  {status.label}
                </span>
              </div>
              {biz?.plan && (
                <p className="text-sm text-gray-500 mt-1">
                  {country === "CH"
                    ? biz.plan === "essential" ? "29 CHF/mois" : "79 CHF/mois"
                    : biz.plan === "essential" ? "19€/mois"   : "49€/mois"}
                  {" · "}Sans engagement
                </p>
              )}
            </div>

            {isActive && biz?.stripe_customer_id && (
              <button
                onClick={openPortal}
                disabled={portalLoading}
                className="shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                {portalLoading ? "Redirection…" : "Gérer mon abonnement"}
              </button>
            )}
          </div>

          {isActive && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Gérez votre abonnement, consultez vos factures, changez de moyen de paiement ou annulez via le portail Stripe.
              </p>
            </div>
          )}
        </div>

        {/* No subscription or cancelled → show plans */}
        {!isActive && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-1">Souscrire à un abonnement</h3>
            <p className="text-sm text-gray-500 mb-6">
              Choisissez la formule qui correspond à votre commerce.
              {country === "CH" ? " Prix en CHF." : " Prix en €."}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {(["essential", "pro"] as const).map((plan) => (
                <div key={plan} className={`border rounded-2xl p-5 ${plan === "pro" ? "border-indigo-300 bg-indigo-50" : "border-gray-200"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900">{PLAN_LABELS[plan]}</p>
                      <p className="text-lg font-black text-indigo-600 mt-0.5">
                        {country === "CH"
                          ? plan === "essential" ? "29 CHF" : "79 CHF"
                          : plan === "essential" ? "19€"    : "49€"}
                        <span className="text-xs font-normal text-gray-500">/mois</span>
                      </p>
                    </div>
                    {plan === "pro" && (
                      <span className="text-xs font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">Populaire</span>
                    )}
                  </div>
                  <button
                    onClick={() => startCheckout(plan)}
                    disabled={!!checkoutLoading}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 ${
                      plan === "pro"
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {checkoutLoading === plan ? "Redirection…" : `Choisir ${PLAN_LABELS[plan]}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-5 text-sm text-indigo-700">
          <p className="font-semibold mb-1">💳 Paiement sécurisé par Stripe</p>
          <p className="text-indigo-600 text-xs">
            Vos données de paiement sont gérées directement par Stripe et ne transitent pas par nos serveurs.
            Vous pouvez annuler à tout moment sans frais supplémentaires.
          </p>
        </div>
      </main>
    </div>
  );
}
