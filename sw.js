/* Service worker for the Crypto Scanner PWA.
   Keeps a handle alive so notifications can be shown,
   focuses/opens the app when the user taps an alert,
   and provides a fetch handler so the PWA is installable. */

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

/* A pass-through fetch handler. The browser handles the request
   normally (network), but the mere existence of this listener
   is what Chrome/Android requires for "Add to Home Screen". */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // No respondWith() = default network behaviour.
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ('focus' in c) return c.focus();
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(self.registration.scope);
      }
    })
  );
});