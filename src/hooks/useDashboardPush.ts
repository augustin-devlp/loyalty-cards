"use client";

import { useEffect, useState } from "react";

/**
 * Gestion des Web Push pour le dashboard Rialto.
 * Réutilise le Service Worker `/sw.js` généré par next-pwa (étendu via
 * worker/index.js avec un handler `push`). Chaque souscription est liée à
 * un restaurant_id dans la table push_subscriptions.
 */
export function useDashboardPush(restaurantId: string) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window;
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
    } catch {
      setSubscribed(false);
    }
  }

  async function registerSW() {
    const reg = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;
    return reg;
  }

  async function subscribe(): Promise<boolean> {
    setLoading(true);
    try {
      const reg = await registerSW();
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        return false;
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
        ) as unknown as ArrayBuffer,
      });
      const res = await fetch("/api/push/dashboard-subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          subscription: sub.toJSON(),
        }),
      });
      if (!res.ok) {
        await sub.unsubscribe();
        return false;
      }
      setSubscribed(true);
      return true;
    } catch (err) {
      console.error("[dashboardPush] subscribe error", err);
      return false;
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
      await fetch("/api/push/dashboard-subscribe", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });
      await sub.unsubscribe();
      setSubscribed(false);
    } finally {
      setLoading(false);
    }
  }

  return { subscribed, supported, loading, subscribe, unsubscribe };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
