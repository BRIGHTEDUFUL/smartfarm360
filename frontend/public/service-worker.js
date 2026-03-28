const CACHE_VERSION = 'v1';
const STATIC_CACHE = `smart-farming-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `smart-farming-runtime-${CACHE_VERSION}`;
const IMAGE_CACHE = `smart-farming-images-${CACHE_VERSION}`;
const API_CACHE = `smart-farming-api-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  // Add more static assets as needed
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => !key.includes(CACHE_VERSION)).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(API_CACHE).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Images
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(cache =>
        cache.match(request).then(response =>
          response || fetch(request).then(networkResponse => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          }).catch(() => caches.match('/images/placeholder.png'))
        )
      )
    );
    return;
  }

  // Static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then(response =>
        response || fetch(request).then(networkResponse => {
          caches.open(STATIC_CACHE).then(cache => cache.put(request, networkResponse.clone()));
          return networkResponse;
        })
      )
    );
    return;
  }

  // Fallback for navigation (offline)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Default: try runtime cache
  event.respondWith(
    caches.open(RUNTIME_CACHE).then(cache =>
      cache.match(request).then(response =>
        response || fetch(request).then(networkResponse => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        })
      )
    )
  );
});

// Listen for skipWaiting message
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
