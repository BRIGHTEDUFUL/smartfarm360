@echo off
echo ========================================
echo  Smart Farming 360 - Unified Server
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install --prefix backend
call npm install --prefix frontend
echo.

echo [2/3] Building frontend...
call npm run build --prefix frontend
echo.

echo [3/3] Starting server...
echo.
echo Server will run on: http://localhost:5000
echo Press Ctrl+C to stop
echo.
call npm start --prefix backend
