# Mobile Testing Guide - Android

**How to Test Smart Farming 360 on Your Android Phone**

---

## 🚀 Quick Start (Easiest Method)

### Method 1: Use Your Computer's IP Address (Recommended)

**Step 1: Find Your Computer's IP Address**

On Windows:
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x)

Example: `192.168.1.100`

**Step 2: Configure Vite (Already Done!)**
The Vite config has been updated to accept external connections with `host: true`.

**Step 3: Start Your Dev Servers**
```bash
npm run dev
```

You should see output like:
```
➜  Local:   http://localhost:3000/
➜  Network: http://192.168.1.40:3000/
```

**Step 4: Connect Your Phone**
- Make sure your phone and computer are on the SAME WiFi network
- Open Chrome on your Android phone
- Type in the address bar: `http://192.168.1.100:3000` (replace with YOUR IP)
- Press Enter

**That's it!** Your app should load on your phone.

---

## 📱 Method 2: USB Debugging (Most Reliable)

### Setup (One-Time)

**On Your Android Phone:**
1. Go to Settings → About Phone
2. Tap "Build Number" 7 times (enables Developer Mode)
3. Go back to Settings → Developer Options
4. Enable "USB Debugging"

**On Your Computer:**
1. Install Android SDK Platform Tools:
   - Download from: https://developer.android.com/studio/releases/platform-tools
   - Extract to a folder (e.g., `C:\platform-tools`)

**Step 1: Connect Phone to Computer**
- Connect your Android phone via USB cable
- On phone, allow "USB Debugging" when prompted

**Step 2: Verify Connection**
```bash
cd C:\platform-tools
adb devices
```
You should see your device listed.

**Step 3: Setup Port Forwarding**
```bash
adb reverse tcp:3000 tcp:3000
adb reverse tcp:5000 tcp:5000
```

**Step 4: Start Dev Servers**
```bash
npm run dev
```

**Step 5: Open on Phone**
- Open Chrome on your Android phone
- Go to: `http://localhost:3000`

**Done!** Your app loads as if it's running on your phone.

---

## 🌐 Method 3: Expose to Internet (For Remote Testing)

### Using ngrok (Free)

**Step 1: Install ngrok**
- Download from: https://ngrok.com/download
- Extract to a folder
- Sign up for free account at ngrok.com
- Get your auth token

**Step 2: Setup ngrok**
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

**Step 3: Start Dev Servers**
```bash
npm run dev
```

**Step 4: Expose Frontend (New Terminal)**
```bash
ngrok http 3000
```

**Step 5: Expose Backend (Another Terminal)**
```bash
ngrok http 5000
```

**Step 6: Update Frontend .env**
Copy the backend ngrok URL (e.g., `https://abc123.ngrok.io`)

Update `frontend/.env`:
```env
VITE_API_URL=https://abc123.ngrok.io/api
```

Restart frontend.

**Step 7: Open on Phone**
- Use the frontend ngrok URL on your phone
- Example: `https://xyz789.ngrok.io`

**Works from anywhere!** Even outside your home network.

---

## 🔍 Method 4: Chrome DevTools (Desktop Simulation)

**Quick Test Without Phone:**

1. Open Chrome on your computer
2. Go to: `http://localhost:3000`
3. Press `F12` (open DevTools)
4. Click the device icon (Toggle Device Toolbar) or press `Ctrl+Shift+M`
5. Select a device from dropdown (e.g., "Pixel 5", "Galaxy S20")
6. Test touch interactions with mouse

**Limitations:**
- Not real touch events
- Can't test actual device features
- Good for quick visual checks only

---

## ✅ Testing Checklist

### Basic Functionality
- [ ] App loads on phone
- [ ] All buttons respond to touch
- [ ] Forms can be filled
- [ ] Navigation works
- [ ] Images load
- [ ] Scroll works smoothly

### Touch & Input
- [ ] Buttons easy to tap (not too small)
- [ ] No double-tap required
- [ ] Inputs don't zoom when focused
- [ ] Checkboxes easy to select
- [ ] Dropdowns work properly
- [ ] Links work on first tap

### PWA Features
- [ ] Install prompt appears
- [ ] Can add to home screen
- [ ] Opens in standalone mode
- [ ] Offline mode works
- [ ] Service worker registers

### Performance
- [ ] Pages load quickly
- [ ] Smooth animations
- [ ] No lag when scrolling
- [ ] Images load fast
- [ ] Forms submit quickly

### Visual
- [ ] Text is readable
- [ ] Colors look good
- [ ] Layout not broken
- [ ] Images not distorted
- [ ] Buttons properly sized

---

## 🐛 Troubleshooting

### Can't Connect via IP Address

**Problem:** Phone can't reach `http://192.168.x.x:3000`

