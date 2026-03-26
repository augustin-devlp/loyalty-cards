"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import { createClient } from "@/lib/supabase/client";

// ── Plan definitions ──────────────────────────────────────────────────────────
type PlanKey = "essential" | "pro" | "business";

const PLANS: Record<PlanKey, {
  name: string;
  price_fr: string;
  price_ch: string;
  color: string;
  badge: string;
  features: string[];
}> = {
  essential: {
    name: "Essentiel",
    price_fr: "19€/mois",
    price_ch: "29 CHF/mois",
    color: "#059669",
    badge: "bg-green-100 text-green-700",
    features: [
      "1 carte fidélité",
      "Scanner QR",
      "Dashboard basique",
      "Support email",
    ],
  },
  pro: {
    name: "Pro",
    price_fr: "49€/mois",
    price_ch: "79 CHF/mois",
    color: "#534AB7",
    badge: "bg-indigo-100 text-indigo-700",
    features: [
      "Tout le plan Essentiel",
      "Cartes fidélité illimitées",
      "Jusqu'à 5 employés",
      "SMS automatiques clients",
      "Roue de la fortune",
      "Loterie",
      "Google Wallet",
      "Stats avancées",
      "Parrainage",
      "Promos temporaires",
    ],
  },
  business: {
    name: "Business",
    price_fr: "99€/mois",
    price_ch: "149 CHF/mois",
    color: "#b45309",
    badge: "bg-amber-100 text-amber-700",
    features: [
      "Tout le plan Pro",
      "Configuration clé en main",
      "2 campagnes SMS/mois incluses",
      "Appel mensuel de suivi",
      "Support prioritaire",
    ],
  },
};

// Features gained when upgrading to the next plan
const UPGRADE_GAINS: Partial<Record<PlanKey, { to: PlanKey; gains: string[] }>> = {
  essential: {
    to: "pro",
    gains: [
      "Cartes fidélité illimitées",
      "Jusqu'à 5 employés",
      "SMS automatiques clients",
      "Roue de la fortune & Loterie",
      "Google Wallet",
      "Stats avancées",
      "Parrainage & promos temporaires",
    ],
  },
  pro: {
    to: "business",
    gains: [
      "Configuration clé en main",
      "2 campagnes SMS/mois incluses",
      "Appel mensuel de suivi",
      "Support prioritaire",
    ],
  },
};

