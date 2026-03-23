@echo off
echo ========================================
echo Smart Farming 360 - Unified Startup
echo ========================================
echo.
echo Building frontend...
cd frontend
call npm run build
cd ..
echo.
echo Starting server on port 5000...
echo Frontend and Backend will run together
echo Open: http://localhost:5000
echo.
cd backend
call npm start
