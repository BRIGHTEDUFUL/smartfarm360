# 🚀 Deploy Smart Farming 360 - Step by Step

Follow these steps to deploy your app!

---

## 📋 What You Need

Before starting, make sure you have:
- [ ] GitHub account (you already have this ✅)
- [ ] Your repository is pushed to GitHub
- [ ] 15 minutes of time

---

## 🎯 STEP 1: Deploy Backend to Render (5 minutes)

### 1.1 Create Render Account
1. Open [render.com](https://render.com) in your browser
2. Click "Get Started" or "Sign Up"
3. Choose "Sign up with GitHub"
4. Authorize Render to access your repositories

### 1.2 Create Web Service
1. After logging in, click the blue "New +" button (top right)
2. Select "Web Service"
3. You'll see a list of your GitHub repositories
4. Find "smart-farming-360" and click "Connect"

### 1.3 Configure Service
Fill in these settings:

**Basic Settings:**
- **Name**: `smart-farming-backend` (or any name you like)
- **Region**: Choose "Frankfurt" (closest to Ghana)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: 
  ```
  npm install && npm run build && npm run migrate
  ```
- **Start Command**: 
  ```
  npm start
  ```

**Instance Type:**
- Select "Free" (or upgrade to $7/month for always-on)

### 1.4 Add Environment Variables
Scroll down to "Environment Variables" section and click "Add Environment Variable"

Add these one by one:

1. **NODE_ENV**
   - Value: `production`

2. **PORT**
   - Value: `5000`

3. **JWT_SECRET**
   - Value: `your-super-secret-jwt-key-change-this-to-random-string`
   - ⚠️ Change this to a random string!

4. **JWT_REFRESH_SECRET**
   - Value: `your-super-secret-refresh-key-different-from-above`
   - ⚠️ Change this to a different random string!

5. **DATABASE_PATH**
   - Value: `./smart_farming.db`

6. **CORS_ORIGIN**
   - Value: `https://yourusername.github.io`
   - ⚠️ Replace "yourusername" with your actual GitHub username!

### 1.5 Deploy Backend
1. Click "Create Web Service" button at the bottom
2. Wait 5-10 minutes for deployment
3. You'll see logs scrolling - this is normal
4. When you see "Deploy live for smart-farming-backend" - it's done! ✅

### 1.6 Copy Your Backend URL
1. At the top of the page, you'll see your service URL
2. It looks like: `https://smart-farming-backend-xxxx.onrender.com`
3. **COPY THIS URL** - you'll need it in the next step!
4. Test it: Open `https://your-backend-url.onrender.com/api/products` in browser
5. You should see JSON data (not an error page)

---

## 🎯 STEP 2: Configure GitHub Repository (3 minutes)

### 2.1 Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab (top right)
3. Scroll down and click "Pages" in the left sidebar
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions" from dropdown
5. That's it! Don't click save, it auto-saves.

### 2.2 Add Backend URL Secret
1. Still in Settings, click "Secrets and variables" in left sidebar
2. Click "Actions"
3. Click green "New repository secret" button
4. Add secret:
   - **Name**: `VITE_API_URL`
   - **Secret**: `https://your-backend-url.onrender.com/api`
   - ⚠️ Replace with YOUR actual backend URL from Step 1.6
   - ⚠️ Make sure to add `/api` at the end!
5. Click "Add secret"

---

## 🎯 STEP 3: Update Local Configuration (2 minutes)

### 3.1 Update Production Environment File
Open `frontend/.env.production` and update it:

```env
# Replace with your actual Render backend URL from Step 1.6
VITE_API_URL=https://your-backend-url.onrender.com/api

# Keep this as is (unless using custom domain)
VITE_BASE_PATH=/
```

**Save the file!**

### 3.2 Check Your GitHub Username
You need to know your GitHub username for the next step.

Your GitHub Pages URL will be:
`https://YOUR-USERNAME.github.io/smart-farming-360/`

---

## 🎯 STEP 4: Commit and Push (2 minutes)

### 4.1 Stage All Changes
```bash
git add .
```

### 4.2 Commit Changes
```bash
git commit -m "Configure GitHub Pages deployment"
```

### 4.3 Push to GitHub
```bash
git push origin main
```

If you get an error about upstream, try:
```bash
git push -u origin main
```

---

## 🎯 STEP 5: Monitor Deployment (3 minutes)

### 5.1 Watch GitHub Actions
1. Go to your repository on GitHub
2. Click "Actions" tab (top menu)
3. You should see a workflow running: "Deploy to GitHub Pages"
4. Click on it to see progress
5. Wait for all steps to complete (green checkmarks ✅)
6. This takes 3-5 minutes

### 5.2 Get Your Site URL
1. Once deployment completes, click on the workflow
2. Look for "Deploy to GitHub Pages" job
3. Expand the "Deploy to GitHub Pages" step
4. You'll see your site URL in the logs
5. Or just go to: `https://YOUR-USERNAME.github.io/smart-farming-360/`

---

## 🎯 STEP 6: Update Backend CORS (2 minutes)

Now that you know your frontend URL, update backend CORS:

### 6.1 Update CORS in Render
1. Go back to Render dashboard
2. Click on your backend service
3. Click "Environment" in left sidebar
4. Find `CORS_ORIGIN` variable
5. Click the pencil icon to edit
6. Update value to: `https://YOUR-USERNAME.github.io`
   - ⚠️ No trailing slash!
   - ⚠️ Replace YOUR-USERNAME with your actual GitHub username
7. Click "Save Changes"
8. Service will automatically redeploy (takes 2-3 minutes)

---

## ✅ STEP 7: Test Your Deployed App!

### 7.1 Open Your Site
Go to: `https://YOUR-USERNAME.github.io/smart-farming-360/`

### 7.2 Test Features
Try these:
- [ ] Browse products
- [ ] Register a new account
- [ ] Login
- [ ] Add items to cart
- [ ] Place an order
- [ ] Check if everything works!

### 7.3 Check for Errors
1. Press F12 to open browser console
2. Look for any red errors
3. If you see CORS errors, double-check Step 6

---

## 🎉 SUCCESS!

Your app is now live at:
- **Frontend**: `https://YOUR-USERNAME.github.io/smart-farming-360/`
- **Backend**: `https://your-backend.onrender.com`

Share the link with others! 🌾

---

## 🆘 Troubleshooting

### Issue: "Failed to fetch" or CORS errors
**Solution**: 
1. Go to Render dashboard
2. Check `CORS_ORIGIN` matches your GitHub Pages URL exactly
3. Make sure there's no trailing slash
4. Wait for backend to redeploy

### Issue: 404 error on GitHub Pages
**Solution**:
1. Check GitHub Pages is enabled (Settings → Pages)
2. Check workflow completed successfully (Actions tab)
3. Wait a few more minutes

### Issue: Backend not responding
**Solution**:
1. Check Render dashboard - is service running?
2. Check logs in Render for errors
3. Try accessing: `https://your-backend.onrender.com/api/products`

### Issue: First load is very slow
**Solution**:
- This is normal for Render free tier
- Backend sleeps after 15 minutes of inactivity
- First request takes ~30 seconds to wake up
- Subsequent requests are fast

---

## 💡 Tips

1. **Bookmark your URLs** for easy access
2. **Check Render logs** if something breaks
3. **Monitor GitHub Actions** for deployment status
4. **Test on mobile** to verify responsiveness works
5. **Share with friends** and get feedback!

---

## 🔄 Future Updates

When you make changes:
1. Make changes locally
2. Test with `npm run dev`
3. Commit: `git commit -m "Your changes"`
4. Push: `git push origin main`
5. Deployment happens automatically!

---

**Need more help? Check these files:**
- DEPLOYMENT_QUICK_START.md
- docs/GITHUB_PAGES_DEPLOYMENT.md
- DEPLOYMENT_CHECKLIST.md

**You've got this! 🚀**
