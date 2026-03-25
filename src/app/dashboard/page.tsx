import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";
import OnboardingTourClient from "@/components/OnboardingTourClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("business_name, country, status, onboarding_completed, plan, google_place_id")
    .eq("id", user.id)
    .single();

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
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Compte en attente d&apos;activation</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Votre compte est en cours de validation. Augustin vous contactera sous <strong>24h</strong>.
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-left space-y-3 mb-6">
              <p className="text-sm font-semibold text-amber-900">Contact :</p>
              <a href="mailto:augustin-domenget@stampify.ch" className="flex items-center gap-2 text-amber-700 text-sm hover:underline">
                <span>✉️</span> augustin-domenget@stampify.ch
              </a>
              <a href="https://wa.me/33676549599" className="flex items-center gap-2 text-amber-700 text-sm hover:underline">
                <span>💬</span> WhatsApp : +33 6 76 54 95 99
              </a>
            </div>
            <Link href="/activate" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-colors">
              J&apos;ai reçu mon code → Activer
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const { data: cards } = await supabase
    .from("loyalty_cards")
    .select("id, card_name, card_type, primary_color, text_color, is_active")
    .eq("business_id", user.id)
    .order("created_at", { ascending: false });

  const cardIds = (cards ?? []).map(c => c.id);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Client cards ce mois
  let clientsThisMonth = 0;
  let stampsThisMonth = 0;
  let rewardsThisMonth = 0;
  if (cardIds.length > 0) {
    const { count: cc } = await supabase
      .from("customer_cards")
      .select("id", { count: "exact", head: true })
      .in("card_id", cardIds)
      .gte("created_at", startOfMonth);
    clientsThisMonth = cc ?? 0;

    const { data: ccIds } = await supabase
      .from("customer_cards")
      .select("id")
      .in("card_id", cardIds);

    const allCcIds = (ccIds ?? []).map(c => c.id);
    if (allCcIds.length > 0) {
      const { data: txs } = await supabase
        .from("transactions")
        .select("type, value, created_at")
        .in("customer_card_id", allCcIds)
        .gte("created_at", startOfMonth);

      for (const tx of txs ?? []) {
        if (tx.type === "stamp_added") stampsThisMonth += tx.value;
        if (tx.type === "reward_claimed") rewardsThisMonth++;
      }
    }
  }

  // Spin wheel
  const { data: spinWheel } = await supabase
    .from("spin_wheels")
    .select("id, is_active")
    .eq("business_id", user.id)
    .maybeSingle();

  let spinsThisMonth = 0;
  if (spinWheel?.id) {
    const { count } = await supabase
      .from("spin_entries")
      .select("id", { count: "exact", head: true })
      .eq("wheel_id", spinWheel.id)
      .gte("created_at", startOfMonth);
    spinsThisMonth = count ?? 0;
  }

  // Lottery
  const { data: activeLotteries } = await supabase
    .from("lotteries")
    .select("id, title")
    .eq("business_id", user.id)
    .eq("is_active", true);

  let lotteryParticipants = 0;
  const activeLotteryIds = (activeLotteries ?? []).map(l => l.id);
  if (activeLotteryIds.length > 0) {
    const { count } = await supabase
      .from("lottery_entries")
      .select("id", { count: "exact", head: true })
      .in("lottery_id", activeLotteryIds);
    lotteryParticipants = count ?? 0;
  }

  const businessName = business.business_name ?? user.email;
  const isPro = business.plan === "pro" || business.plan === "business";

  // ── Alerts ──────────────────────────────────────────────────────────────────
  const alerts: { emoji: string; text: string; link: string }[] = [];
  if (!spinWheel || !spinWheel.is_active) {
    alerts.push({ emoji: "🎰", text: "Roue de la fortune non configurée — attirer de nouveaux clients !", link: "/dashboard/spin-wheel" });
  }
  if ((activeLotteries ?? []).length === 0) {
    alerts.push({ emoji: "🎁", text: "Aucune loterie active — créez-en une pour engager vos clients.", link: "/dashboard/lottery" });
  }
  if (!business.google_place_id) {
    alerts.push({ emoji: "📍", text: "Google Place ID non configuré — activez les avis Google automatiques.", link: "/dashboard/settings" });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      {!business.onboarding_completed && <OnboardingTourClient businessId={user.id} />}

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8 pb-24 md:pb-10">

        {/* Welcome */}
        <div className="bg-gradient-to-r from-[#534AB7] to-indigo-500 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-indigo-200 text-sm font-medium mb-1">Tableau de bord</p>
          <h1 className="text-2xl font-bold">{businessName}</h1>
          <p className="text-indigo-200 text-sm mt-1">
            {business.country === "CH" ? "🇨🇭 Suisse" : "🇫🇷 France"} · Plan {business.plan ?? "Essentiel"}
          </p>
        </div>

        {/* Metric cards */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Ce mois-ci</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/dashboard/stats" className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Nouveaux clients</p>
              <p className="text-3xl font-black text-indigo-600">{clientsThisMonth}</p>
              <p className="text-xs text-gray-400 mt-1 group-hover:text-indigo-500">Voir les stats →</p>
            </Link>
            <Link href="/dashboard/stats" className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-violet-200 transition-all group">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Tampons distribués</p>
              <p className="text-3xl font-black text-violet-600">{stampsThisMonth}</p>
              <p className="text-xs text-gray-400 mt-1 group-hover:text-violet-500">Voir les stats →</p>
            </Link>
            <Link href="/dashboard/stats" className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-green-200 transition-all group">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Récompenses</p>
              <p className="text-3xl font-black text-green-600">{rewardsThisMonth}</p>
              <p className="text-xs text-gray-400 mt-1 group-hover:text-green-500">Voir les stats →</p>
            </Link>
            {isPro ? (
              <Link href="/dashboard/spin-wheel" className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Spins roue</p>
                <p className="text-3xl font-black text-orange-500">{spinsThisMonth}</p>
                <p className="text-xs text-gray-400 mt-1 group-hover:text-orange-500">Configurer →</p>
              </Link>
            ) : (
              <Link href="/dashboard/lottery" className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-pink-200 transition-all group">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Loterie</p>
                <p className="text-3xl font-black text-pink-500">{lotteryParticipants}</p>
                <p className="text-xs text-gray-400 mt-1 group-hover:text-pink-500">Participants →</p>
              </Link>
            )}
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Alertes</h2>
            <div className="space-y-2">
              {alerts.map((a, i) => (
                <Link key={i} href={a.link} className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 hover:bg-amber-100 transition-colors">
                  <span className="text-xl">{a.emoji}</span>
                  <p className="text-sm text-amber-800 flex-1">{a.text}</p>
                  <span className="text-amber-600 text-sm font-semibold shrink-0">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Actions rapides</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/dashboard/cards/new" className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-center">
              <span className="text-2xl">🃏</span>
              <span className="text-xs font-semibold text-gray-700">Créer une carte</span>
            </Link>
            <Link href="/dashboard/scan" className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-center">
              <span className="text-2xl">📷</span>
              <span className="text-xs font-semibold text-gray-700">Scanner un client</span>
            </Link>
            <Link href="/dashboard/stats" className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-center">
              <span className="text-2xl">📊</span>
              <span className="text-xs font-semibold text-gray-700">Voir les stats</span>
            </Link>
            <Link href="/dashboard/promotions" className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-center">
              <span className="text-2xl">📣</span>
              <span className="text-xs font-semibold text-gray-700">Notification push</span>
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Mes cartes</h2>
            <Link href="/dashboard/cards/new" className="bg-[#534AB7] hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
              + Nouvelle
            </Link>
          </div>
          {!cards || cards.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
              <p className="text-gray-400 text-sm mb-4">Aucune carte de fidélité pour l&apos;instant.</p>
              <Link href="/dashboard/cards/new" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                Créer ma première carte
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => (
                <Link key={card.id} href={`/dashboard/cards/${card.id}`}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold"
                      style={{ backgroundColor: card.primary_color, color: card.text_color }}>
                      {card.card_name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-indigo-700 transition-colors">{card.card_name}</p>
                      <p className="text-xs text-gray-400">{card.card_type === "stamp" ? "Tampons" : "Points"}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${card.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
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
