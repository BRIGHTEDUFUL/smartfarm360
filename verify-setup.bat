@echo off
echo ========================================
echo  Smart Farming 360 - Setup Verification
echo ========================================
echo.

echo [1/8] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    node --version
    echo [OK] Node.js installed
) else (
    echo [ERROR] Node.js not found
    goto :error
)
echo.

echo [2/8] Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    npm --version
    echo [OK] npm installed
) else (
    echo [ERROR] npm not found
    goto :error
)
echo.

echo [3/8] Checking critical files...
if exist "package.json" (echo [OK] package.json) else (echo [ERROR] package.json missing & goto :error)
if exist "backend\package.json" (echo [OK] backend\package.json) else (echo [ERROR] backend\package.json missing & goto :error)
if exist "backend\src\server.ts" (echo [OK] backend\src\server.ts) else (echo [ERROR] backend\src\server.ts missing & goto :error)
if exist "frontend\package.json" (echo [OK] frontend\package.json) else (echo [ERROR] frontend\package.json missing & goto :error)
if exist "frontend\src\App.tsx" (echo [OK] frontend\src\App.tsx) else (echo [ERROR] frontend\src\App.tsx missing & goto :error)
echo.

echo [4/8] Checking environment files...
if exist "backend\.env" (echo [OK] backend\.env exists) else (echo [WARN] backend\.env missing - will use defaults)
if exist "frontend\.env" (echo [OK] frontend\.env exists) else (echo [WARN] frontend\.env missing - will use defaults)
echo.

echo [5/8] Checking directories...
if exist "backend\src" (echo [OK] backend\src) else (echo [ERROR] backend\src missing & goto :error)
if exist "backend\migrations" (echo [OK] backend\migrations) else (echo [ERROR] backend\migrations missing & goto :error)
if exist "backend\uploads" (echo [OK] backend\uploads) else (echo [ERROR] backend\uploads missing & goto :error)
if exist "frontend\src" (echo [OK] frontend\src) else (echo [ERROR] frontend\src missing & goto :error)
if exist "frontend\public" (echo [OK] frontend\public) else (echo [ERROR] frontend\public missing & goto :error)
echo.

echo [6/8] Checking dependencies...
if exist "backend\node_modules" (echo [OK] Backend dependencies installed) else (echo [WARN] Backend dependencies missing - run: npm install --prefix backend)
if exist "frontend\node_modules" (echo [OK] Frontend dependencies installed) else (echo [WARN] Frontend dependencies missing - run: npm install --prefix frontend)
echo.

echo [7/8] Checking database...
if exist "backend\smart_farming.db" (echo [OK] Database exists) else (echo [WARN] Database missing - will be created on first run)
echo.

echo [8/8] Checking frontend build...
if exist "frontend\dist\index.html" (echo [OK] Frontend build exists) else (echo [WARN] Frontend not built - run: npm run build --prefix frontend)
echo.

echo ========================================
echo  Verification Complete!
echo ========================================
echo.
echo [SUCCESS] All critical checks passed!
echo.
echo You can now run:
echo   npm run dev          - Development mode
echo   npm run start:unified - Production mode
echo.
goto :end

:error
echo.
echo ========================================
echo  Verification Failed!
echo ========================================
echo.
echo Please fix the errors above before running the app.
echo.
exit /b 1

:end
