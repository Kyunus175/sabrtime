// SabrTime Service Worker v12
// Optimized for Lighthouse 90+ Performance

const CACHE = 'sabrtime-v12';
const FONT_CACHE = 'sabrtime-fonts-v1';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
];

// Install — precache app shell
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE && k !== FONT_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Google Fonts — Cache First (long lived)
  if(url.hostname.includes('fonts.gstatic.com') ||
     url.hostname.includes('fonts.googleapis.com')){
    e.respondWith(
      caches.open(FONT_CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if(cached) return cached;
          return fetch(e.request).then(resp => {
            cache.put(e.request, resp.clone());
            return resp;
          });
        })
      )
    );
    return;
  }

  // Prayer API — Stale While Revalidate
  if(url.hostname.includes('aladhan.com')){
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          const fetchPromise = fetch(e.request).then(resp => {
            if(resp.ok) cache.put(e.request, resp.clone());
            return resp;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // App Shell — Cache First with network fallback
  if(url.pathname.startsWith('/sabrtime') ||
     url.hostname === 'kyunus175.github.io'){
    e.respondWith(
      caches.match(e.request).then(cached => {
        if(cached) return cached;
        return fetch(e.request).then(resp => {
          if(resp.ok){
            caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
          }
          return resp;
        }).catch(() => caches.match('./index.html'));
      })
    );
    return;
  }

  // Default — network first
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
