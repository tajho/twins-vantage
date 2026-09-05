const CACHE_NAME = 'twins-vantage-v4.0-worldclass';
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
  './manifest.json',
  './images/monitor_lg_27_ips.jpg',
  './images/monitor_asus_proart.jpg',
  './images/monitor_samsung_s24r350.jpg',
  './images/monitor_lg_ultrawide.jpg',
  './images/monitor_asus_24_fhd.jpg',
  './images/monitor_rack_console.jpg',
  './images/setup_it_master.jpg',
  './images/setup_marketing_proart.jpg',
  './images/setup_admin_samsung.jpg',
  './images/setup_video_ultrawide.jpg',
  './images/setup_office_asus.jpg',
  './images/setup_server_rack.jpg'
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

// Network-First for core code & data, cache fallback for offline
self.addEventListener('fetch', event => {
  const url = event.request.url;

  if (url.includes('.json') || url.includes('.css') || url.includes('.js') || url.includes('.html') || event.request.mode === 'navigate') {
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
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request);
      })
    );
  }
});

