/* Service worker for the Crypto Scanner PWA.
   Its only job: keep a handle alive so notifications can be shown,
   and focus/open the app when the user taps an alert. */

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // Focus an existing tab if there is one
      for (const c of list) {
        if ('focus' in c) return c.focus();
      }
      // Otherwise open a new one
      if (self.clients.openWindow) return self.clients.openWindow('./index.html');
    })
  );
});