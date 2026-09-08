const CACHE_NAME = 'twins-vantage-v5.5-highspeed';
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './inventory_data.js',
  './device_images.js',
  './virtual_twin_renderer.js',
  './three_engine.js',
  './modals.js',
  './logo_twins.png',
  './manifest.json',
  './images/phone_iphone15_promax_titanium.png',
  './images/phone_samsung_s23_ultra.png',
  './images/phone_huawei_p30_pro.png',
  './images/phone_samsung_s22_ultra.png',
  './images/phone_samsung_s21_ultra_silver.png',
  './images/phone_samsung_s21_ultra_black.png',
  './images/phone_samsung_a35_5g.png',
  './images/phone_xiaomi_mi10t_pro.png',
  './images/phone_xiaomi_redmi_note13_blue.png',
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
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).catch(() => {})
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

// Cache-First for static assets, Network-First with Cache Fallback for dynamic data
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Bypass cache for live telemetry APIs
  if (url.includes('/api/system/live') || url.includes('/api/system/ping') || url.includes('/api/system/optimize')) {
    return;
  }

  // Cache-First for Images and Fonts
  if (url.includes('/images/') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.svg') || url.endsWith('.woff2')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Stale-While-Revalidate for core script and stylesheet
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
});
