# 🚀 Smart Farming 360 - Quick Start

## Choose Your Mode

### 🔧 Development Mode (Hot Reload)
**Use this when developing/coding**

```bash
npm run dev
```

- Frontend: http://localhost:3000 (Vite dev server)
- Backend: http://localhost:5000 (Express API)
- Changes reload automatically
- Best for development

---

### 🌐 Production Mode (Unified Server)
**Use this for production/deployment**

```bash
npm run start:unified
```

- Everything: http://localhost:5000
- Frontend served by backend
- Optimized and bundled
- Best for production

---

## 📋 Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development servers (2 servers) |
| `npm run start:unified` | Build and start unified server (1 server) |
| `npm run build` | Build frontend and backend |
| `npm run install:all` | Install all dependencies |
| `npm test` | Run all tests |

---

## 🎯 What's the Difference?

### Development Mode
```
┌─────────────┐         ┌─────────────┐
│   Vite      │  API    │   Express   │
│  :3000      │ ──────> │   :5000     │
│  (Frontend) │         │  (Backend)  │
└─────────────┘         └─────────────┘
```

### Production Mode
```
┌──────────────────────────┐
│      Express :5000       │
│  ┌────────┐  ┌────────┐ │
│  │Frontend│  │   API  │ │
│  │ Static │  │ /api/* │ │
│  └────────┘  └────────┘ │
└──────────────────────────┘
```

---

## 🔑 Default Credentials

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

## 🆘 Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Frontend not loading
```bash
npm run build --prefix frontend
```

### Dependencies issues
```bash
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
```

---

## 📖 More Info

- Full guide: [UNIFIED_SERVER_GUIDE.md](UNIFIED_SERVER_GUIDE.md)
- Setup: [SETUP.md](SETUP.md)
- Deployment: [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)
