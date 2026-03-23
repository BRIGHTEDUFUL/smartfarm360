# 🚀 Quick Deploy - Smart Farming 360

## Deploy to Render (FREE) in 10 Minutes

### Step 1: Test Locally (2 minutes)
```bash
# Build the app
npm run build

# Test production mode
npm run start:prod

# Open browser: http://localhost:5000
# Verify everything works
```

### Step 2: Push to GitHub (3 minutes)
```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Add your GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/smart-farming-360.git

# Push
git push -u origin main
```

### Step 3: Deploy on Render (5 minutes)

1. **Go to Render**: https://render.com
2. **Sign up** with GitHub (free, no credit card)
3. **Click "New +"** → **"Web Service"**
4. **Connect** your repository
5. **Configure**:
   - **Name**: `smart-farming-360`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: `Free`

6. **Add Environment Variables**:
   ```
   NODE_ENV=production
   JWT_ACCESS_SECRET=<click-generate>
   JWT_REFRESH_SECRET=<click-generate>
   ```

7. **Click "Create Web Service"**

8. **Wait 5-10 minutes** for deployment

9. **Your app is live!** 🎉
   - URL: `https://smart-farming-360.onrender.com`

### Step 4: Verify Deployment
```bash
# Test your live app
npm run verify:prod https://smart-farming-360.onrender.com
```

---

## Alternative: Deploy to Railway (NO SLEEP)

### Quick Railway Deploy
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up

# Get URL
railway domain
```

**Done!** Your app is live with no sleep time.

---

## Free Deployment Comparison

| Platform | Setup Time | Sleep? | Cost | Best For |
|----------|------------|--------|------|----------|
| **Render** | 10 min | Yes (15min) | Free | Testing |
| **Railway** | 5 min | No | $5 credit | Development |
| **Vercel+Render** | 15 min | Frontend: No | Free | Production |

---

## Test Accounts (Pre-seeded)

### Admin
- Email: `admin@smartfarming.com`
- Password: `admin123`

### Farmer
- Email: `farmer1@test.com`
- Password: `farmer123`

### Consumer
- Email: `consumer@test.com`
- Password: `consumer123`

---

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test login
- [ ] Browse products
- [ ] Add to cart
- [ ] Place order
- [ ] Test admin dashboard
- [ ] Test farmer dashboard
- [ ] Install PWA
- [ ] Test offline mode

---

## Need Help?

### Common Issues

**Build fails?**
```bash
# Clear cache and rebuild
rm -rf node_modules
npm run install:all
npm run build
```

**Can't connect to API?**
- Check environment variables
- Verify `VITE_API_URL` is set correctly
- Check CORS settings

**Database not persisting?**
- Add disk mount in Render (see `render.yaml`)

### Resources
- Full Guide: `DEPLOYMENT_GUIDE.md`
- Sync Status: `SYNC_IMPROVEMENTS.md`
- API Docs: `backend/API.md`

---

## 🎉 You're Live!

Your Smart Farming 360 app is now accessible to users in Ghana and worldwide!

**Next Steps:**
1. Share your URL with test users
2. Monitor with UptimeRobot (free)
3. Add custom domain (optional)
4. Integrate Paystack for payments
5. Scale as you grow!

**Questions?** Check the full deployment guide or create an issue on GitHub.
