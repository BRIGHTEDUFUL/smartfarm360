# 🚀 Smart Farming 360 - Quick Start Guide

## Prerequisites

Before starting, ensure you have:
- ✅ **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- ✅ **npm** (comes with Node.js)
- ✅ **Git** (optional, for version control)

Check your installations:
```bash
node --version
npm --version
```

---

## 🎯 Quick Start (Automated)

### Option 1: Windows Batch Script (Recommended for Windows)
Double-click `start-dev.bat` or run:
```cmd
start-dev.bat
```

### Option 2: PowerShell Script
Right-click `start-dev.ps1` → "Run with PowerShell" or run:
```powershell
.\start-dev.ps1
```

### Option 3: Manual Start (All Platforms)
See "Manual Setup" section below.

---

## 📋 What the Automated Scripts Do

1. ✅ Check Node.js installation
2. ✅ Install backend dependencies (if needed)
3. ✅ Install frontend dependencies (if needed)
4. ✅ Seed database with test data (if needed)
5. ✅ Start backend server (Port 5000)
6. ✅ Start frontend server (Port 3000)
7. ✅ Open application in browser

---

## 🔧 Manual Setup

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 3: Seed Database (First Time Only)
```bash
cd backend
npm run seed
```

### Step 4: Start Backend Server
```bash
cd backend
npm run dev
```
Backend will start on: http://localhost:5000

### Step 5: Start Frontend Server (New Terminal)
```bash
cd frontend
npm run dev
```
Frontend will start on: http://localhost:3000

---

## 🌐 Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 🔐 Test Accounts

Use these accounts to test the application:

| Role | Email | Password |
|------|-------|----------|
| **Consumer** | consumer@test.com | consumer123 |
| **Farmer** | farmer1@test.com | farmer123 |
| **Admin** | admin@smartfarming.com | admin123 |

---

## 📱 Application Features

### For Consumers
1. Browse 35+ products with images
2. Add items to cart
3. Place orders
4. View order history

### For Farmers
1. Add new products
2. Manage inventory
3. View orders
4. Update product details

### For Admins
1. Approve products
2. Manage users
3. View all orders
4. System administration

---

## 🛠️ Troubleshooting

### Issue: Port Already in Use

**Backend (Port 5000)**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**Frontend (Port 3000)**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue: Dependencies Not Installing

1. Clear npm cache:
```bash
npm cache clean --force
```

2. Delete node_modules and reinstall:
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database Not Found

Re-seed the database:
```bash
cd backend
npm run seed
```

### Issue: CORS Errors

Ensure backend is running on port 5000 and frontend on port 3000. Check `.env` files:

**backend/.env**
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-here-change-in-production
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

### Issue: Images Not Loading

1. Verify images exist in `frontend/public/images/`
2. Check browser console for 404 errors
3. Ensure frontend server is running

---

## 🔄 Restarting Servers

### Stop Servers
- Close the terminal windows
- Or press `Ctrl + C` in each terminal

### Restart Servers
Run the startup script again or manually start each server.

---

## 📊 Development Commands

### Backend Commands
```bash
cd backend

# Start development server
npm run dev

# Run tests
npm test

# Seed database
npm run seed

# Build for production
npm run build

# Start production server
npm start
```

### Frontend Commands
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🗂️ Project Structure

```
smart-farming-360/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Database, env config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── server.ts       # Express app
│   ├── tests/              # Unit tests
│   └── smart_farming.db    # SQLite database
│
├── frontend/               # Frontend React app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   └── App.tsx         # Main app component
│   └── public/
│       └── images/         # Product images
│
├── start-dev.bat           # Windows startup script
├── start-dev.ps1           # PowerShell startup script
└── START.md                # This file
```

---

## 🎨 Design System

- **Primary Color**: #2E7D32 (Green)
- **Secondary Color**: #FF9800 (Orange)
- **Font**: Plus Jakarta Sans
- **Style**: Modern, Clean, Animated

---

## 📚 Additional Documentation

- `README.md` - Project overview
- `COMPLETE_GUIDE.md` - Full implementation guide
- `API.md` - API documentation
- `PRODUCTS_VERIFICATION.md` - Products verification
- `FINAL_STATUS.md` - Project status

---

## 🆘 Getting Help

### Common Issues

1. **"Cannot find module"** → Run `npm install` in the affected directory
2. **"Port already in use"** → Kill the process using that port
3. **"Database error"** → Re-run `npm run seed` in backend
4. **"CORS error"** → Check backend is running on port 5000
5. **"Images not loading"** → Verify images in `frontend/public/images/`

### Check Server Status

**Backend Health Check**
```bash
curl http://localhost:5000/health
```

**Frontend**
Open http://localhost:3000 in browser

---

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] Node.js is installed (v18+)
- [ ] Backend dependencies installed (`backend/node_modules` exists)
- [ ] Frontend dependencies installed (`frontend/node_modules` exists)
- [ ] Database seeded (`backend/smart_farming.db` exists)
- [ ] Backend server running (http://localhost:5000/health responds)
- [ ] Frontend server running (http://localhost:3000 loads)
- [ ] No console errors in browser
- [ ] Images folder exists (`frontend/public/images/`)

---

## 🎉 Success!

If you see:
- ✅ Backend: "Server running on port 5000"
- ✅ Frontend: "Local: http://localhost:3000/"
- ✅ Browser opens to the application

**You're all set! Start exploring Smart Farming 360!** 🚀

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the documentation files
3. Check the console logs for errors
4. Verify all prerequisites are met

---

**Last Updated**: Context Transfer Session
**Version**: 1.0.0
**Status**: ✅ Production Ready
