/* eslint-disable no-undef */
/**
 * Custom Service Worker code injected by next-pwa into public/sw.js.
 * Ajoute le handler push + notificationclick (le caching workbox reste géré
 * par next-pwa).
 */

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload = {};
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Stampify", body: event.data.text() };
  }

  const title = payload.title || "Stampify";
  const options = {
    body: payload.body || "",
    icon: payload.icon || "/icon-192.svg",
    badge: "/icon-192.svg",
    tag: payload.tag || "stampify",
    data: { url: payload.url || "/" },
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const client of all) {
        try {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        } catch {
          // ignore
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })(),
  );
});
