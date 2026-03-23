# 🚀 GitHub Pages Deployment Guide

Complete guide for deploying Smart Farming 360 to GitHub Pages (frontend) and Render (backend).

---

## 📋 Overview

Since GitHub Pages only hosts static sites, we'll deploy:
- **Frontend** → GitHub Pages (free, fast CDN)
- **Backend** → Render.com (free tier available)

---

## 🎯 Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### 1.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `smart-farming-backend`
   - **Region**: Choose closest to Ghana (e.g., Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build && npm run migrate`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 1.3 Add Environment Variables
In Render dashboard, add these environment variables:
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
DATABASE_PATH=./smart_farming.db
CORS_ORIGIN=https://yourusername.github.io
```

### 1.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL: `https://smart-farming-backend-xxxx.onrender.com`

---

## 🎯 Step 2: Configure GitHub Repository

### 2.1 Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Under "Build and deployment":
   - **Source**: GitHub Actions
4. Save changes

### 2.2 Add Repository Secrets
1. Go to "Settings" → "Secrets and variables" → "Actions"
2. Click "New repository secret"
3. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
     (Replace with your actual Render backend URL from Step 1.4)

---

## 🎯 Step 3: Update Frontend Configuration

### 3.1 Update Production Environment File
Edit `frontend/.env.production`:
```env
# Replace with your actual Render backend URL
VITE_API_URL=https://smart-farming-backend-xxxx.onrender.com/api

# If using custom domain, use /
# If using GitHub Pages default (username.github.io/repo-name), use /repo-name/
VITE_BASE_PATH=/
```

### 3.2 Update Base Path (if needed)
If NOT using a custom domain, update `frontend/vite.config.ts`:
```typescript
base: '/smart-farming-360/',  // Replace with your repo name
```

---

## 🎯 Step 4: Deploy Frontend to GitHub Pages

### 4.1 Commit and Push
```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### 4.2 Monitor Deployment
1. Go to "Actions" tab in your GitHub repository
2. Watch the "Deploy to GitHub Pages" workflow
3. Wait for completion (3-5 minutes)

### 4.3 Access Your Site
Your site will be available at:
- **With custom domain**: `https://yourdomain.com`
- **Without custom domain**: `https://yourusername.github.io/smart-farming-360/`

---

## 🎯 Step 5: Update Backend CORS

After frontend is deployed, update backend CORS settings:

### 5.1 Update Render Environment Variables
1. Go to Render dashboard → Your service
2. Go to "Environment" tab
3. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://yourusername.github.io
   ```
4. Save changes (service will redeploy automatically)

---

## ✅ Verification Checklist

### Backend Verification
- [ ] Backend URL is accessible: `https://your-backend.onrender.com/api/products`
- [ ] Returns JSON response (not error page)
- [ ] CORS headers are set correctly

### Frontend Verification
- [ ] Site loads at GitHub Pages URL
- [ ] Can browse products
- [ ] Can register/login
- [ ] Can add items to cart
- [ ] Can place orders
- [ ] No console errors related to API calls

---

## 🔧 Troubleshooting

### Issue: "Failed to fetch" or CORS errors
**Solution**: Update `CORS_ORIGIN` in Render to match your GitHub Pages URL exactly

### Issue: 404 on page refresh
**Solution**: GitHub Pages doesn't support client-side routing by default. Add `404.html`:
```bash
cp frontend/dist/index.html frontend/dist/404.html
```

### Issue: Assets not loading (CSS/JS)
**Solution**: Check `base` path in `vite.config.ts` matches your deployment URL

### Issue: API calls going to wrong URL
**Solution**: Verify `VITE_API_URL` secret in GitHub Actions matches Render backend URL

### Issue: Backend sleeping (Render free tier)
**Solution**: Free tier sleeps after 15 minutes of inactivity. First request will be slow (30s).
Consider upgrading to paid tier or using a keep-alive service.

---

## 🚀 Custom Domain (Optional)

### For Frontend (GitHub Pages)
1. Buy domain from Namecheap, GoDaddy, etc.
2. Add CNAME record pointing to `yourusername.github.io`
3. In GitHub repo: Settings → Pages → Custom domain
4. Enter your domain and save
5. Update `VITE_BASE_PATH=/` in `.env.production`

### For Backend (Render)
1. In Render dashboard → Settings → Custom Domain
2. Add your domain (e.g., `api.yourdomain.com`)
3. Update DNS records as instructed
4. Update `VITE_API_URL` in GitHub secrets

---

## 📊 Deployment Costs

### Free Tier (Recommended for Testing)
- **GitHub Pages**: Free (100GB bandwidth/month)
- **Render Backend**: Free (750 hours/month, sleeps after 15min inactivity)
- **Total**: $0/month

### Paid Tier (Recommended for Production)
- **GitHub Pages**: Free
- **Render Backend**: $7/month (always on, better performance)
- **Total**: $7/month

---

## 🔄 Continuous Deployment

Every push to `main` branch will:
1. Run tests (CI workflow)
2. Build frontend
3. Deploy to GitHub Pages automatically

To deploy manually:
1. Go to "Actions" tab
2. Select "Deploy to GitHub Pages"
3. Click "Run workflow"

---

## 📝 Quick Commands

```bash
# Test production build locally
cd frontend
npm run build
npm run preview

# Check build output
ls -la frontend/dist

# Verify API configuration
cat frontend/.env.production

# Force redeploy
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

---

## 🆘 Need Help?

1. Check Render logs: Dashboard → Logs
2. Check GitHub Actions logs: Actions tab → Latest workflow
3. Check browser console: F12 → Console tab
4. Verify environment variables are set correctly

---

## 🎉 Success!

Your Smart Farming 360 app is now live on:
- **Frontend**: https://yourusername.github.io/smart-farming-360/
- **Backend**: https://your-backend.onrender.com

Share the link and start connecting farmers with consumers! 🌾

---

**Built with ❤️ for Ghana's Agricultural Sector**
