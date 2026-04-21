"use client";

import { useEffect, useState } from "react";
import DashboardNav from "@/components/DashboardNav";
import PushControl from "@/components/orders/PushControl";
import Toggle from "@/components/ui/Toggle";
import { useDashboardPush } from "@/hooks/useDashboardPush";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import { RIALTO_ID } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { RestaurantRow } from "@/lib/orderTypes";

export default function ParametresCommandesPage() {
  const [restaurant, setRestaurant] = useState<RestaurantRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
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

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <main className="md:ml-64 p-8">
          <div className="text-sm text-gray-500">Chargement…</div>
        </main>
      </div>
    );
  }

  const set = (patch: Partial<RestaurantRow>) =>
    setRestaurant({ ...restaurant, ...patch });

  async function save() {
    if (!restaurant) return;
    setSaving(true);
    setOk(false);
    const res = await fetch(`/api/restaurants/${RIALTO_ID}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        accepting_orders: restaurant.accepting_orders,
        order_min_amount: Number(restaurant.order_min_amount),
        order_open_time: restaurant.order_open_time,
        order_close_time: restaurant.order_close_time,
        prep_time_minutes: Number(restaurant.prep_time_minutes),
        notification_sound: restaurant.notification_sound,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setOk(true);
      setTimeout(() => setOk(false), 2000);
    } else {
      alert("Échec de l'enregistrement");
    }
  }

  const row = "flex items-center justify-between border-b border-gray-100 py-3";
  const label = "flex-1 text-sm font-medium text-gray-700";
  const input =
    "w-36 rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-gray-400";

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="md:ml-64 pb-28 md:pb-8 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-1 text-2xl font-black tracking-tight">
            Paramètres commandes
          </h1>
          <p className="mb-6 text-sm text-gray-600">
            Règle d'acceptation, horaires, préparation et notifications.
          </p>

          <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6">
            {/* Général */}
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Général
              </h2>
              <div className={row}>
                <div className={label}>
                  Accepter les commandes
                  <div className="text-xs text-gray-500">
                    Désactive temporairement la prise de nouvelles commandes.
                  </div>
                </div>
                <Toggle
                  checked={restaurant.accepting_orders}
                  onChange={(v) => set({ accepting_orders: v })}
                  showStateText
                />
              </div>
              <div className={row}>
                <div className={label}>Panier minimum (CHF)</div>
                <input
                  type="number"
                  min={0}
                  step="0.5"
                  value={Number(restaurant.order_min_amount)}
                  onChange={(e) =>
                    set({ order_min_amount: parseFloat(e.target.value) || 0 })
                  }
                  className={input}
                />
              </div>
            </section>

            {/* Horaires */}
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Horaires de commande
              </h2>
              <div className={row}>
                <div className={label}>Heure d'ouverture</div>
                <input
                  type="time"
                  value={String(restaurant.order_open_time).slice(0, 5)}
                  onChange={(e) => set({ order_open_time: e.target.value })}
                  className={input}
                />
              </div>
              <div className={row}>
                <div className={label}>Heure de fermeture</div>
                <input
                  type="time"
                  value={String(restaurant.order_close_time).slice(0, 5)}
                  onChange={(e) => set({ order_close_time: e.target.value })}
                  className={input}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Les clients ne pourront pas passer commande en dehors de ces
                horaires.
              </p>
            </section>

            {/* Préparation */}
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Préparation
              </h2>
              <div className={row}>
                <div className={label}>Délai de préparation (min)</div>
                <input
                  type="number"
                  min={0}
                  step={5}
                  value={Number(restaurant.prep_time_minutes)}
                  onChange={(e) =>
                    set({ prep_time_minutes: parseInt(e.target.value, 10) || 0 })
                  }
                  className={input}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Temps minimum entre la commande et l'heure de retrait possible.
              </p>
            </section>

            {/* Notifications */}
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Notifications
              </h2>
              <div className={row}>
                <div className={label}>Son de notification</div>
                <Toggle
                  checked={!!restaurant.notification_sound}
                  onChange={(v) => set({ notification_sound: v })}
                  showStateText
                />
              </div>
              <div className={row}>
                <div className={label}>
                  Tester le son
                  <div className="text-xs text-gray-500">
                    3 bips « cuisine »
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.init();
                    sound.play();
                  }}
                  className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                >
                  ▶ Tester
                </button>
              </div>
              <div className={row}>
                <div className={label}>
                  Notifications push navigateur
                  <div className="text-xs text-gray-500">
                    Alertes même onglet fermé.
                  </div>
                </div>
                <PushControl
                  pushState={push.state}
                  loading={push.loading}
                  onSubscribe={async () => {
                    const result = await push.subscribe();
                    if (!result.ok) alert(result.message);
                  }}
                  onUnsubscribe={() => push.unsubscribe()}
                />
              </div>
              {push.state === "active" && (
                <div className={row}>
                  <div className={label}>
                    Tester la notification push
                    <div className="text-xs text-gray-500">
                      Envoie une notification factice à cet appareil.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/push/dashboard-send", {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({
                            restaurant_id: RIALTO_ID,
                            title: "Test Stampify",
                            body: "Si vous voyez ceci, les notifications fonctionnent 🎉",
                            url: "/dashboard/commandes/parametres",
                            tag: "test-push",
                          }),
                        });
                        const data = await res.json();
                        if (!res.ok) {
                          alert(`Échec : ${data.error ?? res.status}`);
                        } else if (data.sent === 0) {
                          alert("Aucun appareil abonné.");
                        } else {
                          // Feedback inline après 1 sec (laisse le temps à la notif d'arriver)
                          setTimeout(() => {
                            alert(`✓ Envoyé sur ${data.sent} appareil${data.sent > 1 ? "s" : ""}.`);
                          }, 200);
                        }
                      } catch (err) {
                        alert(
                          `Erreur réseau : ${err instanceof Error ? err.message : "inconnue"}`,
                        );
                      }
                    }}
                    className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    ▶ Tester
                  </button>
                </div>
              )}
            </section>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
              {ok && (
                <span className="text-xs font-semibold text-emerald-600">
                  ✓ Enregistré
                </span>
              )}
              <button
                type="button"
                disabled={saving}
                onClick={save}
                className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>

          {/* Lien vers la config livraison */}
          <a
            href="/dashboard/commandes/livraison"
            className="mt-4 block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-gray-900">
                  🚴 Livraison à domicile
                </div>
                <div className="mt-0.5 text-xs text-gray-500">
                  Configurer les zones de livraison, frais, panier minimum
                  et email de réception des tickets.
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </a>

          {/* Lien vers les templates SMS */}
          <a
            href="/dashboard/commandes/sms-templates"
            className="mt-4 block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-gray-900">
                  💬 Messages SMS clients
                </div>
                <div className="mt-0.5 text-xs text-gray-500">
                  Personnalisez les 5 messages automatiques (confirmation,
                  accepté, préparation, prête, annulé).
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}

