# ⚡ Quick Deployment Guide

Deploy Smart Farming 360 in 15 minutes!

---

## 🎯 Quick Steps

### 1️⃣ Deploy Backend (5 minutes)
1. Go to [render.com](https://render.com) → Sign up with GitHub
2. New + → Web Service → Connect your repo
3. Settings:
   - Root Directory: `backend`
   - Build: `npm install && npm run build && npm run migrate`
   - Start: `npm start`
4. Add environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=change-this-secret-key
   JWT_REFRESH_SECRET=change-this-refresh-key
   CORS_ORIGIN=https://yourusername.github.io
   ```
5. Deploy → Copy backend URL

### 2️⃣ Configure GitHub Pages (2 minutes)
1. GitHub repo → Settings → Pages
2. Source: **GitHub Actions**
3. Settings → Secrets → New secret:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api`

### 3️⃣ Update Frontend Config (3 minutes)
Edit `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_BASE_PATH=/
```

### 4️⃣ Deploy (5 minutes)
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

Go to Actions tab → Wait for green checkmark ✅

### 5️⃣ Access Your Site
`https://yourusername.github.io/smart-farming-360/`

---

## ✅ Verification

Test these features:
- [ ] Browse products
- [ ] Register account
- [ ] Login
- [ ] Add to cart
- [ ] Place order

---

## 🔧 Common Issues

**CORS Error?**
→ Update `CORS_ORIGIN` in Render to match your GitHub Pages URL

**404 on refresh?**
→ GitHub Pages limitation with client-side routing (normal behavior)

**Slow first load?**
→ Render free tier sleeps after 15min (first request takes 30s)

---

## 📚 Full Guide

See [docs/GITHUB_PAGES_DEPLOYMENT.md](docs/GITHUB_PAGES_DEPLOYMENT.md) for detailed instructions.

---

**That's it! Your app is live! 🎉**
