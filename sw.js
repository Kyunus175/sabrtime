// SabrTime Service Worker v11
// Strategy: Cache-First for static, Stale-While-Revalidate for duas

const CACHE_NAME = 'sabrtime-v15';
const STATIC_ASSETS = [
  '/sabrtime/',
  '/sabrtime/index.html',
  '/sabrtime/manifest.json',
];

// Install — cache static assets
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Prayer time API — Stale-While-Revalidate
  if(url.hostname.includes('aladhan.com')){
    e.respondWith(staleWhileRevalidate(e.request));
    return;
  }

  // Google Fonts — Cache First
  if(url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')){
    e.respondWith(cacheFirst(e.request));
    return;
  }

  // App shell — Cache First
  if(url.pathname.startsWith('/sabrtime')){
    e.respondWith(cacheFirst(e.request));
    return;
  }

  // Default — network
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

async function cacheFirst(request){
  const cached = await caches.match(request);
  if(cached) return cached;
  try{
    const response = await fetch(request);
    if(response.ok){
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch(e){
    return cached || new Response('Offline', {status: 503});
  }
}

async function staleWhileRevalidate(request){
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(response => {
    if(response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);
  return cached || fetchPromise;
}
