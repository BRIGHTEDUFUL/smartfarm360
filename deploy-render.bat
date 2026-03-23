@echo off
REM Smart Farming 360 - Render Deployment Script (Windows)

echo 🚀 Deploying Smart Farming 360 to Render...

REM Check if git is initialized
if not exist .git (
    echo 📦 Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
)

REM Check if remote exists
git remote | findstr origin >nul
if errorlevel 1 (
    echo ❌ No git remote found!
    echo Please add your GitHub repository:
    echo git remote add origin https://github.com/yourusername/smart-farming-360.git
    exit /b 1
)

REM Build locally to test
echo 🔨 Building locally to test...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed! Fix errors before deploying.
    exit /b 1
)

echo ✅ Build successful!

REM Push to GitHub
echo 📤 Pushing to GitHub...
git add .
git commit -m "Deploy to Render - %date% %time%"
git push origin main

echo.
echo ✅ Code pushed to GitHub!
echo.
echo 📋 Next steps:
echo 1. Go to https://render.com
echo 2. Click 'New +' → 'Web Service'
echo 3. Connect your GitHub repository
echo 4. Use these settings:
echo    - Build Command: npm run build
echo    - Start Command: npm run start:prod
echo    - Environment: Node
echo 5. Add environment variables:
echo    - NODE_ENV=production
echo    - JWT_ACCESS_SECRET=^<generate-strong-secret^>
echo    - JWT_REFRESH_SECRET=^<generate-strong-secret^>
echo.
echo 🎉 Your app will be live in 5-10 minutes!

pause
