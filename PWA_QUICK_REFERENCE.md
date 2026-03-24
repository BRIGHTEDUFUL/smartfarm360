# PWA Quick Reference Guide

**Version**: 3.2.0

---

## 🚀 Quick Start

### Test PWA Locally
```bash
# Start dev servers
npm run dev

# Open in browser
http://localhost:3000

# Open DevTools → Application → Service Workers
# Verify service worker is registered
```

### Test Installation
1. Open app in Chrome/Edge
2. Look for install icon in address bar
3. Click to install
4. App opens in standalone window

---

## 📱 Test on Mobile

### Android
1. Open in Chrome
2. Menu → "Add to Home Screen"
3. App installs
4. Open from home screen

### iOS
1. Open in Safari
2. Share button → "Add to Home Screen"
3. App installs
4. Open from home screen

---

## 🧪 Quick Tests

### 1. Offline Mode (30 seconds)
```
1. Open app
2. DevTools → Network → Offline
3. Refresh page
4. Should show offline page or cached content
5. Navigate to /shop
6. Should show cached products
```

### 2. Cache Check (10 seconds)
```
1. Open DevTools → Application → Cache Storage
2. Should see 5 caches:
   - smart-farming-v3.2.0
   - smart-farming-runtime-v3.2.0
   - smart-farming-images-v3.2.0
   - smart-farming-api-v3.2.0
   - smart-farming-fonts-v3.2.0
```

### 3. Update Notification (1 minute)
```
1. Change CACHE_VERSION in service-worker.js
2. Reload app
3. Should see update banner at top
4. Click "Update Now"
5. App reloads with new version
```

### 4. Online/Offline Toasts (30 seconds)
```
1. Open app
2. DevTools → Network → Offline
3. Should see red "You are offline" toast
4. Network → Online
5. Should see green "Back online" toast
```

### 5. App Shortcuts (10 seconds)
```
1. Install app
2. Right-click app icon
3. Should see 4 shortcuts:
   - Shop Products
   - My Orders
   - Shopping Cart
   - Contact Us
```

---

## 🔧 Configuration Files

### Service Worker
**File**: `frontend/public/service-worker.js`
**Version**: Line 1 - `const CACHE_VERSION = '3.2.0'`
**Cache Limits**: Lines 14-16
**Expiration**: Lines 19-20

### Manifest
**File**: `frontend/public/manifest.json`
**Name**: Line 2
**Theme Color**: Line 6
**Shortcuts**: Lines 60-110

### HTML Meta Tags
**File**: `frontend/index.html`
**PWA Tags**: Lines 8-60
**Icons**: Lines 20-30

### SW Registration
**File**: `frontend/src/main.tsx`
**Registration**: Lines 6-150
**Update Check**: Line 18

---

## 📊 Cache Strategy

| Resource Type | Strategy | Expiration | Max Size |
|--------------|----------|------------|----------|
| Static Assets | Cache First | Permanent | 50 |
| API Responses | Network First | 5 minutes | 30 |
| Images | Cache First | 24 hours | 50 |
| Fonts | Cache First | Permanent | - |
| Runtime | Stale-While-Revalidate | - | 50 |

---

## 🎯 Features

### ✅ Implemented
- [x] Service worker with versioning
- [x] Smart caching strategies
- [x] Cache size limits
- [x] Cache expiration
- [x] Offline support
- [x] Update notifications
- [x] Online/offline indicators
- [x] Background sync
- [x] Periodic sync
- [x] App shortcuts
- [x] Share target API
- [x] Protocol handlers
- [x] iOS splash screens
- [x] Windows tiles
- [x] Maskable icons

### 🎨 User Experience
- Visual update banner
- Toast notifications
- Smooth animations
- Non-intrusive design
- Native app feel

---

## 🐛 Troubleshooting

### Service Worker Not Registering
```javascript
// Check in console
navigator.serviceWorker.getRegistration()
  .then(reg => console.log('SW:', reg))
  .catch(err => console.error('SW Error:', err));
```

### Cache Not Working
```javascript
// Check cache contents
caches.keys().then(names => {
  console.log('Caches:', names);
});
```

### Update Not Showing
```javascript
// Force update check
navigator.serviceWorker.getRegistration()
  .then(reg => reg.update());
```

### Clear Everything
```javascript
// Clear all caches
caches.keys().then(names => {
  return Promise.all(names.map(name => caches.delete(name)));
}).then(() => {
  console.log('All caches cleared');
  location.reload();
});
```

---

## 📱 Platform-Specific

### iOS Safari
- Uses apple-touch-icon
- Splash screens for all devices
- Status bar styling
- Standalone mode

### Android Chrome
- Install prompt
- Maskable icons
- Theme color
- Shortcuts

### Windows Edge
- Tiles configuration
- Side panel support
- Window controls overlay

### Desktop Chrome/Edge
- Install as desktop app
- Standalone window
- Shortcuts
- Share target

---

## 🎉 Quick Wins

### Improve Lighthouse Score
1. Enable HTTPS
2. Optimize images
3. Minify CSS/JS
4. Enable compression
5. Add meta tags

### Enhance Offline Experience
1. Cache more pages
2. Add offline forms
3. Queue failed requests
4. Show offline indicator

### Better Performance
1. Lazy load images
2. Code splitting
3. Preload critical assets
4. Use CDN

---

## 📞 Support

### Check PWA Status
- Chrome: `chrome://serviceworker-internals/`
- Edge: `edge://serviceworker-internals/`
- Firefox: `about:debugging#/runtime/this-firefox`

### Test Tools
- Lighthouse (DevTools → Lighthouse)
- PWA Builder (pwabuilder.com)
- Web.dev Measure (web.dev/measure)

### Common Issues
1. **HTTPS Required**: PWA only works on HTTPS
2. **Manifest Required**: Must have valid manifest.json
3. **Icons Required**: Need 192x192 and 512x512 icons
4. **Service Worker Required**: Must register SW

---

## ✅ Checklist

### Before Deployment
- [ ] Test on Chrome (desktop)
- [ ] Test on Chrome (mobile)
- [ ] Test on Safari (iOS)
- [ ] Test on Edge (desktop)
- [ ] Test offline mode
- [ ] Test update flow
- [ ] Test shortcuts
- [ ] Run Lighthouse
- [ ] Check manifest
- [ ] Verify icons

### After Deployment
- [ ] Test install on production
- [ ] Verify HTTPS
- [ ] Check service worker
- [ ] Test offline
- [ ] Monitor errors
- [ ] Check analytics

---

**Version**: 3.2.0  
**Status**: Production Ready ✅  
**Last Updated**: March 24, 2026
