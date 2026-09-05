const CACHE_NAME = 'twins-vantage-v3.2-live';
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './device_images.js',
  './virtual_twin_renderer.js',
  './three_scene.js',
  './three_engine.js',
  './modals.js',
  './logo_twins.png',
  './manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First for Data & Dynamic files, Stale-While-Revalidate for Assets
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Always Network-First for inventory data, json, and live APIs
  if (url.includes('inventory_data') || url.includes('/api/') || url.endsWith('.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Stale-While-Revalidate for other static assets
    event.respondWith(
      caches.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return networkResponse;
        }).catch(() => cached);

        return cached || fetchPromise;
      })
    );
  }
});

