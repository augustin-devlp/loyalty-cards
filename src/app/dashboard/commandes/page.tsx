"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardNav from "@/components/DashboardNav";
import OrderCard from "@/components/orders/OrderCard";
import OrderDetailModal from "@/components/orders/OrderDetailModal";
import { useOrdersRealtime } from "@/hooks/useOrdersRealtime";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import { useDashboardPush } from "@/hooks/useDashboardPush";
import { RIALTO_ID, TIMEZONE } from "@/lib/constants";
import type { OrderStatus } from "@/lib/constants";
import type { OrderWithItems, RestaurantRow } from "@/lib/orderTypes";
import { createClient } from "@/lib/supabase/client";
import { formatZurichDateTime } from "@/lib/orderFormat";

type Toast = { id: string; orderNumber: string };

const COLUMNS: {
  key: OrderStatus;
  label: string;
  sub: string;
  bg: string;
  accent: string;
  headerBg: string;
  pulse?: boolean;
}[] = [
  { key: "new",        label: "Nouvelles",      sub: "En attente de validation", bg: "bg-red-50",    accent: "border-l-red-500",    headerBg: "bg-red-500",    pulse: true },
  { key: "accepted",   label: "Acceptées",      sub: "Vont être préparées",      bg: "bg-yellow-50", accent: "border-l-yellow-500", headerBg: "bg-yellow-500" },
  { key: "preparing",  label: "En préparation", sub: "En cuisine",               bg: "bg-blue-50",   accent: "border-l-blue-500",   headerBg: "bg-blue-500" },
  { key: "ready",      label: "Prêtes",         sub: "À récupérer",              bg: "bg-green-50",  accent: "border-l-green-500",  headerBg: "bg-green-500" },
];

