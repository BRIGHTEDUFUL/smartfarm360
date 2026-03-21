# Smart Farming 360 🌾

[![GitHub](https://img.shields.io/badge/GitHub-smartfarm360-green)](https://github.com/BRIGHTEDUFUL/smartfarm360)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)

A modern full-stack e-commerce platform connecting Ghanaian farmers directly with consumers. Built with React, TypeScript, Node.js, Express, and SQLite.

## ✨ Features

- **🔐 Advanced Authentication**: JWT-based auth with role-based access control (Admin, Farmer, Consumer)
- **🛒 E-Commerce**: Complete shopping cart, checkout, and order management
- **📦 Product Management**: 35+ products across 7 categories with real images
- **🎨 Modern UI**: Beautiful animations, glassmorphism effects, and responsive design
- **⚡ Performance**: Fast loading, smooth animations (60fps), optimized images
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Automated Setup (Recommended)

**Windows**:
```cmd
start-dev.bat
```

**PowerShell**:
```powershell
.\start-dev.ps1
```

Both scripts will:
1. Check Node.js installation
2. Install dependencies
3. Seed database
4. Start both servers
5. Open browser automatically

### Manual Setup

**Backend**:
```bash
cd backend
npm install
npm run seed
npm run dev
```

**Frontend** (new terminal):
```bash
cd frontend
npm install
npm run dev
```

**Access**:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🔐 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Consumer | consumer@test.com | consumer123 |
| Farmer | farmer1@test.com | farmer123 |
| Admin | admin@smartfarming.com | admin123 |

## 📦 Products

**35 Products** across **7 Categories**:
- 🥬 Vegetables (5)
- 🍎 Fruits (5)
- 🌾 Grains & Cereals (8)
- 🐔 Poultry & Eggs (4)
- 🥩 Meat (6)
- 🥛 Dairy (1)
- 🌶️ Spices & Condiments (6)

All products have real images and detailed information.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (sql.js)
- **Auth**: JWT with refresh tokens
- **Security**: bcrypt, Helmet, CORS
- **Testing**: Jest (37 tests passing)

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State**: Context API
- **HTTP**: Axios
- **Styling**: Custom CSS with animations
- **Icons**: Font Awesome
- **Notifications**: React Toastify

## 📁 Project Structure

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
│   ├── tests/              # Unit tests (37 passing)
│   └── smart_farming.db    # SQLite database
│
├── frontend/               # Frontend React app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   └── App.tsx         # Main app
│   └── public/
│       └── images/         # 44 product images
│
├── start-dev.bat           # Windows startup script
├── start-dev.ps1           # PowerShell startup script
└── START.md                # Detailed setup guide
```

## 🎨 Design System

- **Primary**: #2E7D32 (Green)
- **Secondary**: #FF9800 (Orange)
- **Font**: Plus Jakarta Sans
- **Style**: Modern, Clean, Animated

## 📚 Documentation

- **[START.md](START.md)** - Complete setup guide
- **[COMPLETE_GUIDE.md](COMPLETE_GUIDE.md)** - Full implementation details
- **[API.md](backend/API.md)** - API documentation
- **[PRODUCTS_VERIFICATION.md](PRODUCTS_VERIFICATION.md)** - Products list
- **[FINAL_STATUS.md](FINAL_STATUS.md)** - Project status
- **[STARTUP_VERIFICATION.md](STARTUP_VERIFICATION.md)** - Startup verification

## 🧪 Testing

**Backend**:
```bash
cd backend
npm test
```

**Coverage**: 37 tests passing (Auth service & controller)

## 🔧 Development Commands

### Backend
```bash
npm run dev      # Start dev server
npm test         # Run tests
npm run seed     # Seed database
npm run build    # Build for production
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Farmer)
- `PUT /api/products/:id` - Update product (Farmer)
- `DELETE /api/products/:id` - Delete product (Farmer)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

## 🎯 Features Implemented

### Authentication Pages
- ✅ Split-screen layout with hero section
- ✅ Animated background (floating orbs)
- ✅ Floating product images
- ✅ Password show/hide toggle
- ✅ Quick login buttons (testing)
- ✅ Role selection (Consumer/Farmer)
- ✅ Loading states with spinners

### Home Page
- ✅ Hero with parallax scrolling
- ✅ Floating product cards
- ✅ Features showcase
- ✅ Categories grid
- ✅ How it works section
- ✅ Testimonials
- ✅ CTA sections
- ✅ Footer with newsletter

### Shop Page
- ✅ Animated hero banner
- ✅ 35 products with images
- ✅ Category filtering
- ✅ Search functionality
- ✅ Sort options
- ✅ Add to cart
- ✅ Wishlist
- ✅ Quick view modal
- ✅ Shimmer effects on hover

### Shopping Cart
- ✅ Add/update/remove items
- ✅ Real-time cart count
- ✅ Stock validation
- ✅ Cart drawer
- ✅ Checkout flow

## 🚧 Troubleshooting

### Port Already in Use
```cmd
# Kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependencies Issues
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Database Issues
```bash
# Re-seed database
cd backend
npm run seed
```

See **[START.md](START.md)** for complete troubleshooting guide.

## ✅ Status

- ✅ Backend: Running on port 5000
- ✅ Frontend: Running on port 3000
- ✅ Database: 35 products seeded
- ✅ Images: All 44 images present
- ✅ Tests: 37 passing
- ✅ Authentication: Working
- ✅ Cart: Working
- ✅ Orders: Working

**Status**: 🎉 Production Ready

## 📞 Support

For issues:
1. Check [START.md](START.md) troubleshooting section
2. Review console logs
3. Verify all prerequisites
4. Check [STARTUP_VERIFICATION.md](STARTUP_VERIFICATION.md)

## 📄 License

MIT

---

**Version**: 1.0.0  
**Last Updated**: Context Transfer Session  
**Status**: ✅ Complete & Production Ready
