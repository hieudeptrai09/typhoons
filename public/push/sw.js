self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {};
  }

  const title = payload.title || "Cá Tra's Typhoons App";
  const url = payload.url || "/";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.body || "",
      icon: "/web-app-manifest-192x192.png",
      badge: "/icon.png",
      tag: payload.tag || url,
      data: { url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      // Reuse a tab that already has the app open rather than piling up windows.
      for (const client of clients) {
        if (new URL(client.url).origin === self.location.origin) {
          await client.focus();
          if ("navigate" in client) await client.navigate(url);
          return;
        }
      }

      await self.clients.openWindow(url);
    })(),
  );
});
