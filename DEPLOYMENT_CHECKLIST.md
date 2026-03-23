# ✅ Deployment Checklist

Use this checklist to ensure smooth deployment to GitHub Pages.

---

## 📋 Pre-Deployment

### Local Testing
- [ ] App runs locally without errors (`npm run dev`)
- [ ] All features work (browse, register, login, cart, orders)
- [ ] No console errors in browser
- [ ] Mobile view works correctly
- [ ] Run deployment check: `npm run deploy:check`

### Code Quality
- [ ] All changes committed to Git
- [ ] Tests pass (`npm test`)
- [ ] No TypeScript errors
- [ ] Code pushed to GitHub

---

## 🔧 Backend Deployment (Render.com)

### Account Setup
- [ ] Created Render account at [render.com](https://render.com)
- [ ] Connected GitHub account to Render
- [ ] Repository is accessible in Render

### Service Configuration
- [ ] Created new Web Service
- [ ] Selected correct repository
- [ ] Set root directory to `backend`
- [ ] Set build command: `npm install && npm run build && npm run migrate`
- [ ] Set start command: `npm start`
- [ ] Selected free tier

### Environment Variables
- [ ] Added `NODE_ENV=production`
- [ ] Added `PORT=5000`
- [ ] Added `JWT_SECRET` (strong random string)
- [ ] Added `JWT_REFRESH_SECRET` (different strong random string)
- [ ] Added `DATABASE_PATH=./smart_farming.db`
- [ ] Added `CORS_ORIGIN` (will update after frontend deployment)

### Deployment
- [ ] Clicked "Create Web Service"
- [ ] Waited for deployment to complete
- [ ] Copied backend URL (e.g., `https://smart-farming-backend-xxxx.onrender.com`)
- [ ] Tested backend: Visit `https://your-backend-url.onrender.com/api/products`
- [ ] Backend returns JSON (not error page)

---

## 🎨 Frontend Configuration

### GitHub Repository Settings
- [ ] Opened repository on GitHub
- [ ] Went to Settings → Pages
- [ ] Set Source to "GitHub Actions"
- [ ] Went to Settings → Secrets and variables → Actions
- [ ] Added secret `VITE_API_URL` with value: `https://your-backend-url.onrender.com/api`

### Local Configuration Files
- [ ] Updated `frontend/.env.production`:
  ```env
  VITE_API_URL=https://your-actual-backend-url.onrender.com/api
  VITE_BASE_PATH=/
  ```
- [ ] If using repo name in URL, updated `frontend/vite.config.ts`:
  ```typescript
  base: '/your-repo-name/',
  ```
- [ ] Committed changes to Git

---

## 🚀 Frontend Deployment (GitHub Pages)

### Trigger Deployment
- [ ] Pushed changes to `main` branch: `git push origin main`
- [ ] Went to GitHub → Actions tab
- [ ] Verified "Deploy to GitHub Pages" workflow started
- [ ] Waited for workflow to complete (green checkmark)

### Verify Deployment
- [ ] Opened GitHub Pages URL (shown in Actions workflow)
- [ ] Site loads without errors
- [ ] Can browse products
- [ ] Can register new account
- [ ] Can login
- [ ] Can add items to cart
- [ ] Can place order
- [ ] No CORS errors in console

---

## 🔄 Post-Deployment

### Update Backend CORS
- [ ] Went back to Render dashboard
- [ ] Opened backend service
- [ ] Went to Environment tab
- [ ] Updated `CORS_ORIGIN` to match GitHub Pages URL
- [ ] Saved (service will redeploy automatically)
- [ ] Waited for redeploy to complete
- [ ] Tested frontend again to verify CORS is working

### Final Testing
- [ ] Tested all user flows:
  - [ ] Browse products
  - [ ] Search and filter
  - [ ] View product details
  - [ ] Register account
  - [ ] Login
  - [ ] Add to cart
  - [ ] Update cart quantities
  - [ ] Remove from cart
  - [ ] Checkout
  - [ ] View orders
  - [ ] Admin dashboard (if admin)
  - [ ] Farmer dashboard (if farmer)
- [ ] Tested on mobile device (not just DevTools)
- [ ] Tested on different browsers (Chrome, Firefox, Safari)
- [ ] Verified no console errors

---

## 📝 Documentation

### Update Repository
- [ ] Updated README.md with live URLs
- [ ] Added deployment badge to README (optional)
- [ ] Documented any deployment-specific notes
- [ ] Created release tag (optional): `git tag v1.0.0 && git push --tags`

### Share
- [ ] Shared frontend URL with team/users
- [ ] Documented test accounts for users
- [ ] Created user guide (optional)

---

## 🆘 Troubleshooting

If something doesn't work, check:

### CORS Errors
- [ ] `CORS_ORIGIN` in Render matches GitHub Pages URL exactly
- [ ] No trailing slash in CORS_ORIGIN
- [ ] Backend redeployed after CORS update

### 404 Errors
- [ ] Base path in `vite.config.ts` matches deployment URL
- [ ] GitHub Pages is enabled in repository settings
- [ ] Workflow completed successfully

### API Errors
- [ ] `VITE_API_URL` secret is set correctly in GitHub
- [ ] Backend is running (check Render dashboard)
- [ ] Backend URL is accessible in browser
- [ ] Environment variables are set in Render

### Build Errors
- [ ] All dependencies are in `package.json`
- [ ] No TypeScript errors locally
- [ ] Build works locally: `cd frontend && npm run build`

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Frontend loads at GitHub Pages URL
- ✅ Backend responds at Render URL
- ✅ Users can register and login
- ✅ Products display correctly
- ✅ Cart functionality works
- ✅ Orders can be placed
- ✅ No console errors
- ✅ Mobile view works correctly

---

## 📊 Monitoring

### Regular Checks
- [ ] Monitor Render logs for errors
- [ ] Check GitHub Actions for failed deployments
- [ ] Monitor user feedback
- [ ] Check backend uptime (Render free tier sleeps after 15min)

### Maintenance
- [ ] Update dependencies regularly
- [ ] Monitor security advisories
- [ ] Backup database periodically
- [ ] Review and rotate secrets quarterly

---

**Congratulations! Your app is live! 🎉**

Share your success: `https://yourusername.github.io/smart-farming-360/`
