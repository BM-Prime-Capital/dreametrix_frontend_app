// This is an empty service worker file to prevent 404 errors
// The app doesn't actually use service workers yet, but something is requesting it

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // No custom fetch handling needed yet
  // Just let the browser handle the request normally
});