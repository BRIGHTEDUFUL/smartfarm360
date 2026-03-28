# 📁 Smart Farming 360 - Project Structure

## 🎯 Overview

This document defines the standardized project structure for Smart Farming 360, a full-stack e-commerce platform for Ghana's agricultural sector.

---

## 📂 Root Directory Structure

```
smart-farming-360/
├── .github/                    # GitHub configuration
├── .kiro/                      # Kiro AI specs and workflows
├── backend/                    # Backend application (Node.js + Express)
├── frontend/                   # Frontend application (React + TypeScript)
├── docs/                       # Project documentation
├── images/                     # Static product images
├── node_modules/               # Root dependencies
├── .gitignore                  # Git ignore rules
├── CHANGELOG.md                # Version history
├── CONTRIBUTING.md             # Contribution guidelines
├── Dockerfile                  # Docker configuration
├── LICENSE                     # Project license
├── package.json                # Root package configuration
├── README.md                   # Project overview
├── SETUP.md                    # Setup instructions
└── [Various guides].md         # Feature-specific guides
```

---

## 🔧 Backend Structure

```
backend/
├── coverage/                   # Test coverage reports
├── dist/                       # Compiled TypeScript output
├── logs/                       # Application logs
│   ├── combined.log           # All logs
│   └── error.log              # Error logs only
├── migrations/                 # Database migrations
│   ├── .gitkeep
│   ├── 001_create_audit_logs.sql
│   ├── 002_add_user_status.sql
│   ├── 003_add_order_fields.sql
│   ├── 004_add_product_image_url.sql
│   └── README.md
├── node_modules/              # Backend dependencies
├── scripts/                   # Database setup scripts
│   └── setup-db.sql
├── src/                       # Source code
│   ├── config/               # Configuration files
│   │   ├── database.ts       # Database connection
│   │   ├── env.ts            # Environment variables
│   │   └── migrate.ts        # Migration runner
│   ├── controllers/          # Route controllers
│   │   ├── audit.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── order.controller.ts
│   │   ├── product.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/           # Express middleware
│   │   ├── audit.middleware.ts
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.ts
│   │   └── upload.middleware.ts
│   ├── routes/               # API routes
│   │   ├── audit.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── order.routes.ts
│   │   ├── product.routes.ts
│   │   └── user.routes.ts
│   ├── scripts/              # Utility scripts
│   │   ├── seed.ts           # Database seeding
│   │   └── verify-products.ts
│   ├── services/             # Business logic
│   │   ├── audit.service.ts
│   │   ├── auth.service.ts
│   │   ├── cart.service.ts
│   │   ├── order.service.ts
│   │   ├── product.service.ts
│   │   └── user.service.ts
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   ├── logger.ts
│   │   └── validation.ts
│   └── server.ts             # Application entry point
├── tests/                     # Test files
│   ├── controllers/
│   │   └── auth.controller.test.ts
│   ├── migrations/
│   ├── services/
│   │   └── auth.service.test.ts
│   └── setup.ts              # Test configuration
├── uploads/                   # Uploaded files
│   └── products/             # Product images
├── .env                       # Environment variables (local)
├── .env.example              # Environment template
├── .gitignore                # Backend git ignore
├── API.md                    # API documentation
├── jest.config.js            # Jest configuration
├── jest.unit.config.js       # Unit test config
├── package.json              # Backend dependencies
├── smart_farming.db          # SQLite database
├── SQLITE_MIGRATION.md       # Migration guide
└── tsconfig.json             # TypeScript config
```

### Backend Architecture Layers

```
┌─────────────────────────────────────┐
│         Routes Layer                │
│  (HTTP endpoints, validation)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Controllers Layer              │
│  (Request/Response handling)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Services Layer                │
│  (Business logic)                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Database Layer                │
│  (SQLite queries)                   │
└─────────────────────────────────────┘
```

---

## 🎨 Frontend Structure

