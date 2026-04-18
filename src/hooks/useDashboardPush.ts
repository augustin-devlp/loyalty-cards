"use client";

import { useEffect, useState } from "react";

export type PushError =
  | "unsupported"
  | "missing-vapid"
  | "permission-denied"
  | "sw-register-failed"
  | "subscribe-failed"
  | "network";

/**
 * Gestion des Web Push pour le dashboard Rialto.
 * Chaque souscription est liée à un restaurant_id dans push_subscriptions.
 * Réutilise le SW `/sw.js` généré par next-pwa + enrichi par `worker/index.js`
 * (handler push + notificationclick).
 */
export function useDashboardPush(restaurantId: string) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);
  const [lastError, setLastError] = useState<PushError | null>(null);

  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      typeof Notification !== "undefined";
    setSupported(ok);
    if (!ok) return;
    void checkSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  async function checkSubscription() {
    try {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      if (!reg) {
        setSubscribed(false);
        return;
      }
      const sub = await reg.pushManager.getSubscription();
      setSubscribed(!!sub);
    } catch (err) {
      console.error("[push] checkSubscription failed", err);
      setSubscribed(false);
    }
  }

  async function registerSW(): Promise<ServiceWorkerRegistration> {
    // En dev next-pwa est désactivé => /sw.js n'existe pas.
    // On essaie quand même pour afficher une erreur claire.
    const reg = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;
    return reg;
  }

  async function subscribe(): Promise<
    { ok: true } | { ok: false; error: PushError; message: string }
  > {
    setLoading(true);
    setLastError(null);
    try {
      // 1. Support check
      if (!supported) {
        setLastError("unsupported");
        return {
          ok: false,
          error: "unsupported",
          message:
            "Votre navigateur ne supporte pas les notifications push (essayez Chrome ou Firefox).",
        };
      }

      // 2. VAPID public key check
      const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapid) {
        console.error("[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY missing at runtime");
        setLastError("missing-vapid");
        return {
          ok: false,
          error: "missing-vapid",
          message:
            "Configuration serveur incomplète (clé VAPID publique manquante). Contactez le support.",
        };
      }

      // 3. Service Worker
      let reg: ServiceWorkerRegistration;
      try {
        reg = await registerSW();
      } catch (err) {
        console.error("[push] SW register failed", err);
        setLastError("sw-register-failed");
        return {
          ok: false,
          error: "sw-register-failed",
          message:
            "Impossible d'activer le service worker. Rechargez la page ou essayez en navigation normale (pas incognito).",
        };
      }

      // 4. Permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setLastError("permission-denied");
        return {
          ok: false,
          error: "permission-denied",
          message:
            permission === "denied"
              ? "Permission refusée. Pour réactiver : icône du cadenas dans la barre d'URL → Notifications → Autoriser."
              : "Autorisation non accordée.",
        };
      }

      // 5. Subscribe
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
        setLastError("subscribe-failed");
        return {
          ok: false,
          error: "subscribe-failed",
          message: `Erreur technique lors de l'abonnement : ${
            err instanceof Error ? err.message : "inconnue"
          }`,
        };
      }

      // 6. Send to our backend
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
          setLastError("network");
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
        setLastError("network");
        return {
          ok: false,
          error: "network",
          message: "Impossible de contacter le serveur Stampify.",
        };
      }

      setSubscribed(true);
      return { ok: true };
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribe(): Promise<void> {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      if (!reg) {
        setSubscribed(false);
        return;
      }
      const sub = await reg.pushManager.getSubscription();
      if (!sub) {
        setSubscribed(false);
        return;
      }
      try {
        await fetch("/api/push/dashboard-subscribe", {
          method: "DELETE",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
      } catch (err) {
        console.warn("[push] backend delete failed (non-bloquant)", err);
      }
      await sub.unsubscribe();
      setSubscribed(false);
    } finally {
      setLoading(false);
    }
  }

  return { subscribed, supported, loading, lastError, subscribe, unsubscribe };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
