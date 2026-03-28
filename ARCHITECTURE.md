# 🏗️ Smart Farming 360 - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Browser    │  │    Mobile    │  │   Tablet     │ │
│  │  (Desktop)   │  │   (Phone)    │  │   (iPad)     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              FRONTEND (React + TypeScript)              │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Pages → Components → Contexts → Services        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│            BACKEND (Node.js + Express)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Routes → Controllers → Services → Database      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 DATABASE (SQLite)                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Users | Products | Orders | Cart | Audit        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- React 18 + TypeScript
- Vite (Build Tool)
- React Router v6
- Axios (HTTP Client)
- Tailwind CSS + Custom CSS

### Backend
- Node.js + Express
- TypeScript
- SQLite (better-sqlite3)
- JWT Authentication
- Bcrypt (Password Hashing)

### DevOps
- Git (Version Control)
- Docker (Containerization)
- Render/Railway (Hosting)

## Data Flow

```
User Action → React Component → API Service → 
Backend Route → Controller → Service → Database
```

For complete details, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
