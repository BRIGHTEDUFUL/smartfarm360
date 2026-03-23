# PWA Testing Guide - Smart Farming 360

## Quick Start

1. Build and start the app:
```bash
npm start
```

2. Open browser: http://localhost:5000

## Test Checklist

### ✅ Installation
- [ ] Install prompt appears at bottom of screen
- [ ] Click "Install" button
- [ ] App installs to home screen/desktop
- [ ] App opens in standalone mode (no browser UI)
- [ ] App icon appears correctly

### ✅ Offline Support
- [ ] Open DevTools (F12) → Network tab
- [ ] Select "Offline" from throttling dropdown
- [ ] Refresh page → Should show offline page
- [ ] Navigate to /shop → Should show cached products
- [ ] Navigate to /orders → Should show cached orders
- [ ] Images load from cache
- [ ] Go back online → "Back Online" indicator appears

### ✅ Service Worker
- [ ] Open DevTools → Application tab → Service Workers
- [ ] Service worker shows as "activated and running"
- [ ] Check Cache Storage → Should see 4 caches:
  - smart-farming-v1 (static assets)
  - smart-farming-runtime (dynamic content)
  - smart-farming-images (product images)
  - smart-farming-api (API responses)

### ✅ Notifications
- [ ] Go to /orders page
- [ ] See "Enable Notifications" card
- [ ] Click "Enable" button
- [ ] Grant permission when prompted
- [ ] Test notification appears
- [ ] Card changes to "Notifications Enabled"

### ✅ Offline Indicator
- [ ] Turn off network (airplane mode or DevTools offline)
- [ ] Red "You're Offline" indicator appears at top
- [ ] Turn on network
- [ ] Green "Back Online" indicator appears
- [ ] Indicator auto-hides after 3 seconds

### ✅ Manifest
- [ ] Open DevTools → Application tab → Manifest
- [ ] Check all fields are populated:
  - Name: "Smart Farming 360 - Ghana's Agricultural Marketplace"
  - Short name: "Smart Farming 360"
  - Theme color: #10B981
  - Background color: #0a3d0a
  - Display: standalone
  - Icons: 10 icons listed
  - Shortcuts: 3 shortcuts (Shop, Orders, Cart)

### ✅ Lighthouse Audit
- [ ] Open DevTools → Lighthouse tab
- [ ] Select "Progressive Web App" category
- [ ] Click "Analyze page load"
- [ ] Score should be ≥ 90
- [ ] All PWA checks should pass

## Advanced Testing

### Background Sync (Chrome/Edge only)
1. Open DevTools → Application → Background Sync
2. Go offline
3. Try to place an order (will be saved locally)
4. Go back online
5. Check DevTools → Background Sync shows "sync-orders"
6. Order should sync automatically

### Push Notifications (Requires backend setup)
1. Enable notifications on /orders page
2. Backend sends push notification
3. Notification appears in system tray
4. Click notification → Opens relevant page

### Update Detection
1. Make a change to the app
2. Rebuild: `npm run build`
3. Refresh browser
4. Should see "New version available! Reload to update?"
5. Click OK → App updates

### Cache Strategies
1. **Static Assets** (Cache-first):
   - Load /shop page
   - Go offline
   - Reload page → Loads instantly from cache

2. **API Calls** (Network-first with fallback):
   - Load /products
   - Go offline
   - Reload → Shows cached products

3. **Images** (Cache-first):
   - View product images
   - Go offline
   - Images still load from cache

## Browser-Specific Tests

### Chrome/Edge (Desktop)
- [ ] Install via address bar icon
- [ ] Install via menu → "Install Smart Farming 360"
- [ ] App appears in Start Menu/Applications
- [ ] Uninstall via chrome://apps

### Chrome (Android)
- [ ] Install prompt appears
- [ ] Add to home screen
- [ ] App opens fullscreen
- [ ] Splash screen shows
- [ ] Status bar matches theme color

### Safari (iOS)
- [ ] Share → Add to Home Screen
- [ ] App icon appears on home screen
- [ ] App opens in standalone mode
- [ ] Status bar is translucent

### Firefox
- [ ] Service worker registers
- [ ] Offline mode works
- [ ] No install prompt (expected)

## Performance Tests

### First Load
- [ ] Open DevTools → Network tab
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Check total size: Should be ~355KB
- [ ] Check gzipped size: Should be ~103KB
- [ ] Load time: Should be < 3 seconds

### Cached Load
- [ ] Visit page once
- [ ] Refresh page
- [ ] Load time: Should be < 500ms
- [ ] Most resources from cache

### Offline Load
- [ ] Visit page once
- [ ] Go offline
- [ ] Refresh page
- [ ] Load time: Should be < 200ms
- [ ] All resources from cache

## Common Issues

### Service Worker Not Registering
**Problem**: Console shows "SW registration failed"
**Solution**: 
- Ensure you're on HTTPS or localhost
- Clear browser cache
- Check for JavaScript errors

### Install Prompt Not Showing
**Problem**: No install prompt appears
**Solution**:
- Check browser supports PWA (Chrome, Edge, Safari)
- Ensure manifest.json is valid
- Check service worker is registered
- May have been dismissed before (check localStorage)

### Notifications Not Working
**Problem**: Enable button doesn't work
**Solution**:
- Check browser supports notifications
- Ensure HTTPS connection
- Check browser permissions
- Try in incognito mode

### Offline Mode Not Working
**Problem**: App doesn't work offline
**Solution**:
- Check service worker is active
- Verify cache storage has content
- Check console for errors
- Try hard refresh when online first

### Images Not Loading Offline
**Problem**: Images show placeholder
**Solution**:
- Visit pages with images while online first
- Check image cache in DevTools
- Verify image URLs are correct

## Success Criteria

✅ **Installation**: App installs on all supported platforms
✅ **Offline**: App works offline with cached content
✅ **Performance**: Lighthouse PWA score ≥ 90
✅ **Notifications**: Users can enable and receive notifications
✅ **Updates**: App detects and prompts for updates
✅ **Caching**: Smart caching reduces data usage by 90%+
✅ **Sync**: Background sync works when connection restored

## Next Steps After Testing

1. Generate proper app icons (currently using placeholders)
2. Add app screenshots to manifest
3. Set up backend push notification service
4. Monitor cache hit rates in production
5. Optimize cache TTL based on usage patterns
6. Add analytics to track PWA metrics
7. Test on real devices (not just DevTools)
8. Get user feedback on offline experience

## Reporting Issues

If you find issues during testing:
1. Note the browser and version
2. Check console for errors
3. Check DevTools → Application tab
4. Note steps to reproduce
5. Check if issue persists in incognito mode