```
frontend/
├── dist/                      # Production build output
├── node_modules/             # Frontend dependencies
├── public/                   # Static assets
│   ├── icons/               # App icons
│   │   ├── cart-icon.svg
│   │   ├── icon-base.svg
│   │   ├── orders-icon.svg
│   │   ├── shop-icon.svg
│   │   ├── generate-icons.html
│   │   ├── GENERATE_ICONS.md
│   │   └── README.md
│   ├── images/              # Product images
│   │   ├── [50+ product images]
│   │   └── hero-farm.jpg
│   ├── check-css.html       # CSS testing
│   ├── mobile-debug.html    # Mobile debugging
│   ├── mobile-interaction-test.html
│   ├── test-mobile-click.html
│   └── test-mobile-responsiveness.html
├── src/                      # Source code
│   ├── components/          # Reusable components
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Navbar.tsx
│   │   ├── Navbar.css
│   │   ├── ProtectedRoute.tsx
│   │   └── ScrollToTop.tsx
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── pages/               # Page components
│   │   ├── AboutPage.tsx
│   │   ├── AboutPage.css
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminDashboard.css
│   │   ├── AuthPages.css
│   │   ├── CartPage.tsx
│   │   ├── CartPage.css
│   │   ├── CheckoutPage.tsx
│   │   ├── CheckoutPage.css
│   │   ├── ContactPage.tsx
│   │   ├── ContactPage.css
│   │   ├── FarmerDashboard.tsx
│   │   ├── FarmerDashboard.css
│   │   ├── HomePage.tsx
│   │   ├── HomePage.css
│   │   ├── LoginPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── OrdersPage.css
│   │   ├── ProductDetailPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ShopPage.tsx
│   │   └── ShopPage.css
│   ├── services/            # API services
│   │   └── api.ts
│   ├── styles/              # Global styles
│   │   ├── ErrorBoundary.css
│   │   ├── LoadingSpinner.css
│   │   └── ScrollToTop.css
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Root component
│   ├── index.css            # Global styles
│   ├── main.tsx             # Application entry
│   └── vite-env.d.ts        # Vite types
├── .env                      # Environment variables (local)
├── .env.example             # Environment template
├── .env.production          # Production environment
├── .gitignore               # Frontend git ignore
├── DESIGN_SYSTEM.md         # Design system guide
├── index.html               # HTML template
├── package.json             # Frontend dependencies
├── postcss.config.js        # PostCSS config
├── tailwind.config.js       # Tailwind config
├── tsconfig.json            # TypeScript config
├── tsconfig.node.json       # Node TypeScript config
├── UI_REFERENCE.md          # UI component reference
└── vite.config.ts           # Vite configuration
```

### Frontend Architecture

```
┌─────────────────────────────────────┐
│         Pages Layer                 │
│  (Route components)                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Components Layer               │
│  (Reusable UI components)           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Contexts Layer                │
│  (Global state management)          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Services Layer                │
│  (API communication)                │
└─────────────────────────────────────┘
```

---

## 📚 Documentation Structure

```
docs/
├── DEPLOYMENT_GUIDE.md        # Complete deployment guide
├── DEPLOYMENT_SUMMARY.md      # Quick deployment summary
├── FORMSPREE_INTEGRATION.md   # Formspree setup
├── GHANA_UPDATES.md           # Ghana-specific features
├── GITHUB_SETUP.md            # GitHub configuration
├── PWA_IMPLEMENTATION.md      # PWA features (removed)
├── PWA_TESTING_GUIDE.md       # PWA testing (removed)
├── QUICK_DEPLOY.md            # 10-minute deployment
├── README.md                  # Documentation index
└── SYNC_IMPROVEMENTS.md       # Sync features
```

---

## 🔐 Configuration Files

### Root Level
```
.gitignore                     # Git ignore rules
.dockerignore                  # Docker ignore rules
Dockerfile                     # Docker configuration
package.json                   # Root package config
```

### Backend
```
backend/.env                   # Local environment
backend/.env.example          # Environment template
backend/tsconfig.json         # TypeScript config
backend/jest.config.js        # Test configuration
```

### Frontend
```
frontend/.env                  # Local environment
frontend/.env.example         # Environment template
frontend/.env.production      # Production environment
frontend/tsconfig.json        # TypeScript config
frontend/vite.config.ts       # Build configuration
frontend/tailwind.config.js   # Tailwind CSS config
```

---

## 🚀 Scripts and Utilities

### Root Scripts
```
start-dev.bat                  # Windows dev start
start-dev.ps1                  # PowerShell dev start
start-unified.bat              # Windows unified server
start-unified.sh               # Linux/Mac unified server
deploy-render.bat              # Windows deployment
deploy-render.sh               # Linux/Mac deployment
```

### Package.json Scripts
```json
{
  "dev": "Start development servers",
  "build": "Build frontend and backend",
  "start": "Start production server",
  "start:unified": "Build and start unified server",
  "test": "Run all tests"
}
```

---

## 🗄️ Database Structure

### SQLite Database
```
backend/smart_farming.db       # Main database file

Tables:
├── users                      # User accounts
├── products                   # Product catalog
├── cart_items                 # Shopping cart
├── orders                     # Order records
├── order_items                # Order line items
└── audit_logs                 # Audit trail
```

