// SabrTime Service Worker v1.0
// Caches app for offline use

const CACHE_NAME = 'sabrtime-v1';
const URLS_TO_CACHE = [
  '/sabrtime/',
  '/sabrtime/index.html',
  '/sabrtime/manifest.json',
  'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Lateef:wght@300;400;700&display=swap',
];

// Install — cache all files
self.addEventListener('install', event => {
  console.log('[SabrTime SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SabrTime SW] Caching app files');
      return cache.addAll(URLS_TO_CACHE);
    }).catch(err => {
      console.log('[SabrTime SW] Cache failed:', err);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  console.log('[SabrTime SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => {
              console.log('[SabrTime SW] Deleting old cache:', key);
              return caches.delete(key);
            })
      )
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        return cached; // Serve from cache (works offline!)
      }
      return fetch(event.request).then(response => {
        // Cache new successful requests
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(() => {
        // Offline fallback — serve main app
        return caches.match('/sabrtime/index.html');
      });
    })
  );
});
