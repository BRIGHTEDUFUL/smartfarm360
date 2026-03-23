# How to Fix Browser Cache Issue

## The Problem
Your CSS changes are saved in the files, but your browser is showing the old cached version.

## Quick Fix (Choose ONE method)

### Method 1: Use the Batch Script (EASIEST)
1. Double-click `clear-cache-and-start.bat`
2. Wait for the dev server to start
3. Open your browser to http://localhost:5173
4. Press **Ctrl + Shift + R** (Windows) to hard refresh

### Method 2: Manual Hard Refresh
1. Start the dev server: `npm run dev` in the frontend folder
2. Open your browser to http://localhost:5173
3. Press **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)
4. Or press **F12** → Right-click the refresh button → "Empty Cache and Hard Reload"

### Method 3: Clear Browser Cache Completely
1. Press **Ctrl + Shift + Delete**
2. Select "Cached images and files"
3. Click "Clear data"
4. Restart your browser
5. Go to http://localhost:5173

### Method 4: Use Incognito/Private Mode
1. Open a new Incognito/Private window
2. Go to http://localhost:5173
3. This will load fresh files without cache

## Verify Changes Are Applied
After clearing cache, you should see:
- ✅ White product cards (not dark)
- ✅ White sidebar categories (not dark)
- ✅ Yellow-gold "Add to Cart" buttons
- ✅ All text clearly visible on white backgrounds

## If Still Not Working
1. Check browser console (F12) for errors
2. Verify dev server is running on port 5173
3. Try a different browser
4. Make sure you're looking at the Shop page (/shop)

## Files That Were Updated
- `frontend/src/pages/ShopPage.css` - White backgrounds applied
- `frontend/src/index.css` - Text visibility improved
- All changes are saved and ready to load

## Cache Buster Added
A comment "CACHE BUSTER v2.0" was added to force the browser to recognize the file has changed.
