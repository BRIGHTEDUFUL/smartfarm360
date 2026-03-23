# Smart Farming 360 - Deployment Guide

## Free Deployment Options for Ghana

### Option 1: Render.com (RECOMMENDED - Best Free Tier)
**Perfect for Ghana - Fast, Reliable, Free SSL**

#### Features:
- ✅ Free tier with 750 hours/month
- ✅ Automatic HTTPS/SSL
- ✅ Auto-deploy from GitHub
- ✅ Good performance in Africa
- ✅ SQLite support
- ✅ No credit card required

#### Steps:

1. **Prepare Your Code**
```bash
# Ensure .gitignore includes
node_modules/
dist/
*.db
.env
```

2. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/smart-farming-360.git
git push -u origin main
```

3. **Deploy on Render**
- Go to https://render.com
- Sign up with GitHub
- Click "New +" → "Web Service"
- Connect your repository
- Configure:
  - **Name**: smart-farming-360
  - **Environment**: Node
  - **Build Command**: `npm run build`
  - **Start Command**: `npm run start:prod`
  - **Plan**: Free

4. **Environment Variables** (Add in Render Dashboard)
```
NODE_ENV=production
PORT=10000
JWT_ACCESS_SECRET=your_strong_secret_here
JWT_REFRESH_SECRET=your_strong_refresh_secret_here
```

5. **Deploy!**
- Click "Create Web Service"
- Wait 5-10 minutes for first deploy
- Your app will be live at: `https://smart-farming-360.onrender.com`

#### Limitations:
- Spins down after 15 min inactivity (first request takes 30s)
- 750 hours/month free (enough for testing)
- SQLite data persists but limited storage

---

### Option 2: Railway.app (Great Alternative)
**Good for Ghana - Fast Deployment**

#### Features:
- ✅ $5 free credit/month
- ✅ No sleep/spin down
- ✅ Automatic HTTPS
- ✅ GitHub integration
- ✅ Good African latency

#### Steps:

1. **Deploy on Railway**
- Go to https://railway.app
- Sign up with GitHub
- Click "New Project" → "Deploy from GitHub"
- Select your repository
- Railway auto-detects Node.js

2. **Environment Variables**
```
NODE_ENV=production
JWT_ACCESS_SECRET=your_strong_secret_here
JWT_REFRESH_SECRET=your_strong_refresh_secret_here
```

3. **Generate Domain**
- Go to Settings → Generate Domain
- Your app: `https://smart-farming-360.up.railway.app`

#### Limitations:
- $5 credit = ~500 hours/month
- Need credit card for verification (no charge)

---

### Option 3: Vercel (Frontend) + Render (Backend)
**Split Deployment - Best Performance**

#### Vercel for Frontend:
1. Go to https://vercel.com
2. Import GitHub repository
3. Framework: Vite
4. Root Directory: `frontend`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Environment Variables:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

#### Render for Backend:
- Follow Option 1 steps for backend only
- Root Directory: `backend`

#### Benefits:
- Frontend on global CDN (super fast)
- Backend on Render free tier
- Best performance for Ghana users

---

### Option 4: Fly.io (Advanced)
**Best for Production - Free Tier Available**

#### Features:
- ✅ Free tier: 3 VMs, 3GB storage
- ✅ No sleep
- ✅ Good African presence
- ✅ Persistent storage

#### Steps:

1. **Install Fly CLI**
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Verify
fly version
```

2. **Login & Launch**
```bash
fly auth login
fly launch
```

3. **Configure fly.toml**
```toml
app = "smart-farming-360"

[build]
  builder = "heroku/buildpacks:20"

[env]
  NODE_ENV = "production"
  PORT = "8080"

[[services]]
  http_checks = []
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

4. **Set Secrets**
```bash
fly secrets set JWT_ACCESS_SECRET=your_secret
fly secrets set JWT_REFRESH_SECRET=your_refresh_secret
```

5. **Deploy**
```bash
fly deploy
```

---

## Comparison Table

| Platform | Free Tier | Sleep? | SSL | Ghana Speed | Best For |
|----------|-----------|--------|-----|-------------|----------|
| **Render** | 750h/mo | Yes (15min) | ✅ | Good | Testing |
| **Railway** | $5 credit | No | ✅ | Good | Development |
| **Vercel+Render** | Unlimited | Frontend: No | ✅ | Excellent | Production |
| **Fly.io** | 3 VMs | No | ✅ | Very Good | Production |

---

## Production Optimizations

### 1. Database Persistence (Render)

