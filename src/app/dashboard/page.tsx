import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";

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
    .select("business_name, country")
    .eq("id", user.id)
    .single();

  const { data: cards } = await supabase
    .from("loyalty_cards")
    .select("id, card_name, card_type, primary_color, text_color, is_active")
    .order("created_at", { ascending: false });

  const businessName = business?.business_name ?? user.email;

  return (
    <div className="min-h-screen">
      <DashboardNav />

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