**Solutions:**
1. **Check Vite is configured for external connections** (Already done! ✅)
2. Check both devices on same WiFi network
3. **Add Windows Firewall rule** (Most common issue):
   ```bash
   netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=3000
   ```
4. Or temporarily disable Windows Firewall to test:
   - Windows Security → Firewall & network protection → Turn off
5. Verify Vite shows Network URL when starting:
   ```
   ➜  Network: http://192.168.1.40:3000/
   ```
6. Try different IP address (you might have multiple network adapters)
7. Check if port 3000 is accessible:
   ```bash
   netstat -an | findstr :3000
   ```

### USB Debugging Not Working

**Problem:** `adb devices` shows no devices

**Solutions:**
1. Install phone's USB drivers
2. Try different USB cable
3. Try different USB port
4. Restart adb:
   ```bash
   adb kill-server
   adb start-server
   ```
5. Re-enable USB debugging on phone

### App Loads But API Fails

**Problem:** Frontend loads but can't fetch data

**Solutions:**
1. Check backend is running on port 5000
2. Update API URL in frontend/.env:
   ```env
   VITE_API_URL=http://192.168.1.100:5000/api
   ```
3. Restart frontend after changing .env
4. Check CORS settings in backend

### ngrok Connection Issues

**Problem:** ngrok URL not working

**Solutions:**
1. Check ngrok is running
2. Verify auth token is correct
3. Try restarting ngrok
4. Check free tier limits (2 tunnels max)

---

## 📊 Recommended Testing Flow

### Quick Test (5 minutes)
1. Use Method 1 (IP Address)
2. Open app on phone
3. Test main features
4. Check touch responsiveness

### Thorough Test (30 minutes)
1. Use Method 2 (USB Debugging)
2. Test all pages
3. Test all forms
4. Test PWA installation
5. Test offline mode
6. Check performance

### Remote Test (For Others)
1. Use Method 3 (ngrok)
2. Share URL with testers
3. Get feedback
4. Fix issues
5. Re-test

---

## 🎯 Best Practices

### During Development
- Use Method 1 (IP Address) for quick tests
- Use Method 2 (USB) for detailed testing
- Test on real device, not just DevTools
- Test on different Android versions
- Test on different screen sizes

### Before Deployment
- Test all features thoroughly
- Test on multiple devices
- Test on slow network (Chrome DevTools → Network → Slow 3G)
- Test offline mode
- Test PWA installation

### After Deployment
- Test production URL on phone
- Verify all features work
- Check performance
- Monitor errors
- Get user feedback

---

## 📱 Recommended Test Devices

### Minimum
- Any Android phone with Chrome
- Android 8.0 or higher
- Screen size: 5" or larger

### Ideal
- Samsung Galaxy (popular in Ghana)
- Google Pixel (pure Android)
- Xiaomi/Tecno (budget-friendly)
- Different screen sizes (small, medium, large)

---

## 🔧 Useful Commands

### Check Computer IP
```bash
ipconfig
```

### Check ADB Connection
```bash
adb devices
```

### Port Forwarding
```bash
adb reverse tcp:3000 tcp:3000
adb reverse tcp:5000 tcp:5000
```

### View Phone Logs
```bash
adb logcat
```

### Clear Port Forwarding
```bash
adb reverse --remove-all
```

### Restart ADB
```bash
adb kill-server
adb start-server
```

---

## 📞 Quick Reference

### Method 1: IP Address
```
1. ipconfig (get IP)
2. npm run dev
3. Phone: http://YOUR_IP:3000
```

### Method 2: USB Debugging
```
1. Enable USB debugging on phone
2. adb reverse tcp:3000 tcp:3000
3. npm run dev
4. Phone: http://localhost:3000
```

### Method 3: ngrok
```
1. ngrok http 3000
2. ngrok http 5000
3. Update frontend .env with backend URL
4. Phone: Use ngrok frontend URL
```

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ App loads on your phone
- ✅ All buttons respond to touch
- ✅ Forms work properly
- ✅ Navigation is smooth
- ✅ Images load correctly
- ✅ No console errors
- ✅ PWA can be installed

---

## 🎉 Summary

**Easiest Method:** Use your computer's IP address
1. Find IP: `ipconfig`
2. Start servers: `npm run dev`
3. Phone: `http://YOUR_IP:3000`

**Most Reliable:** USB Debugging
1. Enable USB debugging
2. Connect phone
3. `adb reverse tcp:3000 tcp:3000`
4. Phone: `http://localhost:3000`

**For Remote Testing:** ngrok
1. Install ngrok
2. Expose ports
3. Share URL

**Start with Method 1, it's the simplest!** 🚀

---

**Need Help?**
- Check firewall settings
- Ensure same WiFi network
- Try different USB cable
- Restart everything
- Check console for errors

**Happy Testing!** 📱✨
