// MR/STOCKS web-push service worker.
// Receives the JSON payload sent by web-push and surfaces a native
// notification. Clicking focuses any existing window or opens /dashboard.

self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: 'MR/STOCKS', body: event.data.text() };
  }
  const title = data.title || 'MR/STOCKS';
  const opts = {
    body: data.body || '',
    data: { url: data.url || 'https://mrstocks.cash/dashboard' },
    icon: '/icon-192.png',
    badge: '/icon-192.png',
  };
  event.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    (async () => {
      const all = await clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const c of all) {
        if ('focus' in c && c.url.includes(new URL(url).origin)) {
          return c.focus();
        }
      }
      return clients.openWindow(url);
    })(),
  );
});
