# PostgreSQL to SQLite Migration

## Changes Made

### 1. Dependencies Updated
**File:** `backend/package.json`
- ❌ Removed: `pg`, `@types/pg`, `node-pg-migrate`
- ✅ Added: `better-sqlite3`, `@types/better-sqlite3`
- Updated scripts: Replaced `migrate:up/down/create` with single `migrate` command

### 2. Database Configuration
**File:** `backend/src/config/database.ts`
- Replaced PostgreSQL Pool with SQLite Database
- Database stored in local file: `smart_farming.db`
- Maintained same `query()` and `getClient()` interface for compatibility
- Auto-converts PostgreSQL `$1, $2` placeholders to SQLite `?` placeholders
- Enabled foreign keys and WAL mode for better performance

### 3. Environment Configuration
**File:** `backend/src/config/env.ts`
- Simplified database config to just `path`
- Removed: host, port, name, user, password

**File:** `backend/.env.example`
- Updated to use `DB_PATH` instead of PostgreSQL connection params

### 4. Migration System
**File:** `backend/src/config/migrate.ts` (NEW)
- Single migration file with all 13 tables
- Converted PostgreSQL syntax to SQLite:
  - `SERIAL` → `INTEGER PRIMARY KEY AUTOINCREMENT`
  - `VARCHAR` → `TEXT`
  - `DECIMAL` → `REAL`
  - `TIMESTAMP` → `DATETIME`
  - `BOOLEAN` → `INTEGER` (0/1)
  - Triggers for `updated_at` columns

### 5. Git Ignore
**File:** `backend/.gitignore`
- Added `*.db`, `*.db-shm`, `*.db-wal` to ignore SQLite files

## Key Differences: PostgreSQL vs SQLite

| Feature | PostgreSQL | SQLite |
|---------|-----------|--------|
| Data Types | Strict typing | Dynamic typing |
| SERIAL | SERIAL | INTEGER PRIMARY KEY AUTOINCREMENT |
| BOOLEAN | BOOLEAN | INTEGER (0/1) |
| DECIMAL | DECIMAL(10,2) | REAL |
| VARCHAR | VARCHAR(255) | TEXT |
| TIMESTAMP | TIMESTAMP | DATETIME |
| Placeholders | $1, $2, $3 | ?, ?, ? |
| Concurrency | High | Moderate (WAL mode helps) |
| File-based | No | Yes (.db file) |

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Run Migrations
```bash
npm run migrate
```

This creates `smart_farming.db` with all 13 tables.

### 3. Start the Server
```bash
npm run dev
```

## Database Location

The SQLite database file is created at:
- **Development:** `backend/smart_farming.db`
- **Custom location:** Set `DB_PATH` in `.env`

## What Stays the Same

✅ All API routes unchanged
✅ All function names unchanged  
✅ All response formats unchanged
✅ Project structure unchanged
✅ Frontend code unchanged
✅ Business logic unchanged

## Testing

The test files remain unchanged. Update test setup to use SQLite:

```typescript
// In test setup, use in-memory database
import Database from 'better-sqlite3';
const testDb = new Database(':memory:');
```

## Notes

- SQLite is file-based, no server needed
- Foreign keys are enabled by default
- WAL mode enabled for better concurrency
- Automatic `updated_at` triggers work the same
- All CHECK constraints preserved
- All indexes preserved
