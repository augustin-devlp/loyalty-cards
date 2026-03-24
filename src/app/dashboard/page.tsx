import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";
import OnboardingTour from "@/components/OnboardingTour";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("business_name, country, status, onboarding_completed")
    .eq("id", user.id)
    .single();

  // Pending check — show waiting page
  if (!business || business.status !== "active") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <div className="flex items-center gap-2 justify-center mb-8">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black">S</span>
            </div>
            <span className="font-black text-2xl text-gray-900">Stampify</span>
          </div>

          <div className="bg-white rounded-3xl border border-amber-200 shadow-xl p-10">
            <div className="text-5xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Compte en attente d&apos;activation
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Votre compte est en cours de validation. Augustin vous contactera
              sous <strong>24h</strong> pour vous envoyer votre code
              d&apos;activation.
            </p>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-left space-y-3 mb-6">
              <p className="text-sm font-semibold text-amber-900">Contact :</p>
              <a
                href="mailto:augustin-domenget@stampify.ch"
                className="flex items-center gap-2 text-amber-700 text-sm hover:underline"
              >
                <span>✉️</span> augustin-domenget@stampify.ch
              </a>
              <a
                href="https://wa.me/33676549599"
                className="flex items-center gap-2 text-amber-700 text-sm hover:underline"
              >
                <span>💬</span> WhatsApp : +33 6 76 54 95 99
              </a>
            </div>

            <Link
              href="/activate"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-colors"
            >
              J&apos;ai reçu mon code → Activer
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { data: cards } = await supabase
    .from("loyalty_cards")
    .select("id, card_name, card_type, primary_color, text_color, is_active")
    .eq("business_id", user.id)
    .order("created_at", { ascending: false });

  const businessName = business?.business_name ?? user.email;

  return (
    <div className="min-h-screen">
      <DashboardNav />
      {!business.onboarding_completed && <OnboardingTour />}

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Welcome */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <p className="text-sm text-indigo-600 font-medium mb-2">Tableau de bord</p>
          <h2 className="text-3xl font-bold text-gray-900">
            Bienvenue, {businessName} !
          </h2>
          {business?.country && (
            <p className="text-gray-500 mt-2 text-sm">
              Pays : {business.country === "FR" ? "🇫🇷 France" : "🇨🇭 Suisse"}
            </p>
          )}
        </div>

        {/* Loyalty cards section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Mes cartes de fidélité</h3>
            <Link
              href="/dashboard/cards/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              + Créer une carte
            </Link>
          </div>

          {!cards || cards.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
              <p className="text-gray-400 text-sm mb-4">Aucune carte de fidélité pour l'instant.</p>
              <Link
                href="/dashboard/cards/new"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
              >
                Créer ma première carte
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => (
                <Link
                  key={card.id}
                  href={`/dashboard/cards/${card.id}`}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold"
                      style={{
                        backgroundColor: card.primary_color,
                        color: card.text_color,
                      }}
                    >
                      {card.card_name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-indigo-700 transition-colors">
                        {card.card_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {card.card_type === "stamp" ? "Tampons" : "Points"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                        card.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {card.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
