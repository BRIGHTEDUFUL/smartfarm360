@echo off
echo ========================================
echo  Smart Farming 360 - Development Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Checking Node.js version...
node --version
echo.

REM Check if backend dependencies are installed
if not exist "backend\node_modules\" (
    echo [2/5] Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo.
) else (
    echo [2/5] Backend dependencies already installed
    echo.
)

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules\" (
    echo [3/5] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo.
) else (
    echo [3/5] Frontend dependencies already installed
    echo.
)

REM Check if database needs seeding
if not exist "backend\smart_farming.db" (
    echo [4/5] Database not found. Seeding database...
    cd backend
    call npm run seed
    cd ..
    echo.
) else (
    echo [4/5] Database already exists
    echo.
)

echo [5/5] Starting servers...
echo.
echo ========================================
echo  Starting Backend Server (Port 5000)
echo ========================================
start "Smart Farming Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo  Starting Frontend Server (Port 3000)
echo ========================================
start "Smart Farming Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo  Servers Starting...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to open the application in your browser...
pause >nul

start http://localhost:3000

echo.
echo ========================================
echo  Development servers are running!
echo ========================================
echo.
echo To stop the servers, close the terminal windows.
echo.
