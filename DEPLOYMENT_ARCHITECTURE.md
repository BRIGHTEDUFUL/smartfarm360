# 🏗️ Deployment Architecture

Visual guide to Smart Farming 360's deployment setup.

---

## 🌐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                                │
│                    (Ghana & Beyond)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   GITHUB PAGES                               │
│              (Frontend - Static Site)                        │
│                                                              │
│  • React Application                                         │
│  • Automatic Deployment                                      │
│  • Free CDN                                                  │
│  • HTTPS Enabled                                             │
│                                                              │
│  URL: https://yourusername.github.io/smart-farming-360/     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ API Calls
                     │ (HTTPS)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    RENDER.COM                                │
│               (Backend - Node.js API)                        │
│                                                              │
│  • Express.js Server                                         │
│  • SQLite Database                                           │
│  • JWT Authentication                                        │
│  • File Upload Support                                       │
│  • Automatic Migrations                                      │
│                                                              │
│  URL: https://smart-farming-backend-xxxx.onrender.com       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Deployment Flow

### Frontend Deployment (GitHub Pages)

```
Developer                GitHub                 GitHub Pages
    │                       │                         │
    │  1. git push          │                         │
    ├──────────────────────>│                         │
    │                       │                         │
    │                       │  2. Trigger Workflow    │
    │                       │  (deploy-gh-pages.yml)  │
    │                       │                         │
    │                       │  3. Install deps        │
    │                       │  4. Build frontend      │
    │                       │  5. Upload artifact     │
    │                       │                         │
    │                       │  6. Deploy              │
    │                       ├────────────────────────>│
    │                       │                         │
    │                       │  7. Site Live ✅        │
    │                       │                         │
    │  8. Notification      │                         │
    │<──────────────────────┤                         │
    │                       │                         │
```

### Backend Deployment (Render)

```
Developer                GitHub                 Render.com
    │                       │                         │
    │  1. git push          │                         │
    ├──────────────────────>│                         │
    │                       │                         │
    │                       │  2. Webhook             │
    │                       ├────────────────────────>│
    │                       │                         │
    │                       │  3. Clone repo          │
    │                       │  4. Install deps        │
    │                       │  5. Build backend       │
    │                       │  6. Run migrations      │
    │                       │  7. Start server        │
    │                       │                         │
    │                       │  8. Health check ✅     │
    │                       │                         │
    │  9. Notification      │                         │
    │<──────────────────────┼─────────────────────────┤
    │                       │                         │
```

---

## 📁 File Structure

### Deployment Configuration Files

```
smart-farming-360/
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Tests & builds
│       └── deploy-gh-pages.yml       # 🆕 GitHub Pages deployment
│
├── frontend/
│   ├── .env.production               # 🆕 Production config
│   ├── vite.config.ts                # ✏️ Updated with base path
│   └── src/
│       └── services/
│           └── api.ts                # ✅ Uses VITE_API_URL
│
├── backend/
│   ├── package.json                  # Build & start scripts
│   └── src/
│       └── server.ts                 # CORS configuration
│
├── check-deployment-config.js        # 🆕 Pre-deployment checker
├── DEPLOYMENT_QUICK_START.md         # 🆕 Quick guide
├── DEPLOYMENT_CHECKLIST.md           # 🆕 Step-by-step checklist
└── docs/
    └── GITHUB_PAGES_DEPLOYMENT.md    # 🆕 Comprehensive guide
```

---

## 🔐 Environment Variables

### Frontend (GitHub Secrets)

```
VITE_API_URL
└─> Used during build
└─> Points to backend API
└─> Example: https://smart-farming-backend-xxxx.onrender.com/api
```

### Backend (Render Environment)

```
NODE_ENV=production
PORT=5000
JWT_SECRET=<random-string>
JWT_REFRESH_SECRET=<random-string>
DATABASE_PATH=./smart_farming.db
CORS_ORIGIN=https://yourusername.github.io
```

---

## 🚀 Deployment Triggers

### Automatic Deployment

```
┌──────────────────────────────────────────────────────────┐
│  Event: Push to 'main' branch                            │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ├─> Frontend: GitHub Actions workflow
                     │   └─> Builds and deploys to GitHub Pages
                     │
                     └─> Backend: Render webhook
                         └─> Builds and deploys to Render
```

### Manual Deployment

```
┌──────────────────────────────────────────────────────────┐
│  GitHub Actions Tab → Run workflow                       │
└────────────────────┬─────────────────────────────────────┘
                     │
                     └─> Manually trigger deployment
                         └─> Useful for testing or rollbacks
```

---

## 🌍 Request Flow

### User Browsing Products

```
User Browser
    │
    │  1. Visit site
    ├──────────────────────> GitHub Pages
    │                        (Serves HTML/CSS/JS)
    │
    │  2. Page loads
    │<─────────────────────
    │
    │  3. Fetch products
    │  GET /api/products
    ├──────────────────────────────────────> Render Backend
    │                                        (Query database)
    │
    │  4. Return products JSON
    │<────────────────────────────────────────
    │
    │  5. Display products
    │
```

