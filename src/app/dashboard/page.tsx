import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";
import OnboardingTourClient from "@/components/OnboardingTourClient";

const GREEN = "#1d9e75";
const GREEN_BG = "#e8f5ef";

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
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: GREEN }}>
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
              <a href="https://wa.me/41791342997?text=Bonjour%2C%20j%27ai%20besoin%20d%27aide%20avec%20mon%20site%20Stampify." className="flex items-center gap-2 text-amber-700 text-sm hover:underline">
                <span>💬</span> WhatsApp : +41 79 134 29 97
              </a>
            </div>
            <Link href="/activate" className="inline-block text-white font-bold px-6 py-3 rounded-2xl text-sm transition-colors" style={{ background: GREEN }}>
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

  let clientsThisMonth = 0;
  let stampsThisMonth = 0;
  let rewardsThisMonth = 0;
  const dailyStamps: Record<string, number> = {};

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
        if (tx.type === "stamp_added") {
          stampsThisMonth += tx.value;
          const day = (tx.created_at as string).split("T")[0];
          dailyStamps[day] = (dailyStamps[day] ?? 0) + tx.value;
        }
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
  // FIX : toutes les features (hors SMS) sont accessibles à tous les plans.
  // Les endpoints SMS vérifient eux-mêmes le plan côté API.
  const isPro = true;
  void business.plan; // (ancien : business.plan === "pro" || business.plan === "business")

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

  // ── Chart data ─────────────────────────────────────────────────────────────
  const daysInMonth = now.getDate();
  const chartData = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), i + 1);
    const key = d.toISOString().split("T")[0];
    return { day: i + 1, value: dailyStamps[key] ?? 0 };
  });
  const maxStamp = Math.max(...chartData.map(d => d.value), 1);
  const BAR_W = 12;
  const BAR_GAP = 3;
  const CHART_H = 72;
  const svgW = daysInMonth * (BAR_W + BAR_GAP);

  const MONTH_NAMES = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <div className="min-h-screen" style={{ background: "#FBF8F3" }}>
      <DashboardNav />
      {!business.onboarding_completed && <OnboardingTourClient businessId={user.id} />}

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8 pb-24 md:pb-12">

        {/* Welcome banner */}
        <div className="rounded-2xl p-6 text-white shadow-sm" style={{ background: "linear-gradient(135deg, #1d9e75 0%, #15856b 100%)" }}>
          <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.75)" }}>Tableau de bord</p>
          <h1 className="text-2xl font-bold">{businessName}</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>
            {business.country === "CH" ? "🇨🇭 Suisse" : "🇫🇷 France"} · Plan {business.plan ?? "Essentiel"}
          </p>
        </div>

        {/* Metric cards */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Ce mois-ci</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Clients */}
            <Link href="/dashboard/stats" className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group" style={{ borderColor: "#f0ede8" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Nouveaux clients</p>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: GREEN_BG }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-black" style={{ color: GREEN }}>{clientsThisMonth}</p>
              <p className="text-xs text-gray-400 mt-2 group-hover:text-gray-600 transition-colors">Voir les stats →</p>
            </Link>

            {/* Stamps */}
            <Link href="/dashboard/stats" className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group" style={{ borderColor: "#f0ede8" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Tampons</p>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: GREEN_BG }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-black" style={{ color: GREEN }}>{stampsThisMonth}</p>
              <p className="text-xs text-gray-400 mt-2 group-hover:text-gray-600 transition-colors">Voir les stats →</p>
            </Link>

            {/* Rewards */}
            <Link href="/dashboard/stats" className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group" style={{ borderColor: "#f0ede8" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Récompenses</p>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: GREEN_BG }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
                    <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-black" style={{ color: GREEN }}>{rewardsThisMonth}</p>
              <p className="text-xs text-gray-400 mt-2 group-hover:text-gray-600 transition-colors">Voir les stats →</p>
            </Link>

            {/* Spins or Lottery */}
            {isPro ? (
              <Link href="/dashboard/spin-wheel" className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group" style={{ borderColor: "#f0ede8" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Spins roue</p>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: GREEN_BG }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-black" style={{ color: GREEN }}>{spinsThisMonth}</p>
                <p className="text-xs text-gray-400 mt-2 group-hover:text-gray-600 transition-colors">Configurer →</p>
              </Link>
            ) : (
              <Link href="/dashboard/lottery" className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group" style={{ borderColor: "#f0ede8" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Loterie</p>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: GREEN_BG }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
                      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-black" style={{ color: GREEN }}>{lotteryParticipants}</p>
                <p className="text-xs text-gray-400 mt-2 group-hover:text-gray-600 transition-colors">Participants →</p>
              </Link>
            )}
          </div>
        </div>

        {/* Activity chart */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: "#f0ede8" }}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900">Activité tampons</h2>
              <p className="text-xs text-gray-400 mt-0.5">{monthLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black" style={{ color: GREEN }}>{stampsThisMonth}</p>
              <p className="text-xs text-gray-400">ce mois</p>
            </div>
          </div>
          <svg
            viewBox={`0 0 ${svgW} ${CHART_H}`}
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: CHART_H, display: "block" }}
          >
            {chartData.map((d, i) => {
              const barH = Math.max((d.value / maxStamp) * (CHART_H - 6), d.value > 0 ? 6 : 3);
              const x = i * (BAR_W + BAR_GAP);
              const y = CHART_H - barH;
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={BAR_W}
                  height={barH}
                  rx={3}
                  fill={d.value > 0 ? GREEN : "#e5e7eb"}
                  opacity={d.value > 0 ? 0.9 : 1}
                />
              );
            })}
          </svg>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-gray-400">1</span>
            <span className="text-[10px] text-gray-400">{Math.ceil(daysInMonth / 2)}</span>
            <span className="text-[10px] text-gray-400">{daysInMonth}</span>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Alertes</p>
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
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Actions rapides</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/dashboard/cards/new" className="flex flex-col items-center gap-2.5 bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-center group" style={{ borderColor: "#f0ede8" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GREEN_BG }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
                  <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                  <line x1="12" y1="13" x2="12" y2="17" /><line x1="10" y1="15" x2="14" y2="15" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-700">Créer une carte</span>
            </Link>
            <Link href="/dashboard/scan" className="flex flex-col items-center gap-2.5 bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-center group" style={{ borderColor: "#f0ede8" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GREEN_BG }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <rect x="7" y="7" width="3" height="3" /><rect x="14" y="7" width="3" height="3" />
                  <rect x="7" y="14" width="3" height="3" /><rect x="14" y="14" width="3" height="3" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-700">Scanner un client</span>
            </Link>
            <Link href="/dashboard/stats" className="flex flex-col items-center gap-2.5 bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-center group" style={{ borderColor: "#f0ede8" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GREEN_BG }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
                  <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-700">Voir les stats</span>
            </Link>
            <Link href="/dashboard/promotions" className="flex flex-col items-center gap-2.5 bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-center group" style={{ borderColor: "#f0ede8" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GREEN_BG }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-700">Notification push</span>
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mes cartes</p>
            <Link href="/dashboard/cards/new" className="text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors" style={{ background: GREEN }}>
              + Nouvelle
            </Link>
          </div>
          {!cards || cards.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed p-10 text-center" style={{ borderColor: "#c8e6dc" }}>
              <p className="text-gray-400 text-sm mb-4">Aucune carte de fidélité pour l&apos;instant.</p>
              <Link href="/dashboard/cards/new" className="inline-block text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors" style={{ background: GREEN }}>
                Créer ma première carte
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => (
                <Link key={card.id} href={`/dashboard/cards/${card.id}`}
                  className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all group" style={{ borderColor: "#f0ede8" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold"
                      style={{ backgroundColor: card.primary_color, color: card.text_color }}>
                      {card.card_name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-gray-700 transition-colors">{card.card_name}</p>
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