// ── Add-ons ───────────────────────────────────────────────────────────────────
const ADDONS = [
  {
    id: "onboarding",
    icon: "🎯",
    name: "Onboarding guidé",
    price: "19€/mois",
    description: "Accompagnement personnalisé pour configurer votre compte de A à Z.",
  },
  {
    id: "sms-campaign",
    icon: "📱",
    name: "Campagne SMS ponctuelle",
    price: "19€/mois",
    description: "Envoyez une campagne SMS promotionnelle à tous vos clients.",
  },
  {
    id: "google-review-auto",
    icon: "⭐",
    name: "Demande avis Google auto",
    price: "29€/mois",
    description: "Sollicitez automatiquement vos clients après chaque visite.",
  },
  {
    id: "photo-shoot",
    icon: "📸",
    name: "Shooting photo produits",
    price: "99€ one-shot",
    description: "Photos professionnelles de vos produits par un photographe partenaire.",
  },
  {
    id: "website",
    icon: "🌐",
    name: "Site vitrine one-page",
    price: "149€ one-shot",
    description: "Un site web professionnel optimisé SEO pour votre commerce.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
interface BizInfo {
  plan: string | null;
  country: string | null;
  business_name: string;
  phone: string | null;
}

export default function BillingPage() {
  const router = useRouter();
  const [biz, setBiz] = useState<BizInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Upgrade flow
  const [upgradeRequested, setUpgradeRequested] = useState<string | null>(null);
  const [upgradePending, setUpgradePending] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  // Add-on flow: addonId → state
  const [addonState, setAddonState] = useState<Record<string, "pending" | "done" | "error">>({});

  useEffect(() => {
    const sb = createClient();
    sb.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      const { data } = await sb
        .from("businesses")
        .select("plan, country, business_name, phone")
        .eq("id", user.id)
        .single();
      setBiz(data ?? null);
      setLoading(false);
    });
  }, [router]);

  const requestItem = async (requestedItem: string, requestType: "plan" | "addon") => {
    if (requestType === "plan") {
      setUpgradePending(true);
      setUpgradeError(null);
    } else {
      setAddonState(s => ({ ...s, [requestedItem]: "pending" }));
    }

    const res = await fetch("/api/billing/request-upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestedItem, requestType }),
    });
    const data = await res.json();

    if (requestType === "plan") {
      setUpgradePending(false);
      if (!res.ok) setUpgradeError(data.error ?? "Erreur. Réessayez.");
      else setUpgradeRequested(requestedItem);
    } else {
      setAddonState(s => ({ ...s, [requestedItem]: res.ok ? "done" : "error" }));
    }
  };

  if (loading) return (
    <div className="min-h-screen">
      <DashboardNav />
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#534AB7] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  const currentPlan = (biz?.plan ?? "essential") as PlanKey;
  const planInfo = PLANS[currentPlan] ?? PLANS.essential;
  const country = (biz?.country ?? "FR") as "FR" | "CH";
  const upgrade = UPGRADE_GAINS[currentPlan] ?? null;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-8">

        <h1 className="text-2xl font-bold text-gray-900">Facturation & Abonnement</h1>

        {/* ── SECTION 1 : Plan actuel ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Plan actuel</p>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-gray-900">{planInfo.name}</h2>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${planInfo.badge}`}>Actif</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {country === "CH" ? planInfo.price_ch : planInfo.price_fr} · Sans engagement
              </p>
            </div>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-md shrink-0"
              style={{ background: planInfo.color }}
            >
              {currentPlan === "essential" ? "E" : currentPlan === "pro" ? "P" : "B"}
            </div>
          </div>

          {/* Features */}
          <div className="px-6 py-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Fonctionnalités incluses</p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {planInfo.features.map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <span
                    className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                    style={{ background: planInfo.color }}
                  >✓</span>
                  <p className="text-sm text-gray-700">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 2 : Upgrade ─────────────────────────────────────────────── */}
        {upgrade && (
          <div>
            <h2 className="text-base font-bold text-gray-700 mb-4">Passer au plan supérieur</h2>

            {upgradeRequested ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-5 flex items-start gap-4">
                <span className="text-2xl shrink-0">✅</span>
                <div>
                  <p className="font-bold text-green-800">Demande envoyée !</p>
                  <p className="text-sm text-green-700 mt-1">
                    Votre demande de passage au plan <strong>{PLANS[upgrade.to].name}</strong> a bien été enregistrée.
                    Vous serez notifié sous 24h par SMS ou email.
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border-2 shadow-sm overflow-hidden"
                style={{ borderColor: PLANS[upgrade.to].color + "50" }}
              >
                <div className="px-6 py-5" style={{ background: PLANS[upgrade.to].color + "08" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: PLANS[upgrade.to].color }}>
                      Plan {PLANS[upgrade.to].name}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: PLANS[upgrade.to].color }}
                    >Recommandé</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900 mb-5">
                    {country === "CH" ? PLANS[upgrade.to].price_ch : PLANS[upgrade.to].price_fr}
                  </p>

                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Ce que vous gagnez</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {upgrade.gains.map((g) => (
                      <div key={g} className="flex items-start gap-2">
                        <span className="shrink-0 text-sm font-bold" style={{ color: PLANS[upgrade.to].color }}>✦</span>
                        <p className="text-sm text-gray-700">{g}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 border-t" style={{ borderColor: PLANS[upgrade.to].color + "20" }}>
                  {upgradeError && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-3">{upgradeError}</p>
                  )}
                  <button
                    onClick={() => requestItem(upgrade.to, "plan")}
                    disabled={upgradePending}
                    className="w-full py-3.5 rounded-xl font-black text-white text-sm shadow-md disabled:opacity-60 transition-all active:scale-95"
                    style={{ background: PLANS[upgrade.to].color }}
                  >
                    {upgradePending ? "Envoi en cours…" : `Demander le plan ${PLANS[upgrade.to].name} →`}
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Votre demande est traitée sous 24h. Aucun prélèvement immédiat.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SECTION 3 : Add-ons ─────────────────────────────────────────────── */}
        <div>
          <h2 className="text-base font-bold text-gray-700 mb-1">Add-ons disponibles</h2>
          <p className="text-sm text-gray-500 mb-4">Services complémentaires disponibles quel que soit votre plan.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {ADDONS.map((addon) => {
              const state = addonState[addon.id];
              return (
                <div key={addon.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{addon.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{addon.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-snug">{addon.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-gray-100">
                    <span className="text-base font-black text-[#534AB7]">{addon.price}</span>

                    {state === "done" ? (
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-xl">
                        ✓ Demande envoyée
                      </span>
                    ) : state === "error" ? (
                      <button
                        onClick={() => requestItem(addon.id, "addon")}
                        className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Réessayer
                      </button>
                    ) : (
                      <button
                        onClick={() => requestItem(addon.id, "addon")}
                        disabled={state === "pending"}
                        className="text-xs font-bold text-white bg-[#534AB7] hover:bg-indigo-700 px-4 py-1.5 rounded-xl disabled:opacity-50 transition-colors"
                      >
                        {state === "pending" ? "Envoi…" : "Ajouter"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Footer note ─────────────────────────────────────────────────────── */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4">
          <p className="text-sm font-semibold text-indigo-700 mb-1">ℹ️ Traitement des demandes</p>
          <p className="text-xs text-indigo-600 leading-relaxed">
            Les upgrades et add-ons sont activés manuellement par notre équipe sous 24h ouvrées.
            Vous recevrez une confirmation par SMS dès validation.
            Pour toute question :{" "}
            <a href="mailto:hello@stampify.ch" className="underline font-medium">hello@stampify.ch</a>
          </p>
        </div>
      </main>
    </div>
  );
}