### User Placing Order

```
User Browser
    │
    │  1. Add to cart (localStorage)
    │
    │  2. Click checkout
    │
    │  3. POST /api/orders
    │  (with auth token)
    ├──────────────────────────────────────> Render Backend
    │                                        │
    │                                        │ 4. Verify token
    │                                        │ 5. Create order
    │                                        │ 6. Save to DB
    │                                        │
    │  7. Return order confirmation
    │<────────────────────────────────────────
    │
    │  8. Show success message
    │  9. Clear cart
    │
```

---

## 💾 Data Persistence

### Frontend (Browser)

```
localStorage
├── accessToken          # JWT for authentication
├── refreshToken         # JWT for token refresh
├── user                 # User profile data
└── cart                 # Shopping cart items
```

### Backend (Render)

```
SQLite Database (smart_farming.db)
├── users                # User accounts
├── products             # Product catalog
├── orders               # Order records
├── order_items          # Order line items
├── cart_items           # Shopping cart
└── audit_logs           # Activity logs
```

---

## 🔒 Security Flow

### Authentication

```
1. User Login
   └─> POST /api/auth/login
       └─> Backend validates credentials
           └─> Returns JWT tokens
               └─> Frontend stores in localStorage

2. Authenticated Request
   └─> Frontend adds token to header
       └─> Authorization: Bearer <token>
           └─> Backend validates token
               └─> Processes request or returns 401

3. Token Refresh
   └─> Token expires
       └─> Frontend uses refresh token
           └─> POST /api/auth/refresh
               └─> Backend issues new access token
```

### CORS Protection

```
Browser                  Backend
   │                        │
   │  1. Preflight          │
   │  OPTIONS /api/...      │
   ├───────────────────────>│
   │                        │ 2. Check origin
   │                        │    against CORS_ORIGIN
   │                        │
   │  3. CORS headers       │
   │<───────────────────────┤
   │                        │
   │  4. Actual request     │
   │  GET/POST /api/...     │
   ├───────────────────────>│
   │                        │
   │  5. Response           │
   │<───────────────────────┤
```

---

## 📊 Monitoring & Logs

### Frontend Monitoring

```
GitHub Actions
└── Build logs
└── Deployment logs
└── Error notifications

Browser Console
└── Runtime errors
└── API call failures
└── Network issues
```

### Backend Monitoring

```
Render Dashboard
├── Application logs
├── Build logs
├── Deployment history
├── Resource usage
└── Uptime monitoring

Winston Logger (backend/logs/)
├── combined.log         # All logs
└── error.log           # Errors only
```

---

## 💰 Cost Breakdown

### Free Tier

```
GitHub Pages
├── Bandwidth: 100 GB/month
├── Build time: Unlimited
└── Cost: $0

Render.com (Free)
├── Hours: 750/month
├── RAM: 512 MB
├── Sleep: After 15min inactivity
└── Cost: $0

Total: $0/month ✅
```

### Production Tier

```
GitHub Pages
└── Cost: $0 (always free)

Render.com (Starter)
├── Always on
├── RAM: 512 MB
├── No sleep
└── Cost: $7/month

Total: $7/month
```

---

## 🎯 Performance

### Frontend (GitHub Pages)

```
✅ Global CDN
✅ HTTPS by default
✅ Fast page loads
✅ Automatic caching
✅ 99.9% uptime
```

### Backend (Render Free Tier)

```
⚠️  Cold start: ~30s (after sleep)
✅ Warm response: <100ms
✅ Auto-scaling
✅ Automatic HTTPS
⚠️  Sleeps after 15min inactivity
```

### Backend (Render Paid Tier)

```
✅ Always on (no cold starts)
✅ Response: <100ms
✅ Auto-scaling
✅ Automatic HTTPS
✅ 99.9% uptime
```

---

## 🔄 Update Process

### Code Updates

```
1. Make changes locally
2. Test locally (npm run dev)
3. Commit changes (git commit)
4. Push to GitHub (git push)
5. Automatic deployment triggers
6. Verify deployment
7. Monitor for issues
```

### Rollback Process

```
1. Identify issue
2. Go to GitHub Actions
3. Find last working deployment
4. Re-run that workflow
   OR
5. Revert commit (git revert)
6. Push to trigger new deployment
```

---

## ✅ Health Checks

### Frontend Health

```bash
# Check if site is accessible
curl -I https://yourusername.github.io/smart-farming-360/

# Expected: 200 OK
```

### Backend Health

```bash
# Check if API is responding
curl https://your-backend.onrender.com/api/products

# Expected: JSON array of products
```

---

## 🎉 Success Metrics

Your deployment is successful when:

```
✅ Frontend loads in <3 seconds
✅ API responds in <500ms (warm)
✅ No CORS errors
✅ Authentication works
✅ Orders can be placed
✅ Mobile view works
✅ No console errors
✅ 99%+ uptime
```

---

**Architecture designed for Ghana's agricultural sector! 🌾**
