import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";
import ActivityChart from "@/components/ActivityChart";
import ExportPDFButton from "./ExportPDFButton";

// ─── helpers ──────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  subLabel,
  color = "indigo",
}: {
  label: string;
  value: string | number;
  sub?: string | number;
  subLabel?: string;
  color?: "indigo" | "green" | "amber" | "violet";
}) {
  const accent: Record<string, string> = {
    indigo: "text-indigo-600 bg-indigo-50",
    green: "text-green-600 bg-green-50",
    amber: "text-amber-600 bg-amber-50",
    violet: "text-violet-600 bg-violet-50",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
        {label}
      </p>
      <p className={`text-4xl font-bold ${accent[color].split(" ")[0]}`}>{value}</p>
      {sub !== undefined && (
        <p className="text-sm text-gray-500 mt-2">
          <span className="font-semibold text-gray-700">{sub}</span>{" "}
          {subLabel ?? "ce mois-ci"}
        </p>
      )}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function StatsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Merchant's loyalty cards (RLS filters by business_id = auth.uid())
  const { data: loyaltyCards } = await supabase
    .from("loyalty_cards")
    .select("id, card_name, card_type");

  const cardIds = loyaltyCards?.map((c) => c.id) ?? [];

  // 2. All customer_cards for this merchant's cards
  type CCRow = {
    id: string;
    customer_id: string;
    card_id: string;
    current_stamps: number;
    current_points: number;
    rewards_claimed: number;
    customers: { first_name: string; last_name: string };
  };

  let customerCards: CCRow[] = [];
  if (cardIds.length > 0) {
    const { data } = await supabase
      .from("customer_cards")
      .select(
        "id, customer_id, card_id, current_stamps, current_points, rewards_claimed, customers(first_name, last_name)"
      )
      .in("card_id", cardIds);
    customerCards = (data ?? []) as unknown as CCRow[];
  }

  // 3. All transactions for those customer_cards
  type TxRow = {
    customer_card_id: string;
    type: string;
    value: number;
    created_at: string;
  };

  let transactions: TxRow[] = [];
  const customerCardIds = customerCards.map((cc) => cc.id);
  if (customerCardIds.length > 0) {
    const { data } = await supabase
      .from("transactions")
      .select("customer_card_id, type, value, created_at")
      .in("customer_card_id", customerCardIds)
      .order("created_at", { ascending: true });
    transactions = (data ?? []) as TxRow[];
  }

  // ── Aggregations ────────────────────────────────────────────────────────────

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const totalClients = new Set(customerCards.map((cc) => cc.customer_id)).size;

  const stampsTotal = transactions
    .filter((t) => t.type === "stamp_added")
    .reduce((s, t) => s + t.value, 0);
  const stampsMois = transactions
    .filter((t) => t.type === "stamp_added" && t.created_at >= startOfMonth)
    .reduce((s, t) => s + t.value, 0);

  const pointsTotal = transactions
    .filter((t) => t.type === "points_added")
    .reduce((s, t) => s + t.value, 0);
  const pointsMois = transactions
    .filter((t) => t.type === "points_added" && t.created_at >= startOfMonth)
    .reduce((s, t) => s + t.value, 0);

  const rewardsTotal = transactions.filter((t) => t.type === "reward_claimed").length;
  const rewardsMois = transactions.filter(
    (t) => t.type === "reward_claimed" && t.created_at >= startOfMonth
  ).length;

  const hasStamps = loyaltyCards?.some((c) => c.card_type === "stamp") ?? false;
  const hasPoints = loyaltyCards?.some((c) => c.card_type === "points") ?? false;

  // Taux de complétion
  const completedCards = customerCards.filter((cc) => cc.rewards_claimed >= 1).length;
  const completionRate =
    customerCards.length > 0
      ? Math.round((completedCards / customerCards.length) * 100)
      : 0;

  // Top 5 clients
  const customerMap = new Map<
    string,
    { name: string; rewards: number; stamps: number; points: number }
  >();
  for (const cc of customerCards) {
    const existing = customerMap.get(cc.customer_id) ?? {
      name: `${cc.customers.first_name} ${cc.customers.last_name}`,
      rewards: 0,
      stamps: 0,
      points: 0,
    };
    existing.rewards += cc.rewards_claimed;
    existing.stamps += cc.current_stamps;
    existing.points += cc.current_points;
    customerMap.set(cc.customer_id, existing);
  }
  const allClients = Array.from(customerMap.values())
    .sort(
      (a, b) =>
        b.rewards - a.rewards || b.stamps + b.points - (a.stamps + a.points)
    );
  const top5 = allClients.slice(0, 5);
  const top10 = allClients.slice(0, 10);

  // Activity chart — 30 days
  const thirtyDaysAgo = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const scans = transactions.filter(
      (t) =>
        t.created_at.slice(0, 10) === dateStr &&
        (t.type === "stamp_added" || t.type === "points_added")
    ).length;
    return {
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      scans,
    };
  });

  const hasData = customerCards.length > 0;

  return (
    <div className="min-h-screen">
      <DashboardNav />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de votre programme de fidélité.</p>
        </div>

        {!hasData && loyaltyCards?.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-400 text-sm">
              Aucune donnée disponible. Créez une carte de fidélité pour commencer.
            </p>
          </div>
        )}

        {/* ── Stat cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Clients inscrits"
            value={totalClients}
            color="indigo"
          />
          {hasStamps && (
            <StatCard
              label="Tampons distribués"
              value={stampsTotal}
              sub={stampsMois}
              color="violet"
            />
          )}
          {hasPoints && (
            <StatCard
              label="Points distribués"
              value={pointsTotal}
              sub={pointsMois}
              color="violet"
            />
          )}
          {!hasStamps && !hasPoints && (
            <StatCard label="Distributions" value="—" color="violet" />
          )}
          <StatCard
            label="Récompenses réclamées"
            value={rewardsTotal}
            sub={rewardsMois}
            color="green"
          />
          <StatCard
            label="Taux de complétion"
            value={`${completionRate}%`}
            sub={`${completedCards} / ${customerCards.length}`}
            subLabel="cartes avec récompense"
            color="amber"
          />
        </div>

        {/* ── Activity chart ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Activité sur les 30 derniers jours
          </h2>
          <p className="text-xs text-gray-400 mb-5">Nombre de scans (tampons + points) par jour</p>
          <ActivityChart data={chartData} />
        </div>

        {/* ── Bottom row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Top 5 clients */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-5">Top 5 clients fidèles</h2>
            {top5.length === 0 ? (
              <p className="text-sm text-gray-400">Aucun client pour l'instant.</p>
            ) : (
              <ol className="space-y-3">
                {top5.map((c, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        i === 0
                          ? "bg-amber-100 text-amber-700"
                          : i === 1
                          ? "bg-gray-100 text-gray-600"
                          : i === 2
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                      <p className="text-xs text-gray-400">
                        {c.rewards > 0
                          ? `${c.rewards} récompense${c.rewards > 1 ? "s" : ""}`
                          : hasStamps
                          ? `${c.stamps} tampon${c.stamps > 1 ? "s" : ""}`
                          : `${c.points} pts`}
                      </p>
                    </div>
                    <div className="shrink-0 flex gap-1">
                      {Array.from({ length: Math.min(c.rewards, 5) }).map((_, j) => (
                        <span key={j} className="text-amber-400 text-sm">★</span>
                      ))}
                      {c.rewards === 0 && (
                        <span className="text-gray-200 text-sm">★</span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Completion rate breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-5">
              Répartition des cartes
            </h2>
            {customerCards.length === 0 ? (
              <p className="text-sm text-gray-400">Aucune carte émise pour l'instant.</p>
            ) : (
              <div className="space-y-4">
                {/* Completion bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600">Avec au moins 1 récompense</span>
                    <span className="font-semibold text-gray-800">{completionRate}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Active vs inactive (has stamps/points progress) */}
                {(() => {
                  const withProgress = customerCards.filter(
                    (cc) => cc.current_stamps > 0 || cc.current_points > 0
                  ).length;
                  const progressRate =
                    customerCards.length > 0
                      ? Math.round((withProgress / customerCards.length) * 100)
                      : 0;
                  return (
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-600">En cours de progression</span>
                        <span className="font-semibold text-gray-800">{progressRate}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all"
                          style={{ width: `${progressRate}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}

                <p className="text-xs text-gray-400 pt-1">
                  {customerCards.length} carte{customerCards.length > 1 ? "s" : ""} émise
                  {customerCards.length > 1 ? "s" : ""} au total
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