### Migrations
```
backend/migrations/
├── 001_create_audit_logs.sql
├── 002_add_user_status.sql
├── 003_add_order_fields.sql
└── 004_add_product_image_url.sql
```

---

## 📦 Dependencies

### Backend Dependencies
```
Production:
- express          # Web framework
- cors             # CORS middleware
- helmet           # Security headers
- bcrypt           # Password hashing
- jsonwebtoken     # JWT authentication
- multer           # File uploads
- winston          # Logging
- dotenv           # Environment variables
- better-sqlite3   # SQLite database

Development:
- typescript       # Type safety
- ts-node-dev      # Development server
- jest             # Testing framework
- @types/*         # Type definitions
```

### Frontend Dependencies
```
Production:
- react            # UI library
- react-dom        # React DOM
- react-router-dom # Routing
- axios            # HTTP client
- react-toastify   # Notifications

Development:
- vite             # Build tool
- typescript       # Type safety
- tailwindcss      # CSS framework
- @types/*         # Type definitions
```

---

## 🎨 Naming Conventions

### Files
```
Components:     PascalCase.tsx      (e.g., Navbar.tsx)
Styles:         PascalCase.css      (e.g., Navbar.css)
Services:       camelCase.ts        (e.g., api.ts)
Types:          camelCase.ts        (e.g., index.ts)
Tests:          *.test.ts           (e.g., auth.test.ts)
Config:         kebab-case.js       (e.g., jest.config.js)
```

### Code
```
Variables:      camelCase           (e.g., userName)
Functions:      camelCase           (e.g., getUserData)
Classes:        PascalCase          (e.g., AuthService)
Constants:      UPPER_SNAKE_CASE    (e.g., API_URL)
Interfaces:     PascalCase          (e.g., User)
Types:          PascalCase          (e.g., UserRole)
```

### API Routes
```
Pattern:        /api/resource       (e.g., /api/products)
Methods:        RESTful verbs       (GET, POST, PUT, DELETE)
```

---

## 🔒 Security Files

```
.env files                     # Never commit to git
.gitignore                     # Excludes sensitive files
backend/uploads/               # User-uploaded content
backend/smart_farming.db       # Database file
backend/logs/                  # Log files
```

---

## 📊 File Size Guidelines

```
Components:     < 300 lines
Services:       < 400 lines
Controllers:    < 200 lines
Styles:         < 500 lines
```

---

## 🧪 Testing Structure

```
backend/tests/
├── controllers/               # Controller tests
├── services/                  # Service tests
├── migrations/                # Migration tests
└── setup.ts                   # Test configuration

frontend/tests/                # (To be added)
├── components/
├── pages/
└── utils/
```

---

## 📝 Documentation Standards

### Code Comments
```typescript
/**
 * Brief description
 * @param paramName - Parameter description
 * @returns Return value description
 */
```

### README Files
```
Each major directory should have a README.md explaining:
- Purpose
- Structure
- Usage
- Examples
```

---

## 🔄 Git Workflow

### Branch Structure
```
main                           # Production branch
develop                        # Development branch
feature/*                      # Feature branches
bugfix/*                       # Bug fix branches
hotfix/*                       # Hotfix branches
```

### Commit Messages
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

---

## 🚀 Deployment Structure

### Production Build
```
backend/dist/                  # Compiled backend
frontend/dist/                 # Built frontend
backend/uploads/               # User uploads
backend/smart_farming.db       # Database
```

### Environment Files
```
.env.production               # Production environment
.env.staging                  # Staging environment
.env.development              # Development environment
```

---

## 📈 Monitoring and Logs

```
backend/logs/
├── combined.log              # All logs
├── error.log                 # Error logs only
└── [date].log                # Daily logs

Log Levels:
- error                       # Errors only
- warn                        # Warnings and errors
- info                        # General information
- debug                       # Debug information
```

---

## 🎯 Best Practices

### File Organization
✅ Group by feature, not by type
✅ Keep related files together
✅ Use index files for exports
✅ Separate concerns (MVC pattern)

### Code Organization
✅ One component per file
✅ Extract reusable logic
✅ Use TypeScript interfaces
✅ Write self-documenting code

### Asset Organization
✅ Optimize images before adding
✅ Use descriptive file names
✅ Group by category
✅ Keep public assets minimal

---

## 📞 Support

For questions about project structure:
- Check this document first
- Review existing code examples
- Consult team lead
- Update this document when adding new patterns

---

**Last Updated**: 2026-03-24
**Version**: 1.0.0
