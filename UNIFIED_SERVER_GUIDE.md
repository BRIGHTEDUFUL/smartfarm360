# Smart Farming 360 - Unified Server Guide

This guide explains how to run the entire application (frontend + backend) on a single server.

## 🎯 Overview

The application is configured to run on **one server** where:
- Backend runs on port **5000** (or PORT environment variable)
- Backend serves the built frontend static files
- All API requests go to `/api/*`
- All other requests serve the React app

## 🚀 Quick Start

### Option 1: Using npm (Recommended)

```bash
npm run start:unified
```

This command will:
1. Install all dependencies (backend + frontend)
2. Build the frontend
3. Build the backend
4. Start the server on http://localhost:5000

### Option 2: Using Scripts

**Windows:**
```bash
start-unified.bat
```

**Linux/Mac:**
```bash
chmod +x start-unified.sh
./start-unified.sh
```

### Option 3: Manual Steps

```bash
# 1. Install dependencies
npm install --prefix backend
npm install --prefix frontend

# 2. Build frontend
npm run build --prefix frontend

# 3. Build backend (optional, TypeScript compilation)
npm run build --prefix backend

# 4. Start server
npm start --prefix backend
```

## 📁 How It Works

### Development Mode (2 servers)
```
Frontend (Vite)     Backend (Express)
http://localhost:3000 → http://localhost:5000/api
```

Run with: `npm run dev`

### Production Mode (1 server)
```
Backend (Express) on http://localhost:5000
├── /api/*          → API endpoints
├── /uploads/*      → Product images
└── /*              → React app (from frontend/dist)
```

Run with: `npm run start:unified`

## 🔧 Configuration

### Backend (backend/src/server.ts)

The server automatically:
- Serves static files from `frontend/dist`
- Routes `/api/*` to Express API
- Falls back to `index.html` for client-side routing
- Serves uploaded images from `backend/uploads`

### Frontend (frontend/vite.config.ts)

In production, the frontend is built to `frontend/dist` with:
- All assets bundled and optimized
- API calls use relative paths `/api/*`
- Environment variables from `.env.production`

## 🌐 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secret-key
CORS_ORIGIN=*
```

### Frontend (.env.production)
```env
VITE_API_URL=/api
```

## 📦 Deployment

### Deploy to Render/Railway/Heroku

1. **Build Command:**
   ```bash
   npm run install:all && npm run build
   ```

2. **Start Command:**
   ```bash
   npm run start:prod
   ```

3. **Environment Variables:**
   - Set `NODE_ENV=production`
   - Set `PORT` (usually auto-set by platform)
   - Set `JWT_SECRET`

### Deploy with Docker

```bash
docker build -t smart-farming-360 .
docker run -p 5000:5000 smart-farming-360
```

## 🧪 Testing

### Test the unified server locally:

1. Build and start:
   ```bash
   npm run start:unified
   ```

2. Open browser:
   ```
   http://localhost:5000
   ```

3. Test API:
   ```
   http://localhost:5000/api/health
   ```

4. Test frontend:
   - Navigate to different pages
   - Refresh on any route (should work)
   - Check browser console for errors

## 🔍 Troubleshooting

### Frontend not loading
- Check if `frontend/dist` exists
- Run `npm run build --prefix frontend`
- Check server logs for "Frontend : not built"

### API not working
- Check if backend is running on correct port
- Verify CORS settings in `backend/src/server.ts`
- Check API URL in frontend `.env.production`

### 404 on page refresh
- This is normal in dev mode (use Vite dev server)
- In production, backend handles SPA routing automatically

### Images not loading
- Check `backend/uploads` directory exists
- Verify image paths in database
- Check `/uploads` route in server.ts

## 📊 Port Configuration

| Mode | Frontend | Backend | Access |
|------|----------|---------|--------|
| Development | 3000 | 5000 | http://localhost:3000 |
| Production | - | 5000 | http://localhost:5000 |

## 🎨 Benefits of Unified Server

✅ **Simpler deployment** - One server to manage
✅ **No CORS issues** - Same origin for frontend and backend
✅ **Better performance** - Static file serving is fast
✅ **Easier SSL** - One certificate for everything
✅ **Cost effective** - One server instance instead of two

## 📝 Notes

- The backend automatically detects if frontend is built
- If `frontend/dist/index.html` doesn't exist, only API is served
- In development, use `npm run dev` for hot reload
- In production, use `npm run start:unified` for unified server
- Database is SQLite, stored in `backend/smart_farming.db`
- Uploaded images are in `backend/uploads/products/`

## 🆘 Support

If you encounter issues:
1. Check the console logs
2. Verify all dependencies are installed
3. Ensure ports 5000 is available
4. Check environment variables are set correctly
5. Try rebuilding: `npm run build`

---

**Happy Farming! 🌾**