export default function CommandesPage() {
  const [restaurant, setRestaurant] = useState<RestaurantRow | null>(null);
  const [selected, setSelected] = useState<OrderWithItems | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [pushBannerDismissed, setPushBannerDismissed] = useState(false);

  const sound = useNotificationSound();
  const push = useDashboardPush(RIALTO_ID);

  useEffect(() => {
    (async () => {
      const sb = createClient();
      const { data } = await sb
        .from("restaurants")
        .select("*")
        .eq("id", RIALTO_ID)
        .single();
      if (data) setRestaurant(data as RestaurantRow);
    })();
  }, []);

  useEffect(() => {
    const d = localStorage.getItem("rialto:push-banner-dismissed");
    if (d === "1") setPushBannerDismissed(true);
  }, []);

  const handleNewOrder = useCallback(
    (order: { id: string; order_number: string; status: OrderStatus }) => {
      // Ignore if not really new (e.g. edge rerun)
      if (order.status !== "new") return;
      if (restaurant?.notification_sound !== false) sound.play();
      setToasts((list) => [
        ...list,
        { id: order.id, orderNumber: order.order_number },
      ]);
      setTimeout(() => {
        setToasts((list) => list.filter((t) => t.id !== order.id));
      }, 8000);
    },
    [restaurant?.notification_sound, sound],
  );

  const { orders, loading, connected } = useOrdersRealtime(RIALTO_ID, {
    onInsert: handleNewOrder,
  });

  const byStatus = useMemo(() => {
    const map: Record<OrderStatus, OrderWithItems[]> = {
      new: [], accepted: [], preparing: [], ready: [], completed: [], cancelled: [],
    };
    for (const o of orders) map[o.status].push(o);
    // nouvelles : plus anciennes en haut
    map.new.sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
    return map;
  }, [orders]);

  const todayStr = new Intl.DateTimeFormat("fr-CH", {
    timeZone: TIMEZONE,
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());

  const todayCompleted = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return orders.filter(
      (o) =>
        (o.status === "completed" || o.status === "cancelled") &&
        +new Date(o.created_at) >= +startOfDay,
    );
  }, [orders]);

  const refreshSelected = () => {
    if (!selected) return;
    const fresh = orders.find((o) => o.id === selected.id);
    if (fresh) setSelected(fresh);
  };
  useEffect(refreshSelected, [orders]); // eslint-disable-line

  async function patchStatus(id: string, status: OrderStatus) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert((j as { error?: string }).error ?? "Échec de la mise à jour");
    }
  }
  async function cancelOrder(id: string) {
    if (!confirm("Annuler cette commande ? Un SMS sera envoyé au client.")) return;
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert((j as { error?: string }).error ?? "Échec de l'annulation");
    }
  }

  async function toggleAcceptingOrders() {
    if (!restaurant) return;
    const next = !restaurant.accepting_orders;
    setRestaurant({ ...restaurant, accepting_orders: next });
    await fetch(`/api/restaurants/${RIALTO_ID}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ accepting_orders: next }),
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      <main className="md:ml-64 pb-28 md:pb-8">
        {/* Header sticky */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <h1 className="text-2xl font-black tracking-tight text-gray-900">
                  Commandes en direct
                </h1>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
                  <span className="capitalize">{todayStr}</span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        connected ? "bg-emerald-500 animate-pulse" : "bg-gray-300"
                      }`}
                    />
                    {connected ? "En ligne" : "Déconnecté"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleAcceptingOrders}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    restaurant?.accepting_orders
                      ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                      : "bg-red-100 text-red-900 hover:bg-red-200"
                  }`}
                >
                  {restaurant?.accepting_orders
                    ? "🟢 Accepte les commandes"
                    : "⛔ En pause"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.init();
                    sound.setEnabled(!sound.enabled);
                    if (!sound.enabled) sound.play();
                  }}
                  className="rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                >
                  {sound.enabled ? "🔔 Son activé" : "🔕 Son coupé"}
                </button>
              </div>
            </div>
          </div>

          {/* Bannière Push */}
          {push.supported && !push.subscribed && !pushBannerDismissed && (
            <div className="border-t border-red-100 bg-red-50 px-4 py-2.5 text-sm">
              <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
                <span className="text-red-900">
                  🔔 Activez les notifications pour être alerté même quand cet
                  onglet est fermé.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={push.loading}
                    onClick={async () => {
                      sound.init();
                      const ok = await push.subscribe();
                      if (!ok) alert("Permission refusée.");
                    }}
                    className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Activer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem("rialto:push-banner-dismissed", "1");
                      setPushBannerDismissed(true);
                    }}
                    className="rounded-full px-4 py-1.5 text-xs text-red-900 hover:bg-red-100"
                  >
                    Plus tard
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Toasts "Nouvelle commande" */}
        <div className="fixed right-4 top-20 z-40 space-y-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="animate-pulse rounded-xl border-2 border-red-500 bg-white p-3 shadow-lg"
            >
              <div className="text-xs font-semibold text-red-600">
                🔔 Nouvelle commande
              </div>
              <div className="text-lg font-black">{t.orderNumber}</div>
            </div>
          ))}
        </div>

        {/* Kanban */}
        <div className="mx-auto max-w-7xl p-4">
          {loading ? (
            <div className="py-20 text-center text-sm text-gray-500">
              Chargement…
            </div>
          ) : (
            <>
              <div className="grid gap-4 lg:grid-cols-4">
                {COLUMNS.map((col) => {
                  const list = byStatus[col.key];
                  return (
                    <section
                      key={col.key}
                      className={`flex flex-col rounded-2xl border border-gray-200 ${col.bg} border-l-4 ${col.accent}`}
                    >
                      <header
                        className={`flex items-center justify-between rounded-t-2xl ${col.headerBg} px-4 py-3 text-white ${col.pulse && list.length > 0 ? "animate-pulse" : ""}`}
                      >
                        <div>
                          <div className="text-sm font-bold">{col.label}</div>
                          <div className="text-[11px] opacity-80">{col.sub}</div>
                        </div>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-black text-gray-900">
                          {list.length}
                        </span>
                      </header>

                      <div className="flex-1 overflow-y-auto p-3 min-h-[200px] max-h-[75vh]">
                        {list.length === 0 && (
                          <div className="pt-6 text-center text-xs text-gray-400">
                            Aucune commande
                          </div>
                        )}

                        {list.map((order) => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            onOpen={() => setSelected(order)}
                          >
                            {col.key === "new" && (
                              <>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    sound.stop();
                                    void patchStatus(order.id, "accepted");
                                  }}
                                  className="flex-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                                >
                                  ✓ Accepter
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    sound.stop();
                                    void cancelOrder(order.id);
                                  }}
                                  className="flex-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                                >
                                  ✗ Refuser
                                </button>
                              </>
                            )}
                            {col.key === "accepted" && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  void patchStatus(order.id, "preparing");
                                }}
                                className="flex-1 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                              >
                                → En préparation
                              </button>
                            )}
                            {col.key === "preparing" && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  void patchStatus(order.id, "ready");
                                }}
                                className="flex-1 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                              >
                                → Prête
                              </button>
                            )}
                            {col.key === "ready" && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  void patchStatus(order.id, "completed");
                                }}
                                className="flex-1 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black"
                              >
                                ✓ Récupérée
                              </button>
                            )}
                          </OrderCard>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>

              {/* Accordion terminées */}
              <section className="mt-6 rounded-2xl border border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => setShowHistory((v) => !v)}
                  className="flex w-full items-center justify-between px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <span>
                    Commandes terminées aujourd'hui ({todayCompleted.length})
                  </span>
                  <span className="text-gray-400">{showHistory ? "▾" : "▸"}</span>
                </button>
                {showHistory && (
                  <ul className="divide-y divide-gray-100 border-t border-gray-100">
                    {todayCompleted.length === 0 && (
                      <li className="p-4 text-center text-xs text-gray-400">
                        Aucune pour l'instant
                      </li>
                    )}
                    {todayCompleted.map((o) => (
                      <li
                        key={o.id}
                        className="flex items-center justify-between px-5 py-2.5 text-sm hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelected(o)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{o.order_number}</span>
                          <span className="text-gray-600">{o.customer_name}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              o.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {o.status === "completed" ? "Récupérée" : "Annulée"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatZurichDateTime(o.created_at)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>

        {selected && (
          <OrderDetailModal
            order={selected}
            onClose={() => setSelected(null)}
            onStatusChange={async (status) => {
              await patchStatus(selected.id, status);
            }}
            onCancel={async () => {
              await cancelOrder(selected.id);
            }}
          />
        )}
      </main>
    </div>
  );
}
