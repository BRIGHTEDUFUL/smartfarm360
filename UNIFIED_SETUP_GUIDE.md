# Smart Farming 360 - Unified Setup Guide

## Overview
The application now runs on a **single port (5000)** with both frontend and backend together. This simplifies deployment and eliminates CORS issues.

## Architecture
- **Backend**: Express server on port 5000
- **Frontend**: React app served as static files by Express
- **API**: Available at `/api/*` routes
- **Database**: SQLite (smart_farming.db)

## Quick Start

### Option 1: Using Startup Scripts (Recommended)

**Windows Command Prompt:**
```cmd
start-unified.bat
```

**Windows PowerShell:**
```powershell
.\start-unified.ps1
```

**Manual (from root directory):**
```bash
npm start
```

### Option 2: Step by Step

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

2. **Start Backend (serves frontend):**
   ```bash
   cd backend
   npm start
   ```

3. **Open Browser:**
   ```
   http://localhost:5000
   ```

## Development Mode

If you want to develop with hot-reload (separate ports):

```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 3000)
cd frontend
npm run dev
```

Then open: http://localhost:3000

## How It Works

### Production Mode (Single Port)
1. Frontend is built into static files (`frontend/dist`)
2. Backend serves these static files
3. API routes are handled by Express (`/api/*`)
4. All other routes serve `index.html` (SPA support)
5. Everything runs on port 5000

### API Configuration
- Frontend uses relative paths: `/api/products`, `/api/orders`, etc.
- No CORS needed (same origin)
- Simplified deployment

## File Changes Made

### Backend (`backend/src/server.ts`)
- Added static file serving for `frontend/dist`
- Added SPA fallback route (serves index.html for all non-API routes)
- Changed default port to 5000
- Updated helmet config to allow React

### Frontend (`frontend/src/services/api.ts`)
- Changed API_URL from `http://localhost:5000/api` to `/api`
- Uses relative paths (works on any domain)

### Environment Files
- `backend/.env`: PORT=5000
- `frontend/.env`: VITE_API_URL=/api

## Testing the Setup

1. **Check server is running:**
   ```
   http://localhost:5000/api/health
   ```
   Should return: `{"status":"ok","message":"Smart Farming 360 API is running"}`

2. **Check frontend loads:**
   ```
   http://localhost:5000
   ```
   Should show the Smart Farming 360 homepage

3. **Test login:**
   - Email: consumer@test.com
   - Password: consumer123

4. **Test order placement:**
   - Add items to cart
   - Go to checkout
   - Fill form and place order
   - Should work without errors

## Troubleshooting

### Port 5000 Already in Use
```bash
# Windows - Find process using port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess

# Kill the process
Stop-Process -Id <ProcessId> -Force
```

### Frontend Not Loading
1. Make sure frontend is built: `cd frontend && npm run build`
2. Check `frontend/dist` folder exists
3. Restart backend server

### API Calls Failing
1. Check browser console for errors
2. Verify API URL is `/api` not `http://localhost:5000/api`
3. Check backend logs for errors

### Database Issues
1. Delete `backend/smart_farming.db`
2. Restart server (will recreate database)

## Deployment

For production deployment:

1. **Build everything:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   cd backend
   npm start
   ```

3. **Environment variables:**
   - Set `NODE_ENV=production`
   - Update JWT secrets
   - Configure proper database path

## Benefits of Unified Setup

✅ **Simpler deployment** - One server to manage
✅ **No CORS issues** - Same origin for frontend and backend
✅ **Easier testing** - Single URL to remember
✅ **Production-ready** - Standard deployment pattern
✅ **Cost-effective** - One server instance needed

## Test Accounts

- **Admin**: admin@smartfarming.com / admin123
- **Farmer**: farmer1@test.com / farmer123
- **Consumer**: consumer@test.com / consumer123

## Current Status

✅ Backend running on port 5000
✅ Frontend built and served by backend
✅ Database initialized with sample data
✅ All API routes working
✅ Order placement fixed
✅ Authentication working

## Next Steps

1. Test order placement thoroughly
2. Test all user roles (Admin, Farmer, Consumer)
3. Verify all features work correctly
4. Deploy to production server if needed
