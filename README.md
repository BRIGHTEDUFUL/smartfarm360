# 🌾 Smart Farming 360

**Connecting Farmers and Consumers Across Ghana's 16 Regions**

A modern, full-stack e-commerce platform for Ghana's agricultural sector with PWA capabilities, offline support, and real-time order management.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

**Frontend**: http://localhost:3000  
**Backend**: http://localhost:5000

---

## 📦 Features

### For Consumers
- Browse products from 16 Ghana regions
- Real-time search and filtering
- Shopping cart with persistence
- Order tracking
- PWA installation
- Offline browsing

### For Farmers
- Product listing and management
- Inventory tracking
- Order processing
- Sales analytics
- Status updates

### For Admins
- User management
- Product approval
- Order oversight
- Audit logs
- System monitoring

---

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- React Router v6
- Axios (API calls)
- PWA (Service Worker)
- Custom CSS + Tailwind

### Backend
- Node.js + Express
- TypeScript
- SQLite database
- JWT authentication
- Bcrypt (password hashing)
- Winston (logging)

---

## 📚 Documentation

- **[Setup Guide](SETUP.md)** - Local development setup
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Deploy to production
- **[Quick Deploy](docs/QUICK_DEPLOY.md)** - 10-minute deployment
- **[API Documentation](backend/API.md)** - API endpoints
- **[PWA Guide](docs/PWA_IMPLEMENTATION.md)** - PWA features
- **[All Documentation](docs/)** - Complete documentation index
- **[Changelog](CHANGELOG.md)** - Version history

---

## 🚀 Deployment

### Quick Deploy to Render (Free)
```bash
# Windows
npm run deploy:render:win

# Linux/Mac
npm run deploy:render
```

Then connect your GitHub repo on [Render.com](https://render.com)

**See [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for all deployment options**

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend
```

---

## 📝 Scripts

```bash
# Development
npm run dev              # Start both frontend & backend
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only

# Build
npm run build            # Build both
npm run build:frontend   # Frontend only
npm run build:backend    # Backend only

# Production
npm start                # Build & start production server
npm run start:prod       # Start production server

# Deployment
npm run deploy:render:win    # Deploy to Render (Windows)
npm run deploy:render        # Deploy to Render (Linux/Mac)
npm run verify              # Verify local deployment
npm run verify:prod         # Verify production deployment
```

---

## 🔐 Test Accounts

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

## 🌍 Ghana Context

- **Currency**: Ghana Cedis (GH₵)
- **Regions**: All 16 regions supported
- **Payment**: Paystack integration ready
- **Mobile Money**: Integration ready
- **SMS**: Africa's Talking integration ready

---

## 📊 Project Structure

```
smart-farming-360/
├── backend/              # Express.js API
│   ├── src/
│   │   ├── config/      # Database, env config
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Auth, error handling
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── types/       # TypeScript types
│   ├── tests/           # Jest tests
│   └── migrations/      # Database migrations
├── frontend/            # React app
│   ├── public/          # Static assets, PWA files
│   └── src/
│       ├── components/  # React components
│       ├── contexts/    # React contexts
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── utils/       # Utilities
└── docs/                # Documentation
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 🆘 Support

### Issues?
1. Check [SETUP.md](SETUP.md) for setup issues
2. Check [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for deployment issues
3. Run verification: `npm run verify`
4. Check logs: `backend/logs/`

### Resources
- [GitHub Issues](https://github.com/yourusername/smart-farming-360/issues)
- [API Documentation](backend/API.md)
- [All Documentation](docs/)

---

## 🎉 Status

✅ **Production Ready**
- Full-stack application
- PWA capabilities
- Offline support
- Secure authentication
- Optimized performance
- Deployment ready

---

**Built with ❤️ for Ghana's Agricultural Sector**
