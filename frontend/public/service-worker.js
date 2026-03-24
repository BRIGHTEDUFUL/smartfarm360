const CACHE_VERSION = '3.2.0';
const CACHE_NAME = `smart-farming-v${CACHE_VERSION}`;
const RUNTIME_CACHE = `smart-farming-runtime-v${CACHE_VERSION}`;
const IMAGE_CACHE = `smart-farming-images-v${CACHE_VERSION}`;
const API_CACHE = `smart-farming-api-v${CACHE_VERSION}`;
const FONT_CACHE = `smart-farming-fonts-v${CACHE_VERSION}`;

// Critical assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Maximum cache sizes
const MAX_IMAGE_CACHE_SIZE = 50;
const MAX_API_CACHE_SIZE = 30;
const MAX_RUNTIME_CACHE_SIZE = 50;

// Cache expiration times (in milliseconds)
const API_CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes
const IMAGE_CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing service worker v${CACHE_VERSION}...`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating service worker v${CACHE_VERSION}...`);
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => 
              name !== CACHE_NAME && 
              name !== RUNTIME_CACHE && 
              name !== IMAGE_CACHE &&
              name !== API_CACHE &&
              name !== FONT_CACHE
            )
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      }),
      // Take control of all clients immediately
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Service worker activated successfully');
      // Notify all clients about the update
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: CACHE_VERSION
          });
        });
      });
    })
  );
});

// Helper: Check if cache entry is expired
function isCacheExpired(response, maxAge) {
  if (!response) return true;
  
  const cachedTime = response.headers.get('sw-cache-time');
  if (!cachedTime) return true;
  
  const age = Date.now() - parseInt(cachedTime);
  return age > maxAge;
}

// Helper: Add timestamp to cached response
function addCacheTimestamp(response) {
  const headers = new Headers(response.headers);
  headers.append('sw-cache-time', Date.now().toString());
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

// Helper: Limit cache size
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
    console.log(`[SW] Trimmed ${cacheName} cache to ${maxSize} entries`);
  }
}

// Helper: Create offline response
function createOfflineResponse(type = 'page') {
  if (type === 'api') {
    return new Response(
      JSON.stringify({ 
        error: 'You are offline',
        offline: true,
        message: 'Please check your internet connection'
      }),
      { 
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        } 
      }
    );
  }
  
  if (type === 'image') {
    return new Response(
      `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#f3f4f6"/>
        <text x="50%" y="45%" text-anchor="middle" fill="#6b7280" font-size="16" font-family="Arial">
          Image unavailable
        </text>
        <text x="50%" y="55%" text-anchor="middle" fill="#9ca3af" font-size="12" font-family="Arial">
          You are offline
        </text>
      </svg>`,
      { 
        headers: { 
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-store'
        } 
      }
    );
  }
  
  return caches.match('/offline.html');
}

