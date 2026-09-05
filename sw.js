const CACHE_NAME = 'twins-vantage-v2.3';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './device_images.js',
  './inventory_data.js',
  './three_scene.js',
  './three_engine.js',
  './modals.js',
  './logo_twins.png',
  './images/vantage_tuf_creator.jpg',
  './images/vantage_office_pc.jpg',
  './images/vantage_server_pc.jpg',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
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

self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
