"use client";

import { useCallback, useEffect, useState } from "react";

export type PushState =
  | "unknown" // initial, avant hydration
  | "unsupported" // navigateur sans Notification/SW/PushManager
  | "denied" // user a bloqué les notifs
  | "default" // permission pas encore demandée
  | "granted-not-subscribed" // permission OK, mais pas de subscription active
  | "active"; // tout est branché

export type PushError =
  | "unsupported"
  | "missing-vapid"
  | "permission-denied"
  | "sw-register-failed"
  | "subscribe-failed"
  | "network";

type SubscribeResult =
  | { ok: true }
  | { ok: false; error: PushError; message: string };

/**
 * Machine à états simple pour les Web Push côté dashboard restaurant.
 * Chaque état a une représentation UI unique — pas de "disabled silencieux".
 */
export function useDashboardPush(restaurantId: string) {
  const [state, setState] = useState<PushState>("unknown");
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") return;
    const supported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      typeof Notification !== "undefined";
    if (!supported) {
      setState("unsupported");
      return;
    }
    const perm = Notification.permission;
    if (perm === "denied") {
      setState("denied");
      return;
    }
    if (perm === "default") {
      setState("default");
      return;
    }
    // perm === "granted" : on vérifie s'il y a déjà une subscription
    try {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      if (!reg) {
        setState("granted-not-subscribed");
        return;
      }
      const sub = await reg.pushManager.getSubscription();
      setState(sub ? "active" : "granted-not-subscribed");
    } catch {
      setState("granted-not-subscribed");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, restaurantId]);

  async function registerSW(): Promise<ServiceWorkerRegistration> {
    const reg = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;
    return reg;
  }

  async function subscribe(): Promise<SubscribeResult> {
    setLoading(true);
    try {
      if (state === "unsupported") {
        return {
          ok: false,
          error: "unsupported",
          message:
            "Votre navigateur ne supporte pas les notifications push (essayez Chrome, Firefox ou Edge).",
        };
      }
      if (state === "denied") {
        return {
          ok: false,
          error: "permission-denied",
          message:
            "Notifications bloquées dans les paramètres du navigateur. Pour les réactiver : icône cadenas dans la barre d'URL → Notifications → Autoriser.",
        };
      }

      const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapid) {
        console.error("[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY missing");
        return {
          ok: false,
          error: "missing-vapid",
          message: "Configuration serveur incomplète (clé VAPID publique manquante).",
        };
      }

      let reg: ServiceWorkerRegistration;
      try {
        reg = await registerSW();
      } catch (err) {
        console.error("[push] SW register failed", err);
        return {
          ok: false,
          error: "sw-register-failed",
          message:
            "Impossible d'activer le service worker. Rechargez la page (pas en navigation privée).",
        };
      }

      // Demande de permission (si pas encore granted)
      if (state !== "active" && state !== "granted-not-subscribed") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          await refresh();
          return {
            ok: false,
            error: "permission-denied",
            message:
              permission === "denied"
                ? "Permission refusée par le navigateur. Icône cadenas dans la barre d'URL → Notifications → Autoriser."
                : "Autorisation non accordée.",
          };
        }
      }

      let sub: PushSubscription;
      try {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            vapid,
          ) as unknown as ArrayBuffer,
        });
      } catch (err) {
        console.error("[push] pushManager.subscribe failed", err);
        return {
          ok: false,
          error: "subscribe-failed",
          message: `Erreur technique : ${
            err instanceof Error ? err.message : "inconnue"
          }`,
        };
      }

      try {
        const res = await fetch("/api/push/dashboard-subscribe", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            subscription: sub.toJSON(),
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}) as { error?: string });
          await sub.unsubscribe();
          return {
            ok: false,
            error: "network",
            message: `Erreur serveur : ${
              (body as { error?: string }).error ?? res.status
            }`,
          };
        }
      } catch (err) {
        console.error("[push] backend persist failed", err);
        await sub.unsubscribe();
        return {
          ok: false,
          error: "network",
          message: "Impossible de contacter Stampify.",
        };
      }

      setState("active");
      return { ok: true };
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribe(): Promise<void> {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      if (!reg) return;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) return;
      try {
        await fetch("/api/push/dashboard-subscribe", {
          method: "DELETE",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
      } catch (err) {
        console.warn("[push] backend delete failed", err);
      }
      await sub.unsubscribe();
      setState("granted-not-subscribed");
    } finally {
      setLoading(false);
    }
  }

  return {
    state,
    loading,
    // Helpers legacy (back-compat avec les call-sites existants)
    supported: state !== "unknown" && state !== "unsupported",
    subscribed: state === "active",
    subscribe,
    unsubscribe,
    refresh,
  };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