// Fetch event - smart caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome extensions and other protocols
  if (!url.protocol.startsWith('http')) return;

  // API requests - network first with cache fallback and expiration
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response.ok) {
            // Cache products and orders for offline access
            if (url.pathname.includes('/products') || 
                url.pathname.includes('/orders') ||
                url.pathname.includes('/categories')) {
              const responseWithTimestamp = addCacheTimestamp(response.clone());
              caches.open(API_CACHE).then((cache) => {
                cache.put(request, responseWithTimestamp);
                limitCacheSize(API_CACHE, MAX_API_CACHE_SIZE);
              });
            }
          }
          return response;
        })
        .catch(() => {
          // Try to return cached API response if not expired
          return caches.open(API_CACHE).then((cache) => {
            return cache.match(request).then((cachedResponse) => {
              if (cachedResponse && !isCacheExpired(cachedResponse, API_CACHE_EXPIRATION)) {
                console.log('[SW] Serving cached API response:', url.pathname);
                // Add offline header
                const headers = new Headers(cachedResponse.headers);
                headers.append('X-Offline-Response', 'true');
                return new Response(cachedResponse.body, {
                  status: cachedResponse.status,
                  statusText: cachedResponse.statusText,
                  headers: headers
                });
              }
              return createOfflineResponse('api');
            });
          });
        })
    );
    return;
  }

  // Images - cache first with network fallback and size limit
  if (request.destination === 'image' || 
      url.pathname.includes('/images/') || 
      url.pathname.includes('/uploads/')) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          // Return cached image if not expired
          if (cachedResponse && !isCacheExpired(cachedResponse, IMAGE_CACHE_EXPIRATION)) {
            // Update in background if online
            fetch(request).then((response) => {
              if (response.ok) {
                const responseWithTimestamp = addCacheTimestamp(response);
                cache.put(request, responseWithTimestamp);
              }
            }).catch(() => {});
            return cachedResponse;
          }

          // Fetch from network
          return fetch(request).then((response) => {
            if (response.ok) {
              const responseWithTimestamp = addCacheTimestamp(response.clone());
              cache.put(request, responseWithTimestamp);
              limitCacheSize(IMAGE_CACHE, MAX_IMAGE_CACHE_SIZE);
            }
            return response;
          }).catch(() => {
            return createOfflineResponse('image');
          });
        });
      })
    );
    return;
  }

  // Fonts - cache first, network fallback
  if (request.destination === 'font' || url.pathname.includes('/fonts/')) {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Static assets and pages - stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((response) => {
        if (response.ok) {
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, response.clone());
            limitCacheSize(RUNTIME_CACHE, MAX_RUNTIME_CACHE_SIZE);
          });
        }
        return response;
      }).catch(() => {
        return createOfflineResponse('page');
      });

      // Return cached version immediately if available
      return cachedResponse || fetchPromise;
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Smart Farming 360';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: data.actions || [],
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if not
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync event (for offline order submission)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

// Sync pending orders when back online
async function syncOrders() {
  try {
    const cache = await caches.open('pending-orders');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
          console.log('[SW] Order synced successfully');
        }
      } catch (error) {
        console.error('[SW] Failed to sync order:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

// Message event - for communication with app
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0]?.postMessage({ success: true });
      })
    );
  }
  
  if (event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(
      Promise.all([
        caches.open(CACHE_NAME).then(cache => cache.keys()),
        caches.open(RUNTIME_CACHE).then(cache => cache.keys()),
        caches.open(IMAGE_CACHE).then(cache => cache.keys()),
        caches.open(API_CACHE).then(cache => cache.keys()),
        caches.open(FONT_CACHE).then(cache => cache.keys()),
      ]).then(([static_keys, runtime_keys, image_keys, api_keys, font_keys]) => {
        event.ports[0]?.postMessage({
          static: static_keys.length,
          runtime: runtime_keys.length,
          images: image_keys.length,
          api: api_keys.length,
          fonts: font_keys.length,
          total: static_keys.length + runtime_keys.length + image_keys.length + api_keys.length + font_keys.length
        });
      })
    );
  }
  
  if (event.data.type === 'PREFETCH_PAGES') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(urls);
      }).then(() => {
        event.ports[0]?.postMessage({ success: true, prefetched: urls.length });
      }).catch((error) => {
        event.ports[0]?.postMessage({ success: false, error: error.message });
      })
    );
  }
});

// Periodic background sync (for checking updates)
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync triggered:', event.tag);
  
  if (event.tag === 'check-updates') {
    event.waitUntil(checkForUpdates());
  }
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncPendingData());
  }
});

// Check for app updates
async function checkForUpdates() {
  try {
    const response = await fetch('/manifest.json', { cache: 'no-store' });
    if (response.ok) {
      console.log('[SW] Checked for updates');
      // Notify clients if update available
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: 'UPDATE_AVAILABLE',
          version: CACHE_VERSION
        });
      });
    }
  } catch (error) {
    console.error('[SW] Failed to check for updates:', error);
  }
}

// Sync pending data when online
async function syncPendingData() {
  try {
    const cache = await caches.open('pending-data');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
          console.log('[SW] Data synced successfully');
        }
      } catch (error) {
        console.error('[SW] Failed to sync data:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}