Create `render.yaml`:
```yaml
services:
  - type: web
    name: smart-farming-360
    env: node
    buildCommand: npm run build
    startCommand: npm run start:prod
    envVars:
      - key: NODE_ENV
        value: production
    disk:
      name: data
      mountPath: /opt/render/project/src/backend
      sizeGB: 1
```

### 2. Environment Variables Template

Create `.env.production`:
```bash
NODE_ENV=production
PORT=10000
JWT_ACCESS_SECRET=CHANGE_THIS_IN_PRODUCTION
JWT_REFRESH_SECRET=CHANGE_THIS_IN_PRODUCTION
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=https://your-domain.com
```

### 3. Build Optimization

Update `backend/package.json`:
```json
{
  "scripts": {
    "start:prod": "NODE_ENV=production node dist/server.js",
    "postinstall": "cd ../frontend && npm install && npm run build"
  }
}
```

### 4. Health Check Endpoint

Already implemented at `/api/health` - use for monitoring

---

## Ghana-Specific Considerations

### 1. CDN for Images
Use **Cloudinary** (free tier):
- 25GB storage
- 25GB bandwidth/month
- Perfect for product images

Setup:
```bash
npm install cloudinary
```

### 2. Mobile Money Integration
For Ghana payments, integrate:
- **Paystack** (Ghana-focused)
- **Flutterwave** (Pan-African)
- Both have free test modes

### 3. SMS Notifications
Use **Twilio** or **Africa's Talking**:
- Africa's Talking: Ghana-specific
- Better rates for local SMS

---

## Deployment Checklist

### Pre-Deployment
- [ ] Update all secrets in `.env`
- [ ] Test build locally: `npm run build`
- [ ] Test production mode: `npm start`
- [ ] Remove console.logs
- [ ] Enable error logging
- [ ] Test on mobile devices

### Post-Deployment
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test order placement
- [ ] Test PWA installation
- [ ] Test offline mode
- [ ] Monitor error logs
- [ ] Set up uptime monitoring

---

## Monitoring (Free Tools)

### 1. UptimeRobot
- Free: 50 monitors
- Check every 5 minutes
- Email/SMS alerts
- https://uptimerobot.com

### 2. Better Stack (formerly Logtail)
- Free: 1GB logs/month
- Real-time monitoring
- https://betterstack.com

### 3. Sentry
- Free: 5K errors/month
- Error tracking
- https://sentry.io

---

## Custom Domain (Optional)

### Free Domain Options:
1. **Freenom** (.tk, .ml, .ga domains)
2. **InfinityFree** (free subdomain)

### Paid Domain (Recommended):
- **Namecheap**: ~$10/year (.com)
- **Cloudflare**: Domain + CDN

### Setup:
1. Buy domain
2. Add to Render/Vercel
3. Update DNS records
4. SSL auto-configured

---

## Scaling Strategy

### Free Tier (0-100 users)
- Render free tier
- SQLite database
- No CDN needed

### Growth (100-1000 users)
- Upgrade Render to $7/month
- Add Cloudinary for images
- Consider PostgreSQL

### Scale (1000+ users)
- Move to Fly.io or Railway
- PostgreSQL database
- Redis for caching
- CDN for static assets

---

## Quick Start Commands

### Deploy to Render (Recommended)
```bash
# 1. Build locally to test
npm run build

# 2. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 3. Go to render.com and connect repo
# 4. Your app will be live in 10 minutes!
```

### Deploy to Railway
```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize
railway init

# 4. Deploy
railway up
```

---

## Support & Resources

### Documentation
- Render: https://render.com/docs
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Fly.io: https://fly.io/docs

### Ghana Tech Communities
- Ghana Tech Lab
- DevCongress Ghana
- Google Developer Groups Accra

---

## Estimated Costs

### Free Tier (Testing)
- **Cost**: $0/month
- **Users**: 50-100
- **Uptime**: 95%

### Starter (Small Business)
- **Cost**: $7-15/month
- **Users**: 500-1000
- **Uptime**: 99%

### Growth (Scaling)
- **Cost**: $25-50/month
- **Users**: 5000+
- **Uptime**: 99.9%

---

## Recommended Path for Ghana

1. **Start**: Render.com (Free)
2. **Test**: Get 10-20 users
3. **Grow**: Upgrade to $7/month
4. **Scale**: Move to Fly.io or Railway
5. **Monetize**: Add Paystack payments

**Your app can be live in Ghana in under 30 minutes with Render!**
