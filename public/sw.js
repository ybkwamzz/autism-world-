const CACHE_NAME = 'autism-unmasked-v1';
const OFFLINE_URL = '/';

// Core assets to pre-cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
];

// Install Event: cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching core shell');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: clear old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: handle offline access and caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // We only want to handle same-origin requests or vital CDN assets (like Google Fonts)
  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFont = url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com');

  if (!isSameOrigin && !isGoogleFont) {
    return;
  }

  // API requests should bypass service worker cache or handle differently (we want real-time chat if possible, or fallback offline response)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            text: "Napata shida kidogo kuungana na mtandao. Lumo AI hawezi kujibu sasa hivi kwa sababu uko nje ya mtandao, lakini unaweza kutumia Zana za Tiba. / I'm having trouble connecting to the network right now. Lumo AI is unavailable offline, but your Toolkit resources are fully available!",
            isOffline: true
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Handle SPA navigation requests (e.g. /toolkit, /toolkit/cards, etc.)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        // If navigation fails (user is offline), return the cached index.html
        return caches.match(OFFLINE_URL) || caches.match('/index.html');
      })
    );
    return;
  }

  // For static assets (JS, CSS, images, fonts)
  // Use Stale-While-Revalidate: serve from cache immediately, fetch from network in background to update cache
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        // Only cache valid responses
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        console.warn('[Service Worker] Fetch failed for offline fallback:', request.url, err);
      });

      // Return cached response if we have it, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
