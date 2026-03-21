# Smart Farming 360 - Setup Guide

This guide will walk you through setting up the Smart Farming 360 application from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for version control)

## Step 1: Install Dependencies

### Option 1: Install all dependencies at once (recommended)

From the root directory:

```bash
npm run install:all
```

### Option 2: Install separately

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

## Step 2: Database Setup

### Create PostgreSQL Database

1. Open PostgreSQL command line or pgAdmin

2. Create the database:
   ```sql
   CREATE DATABASE smart_farming_db;
   ```

3. (Optional) Create a dedicated user:
   ```sql
   CREATE USER smart_farming_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE smart_farming_db TO smart_farming_user;
   ```

### Alternative: Use the setup script

```bash
psql -U postgres -f backend/scripts/setup-db.sql
```

## Step 3: Configure Environment Variables

### Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and update the following required variables:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=smart_farming_db
   DB_USER=postgres
   DB_PASSWORD=your_database_password

   # JWT Secrets (IMPORTANT: Change these in production!)
   JWT_ACCESS_SECRET=your_very_secure_access_secret_here
   JWT_REFRESH_SECRET=your_very_secure_refresh_secret_here

   # Email Configuration (for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

### Frontend Configuration

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. The default values should work for local development:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Smart Farming 360
   ```

## Step 4: Run Database Migrations

From the backend directory:

```bash
cd backend
npm run migrate:up
```

This will create all the necessary database tables and indexes.

## Step 5: Start the Application

### Option 1: Run both backend and frontend together (recommended)

From the root directory:

```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:3000`

### Option 2: Run separately

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend (in a new terminal):**
```bash
cd frontend
npm run dev
```

## Step 6: Verify Installation

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the Smart Farming 360 homepage
3. Check the backend health endpoint: `http://localhost:5000/health`

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Verify PostgreSQL is running:
   ```bash
   # On macOS/Linux
   sudo service postgresql status
   
   # On Windows
   # Check Services app for PostgreSQL service
   ```

2. Check your database credentials in `backend/.env`

3. Ensure the database exists:
   ```bash
   psql -U postgres -l
   ```

### Port Already in Use

If port 5000 or 3000 is already in use:

1. Change the port in `backend/.env`:
   ```env
   PORT=5001
   ```

2. Update the frontend proxy in `frontend/vite.config.ts` if you changed the backend port

### Migration Errors

If migrations fail:

1. Check database connection
2. Ensure you have proper permissions
3. Try rolling back and re-running:
   ```bash
   npm run migrate:down
   npm run migrate:up
   ```

### Module Not Found Errors

If you see "module not found" errors:

1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Next Steps

After successful setup:

1. Review the [README.md](README.md) for project overview
2. Check the API documentation (to be added)
3. Start implementing features according to the task list in `.kiro/specs/smart-farming-auth-shop/tasks.md`

## Development Workflow

### Creating Database Migrations

```bash
cd backend
npm run migrate:create add_new_feature
```

Edit the generated migration file in `backend/migrations/`, then run:

```bash
npm run migrate:up
```

### Running Tests

Backend tests:
```bash
cd backend
npm test
```

Frontend tests:
```bash
cd frontend
npm test
```

### Building for Production

```bash
# From root directory
npm run build
```

This will create production builds in:
- `backend/dist/`
- `frontend/dist/`

## Additional Configuration

### Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `EMAIL_PASSWORD` in `.env`

### Cloud Storage Setup (Optional)

For production, you'll want to configure cloud storage for images:

**AWS S3:**
```env
CLOUD_STORAGE_PROVIDER=s3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

**Cloudinary:**
```env
CLOUD_STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Support

For issues or questions, please refer to the project documentation or contact the development team.
