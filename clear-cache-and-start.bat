@echo off
echo ========================================
echo Clearing Browser Cache and Restarting Dev Server
echo ========================================
echo.

echo Step 1: Stopping any running processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Clearing Vite cache...
cd frontend
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist dist rmdir /s /q dist
echo Vite cache cleared!
echo.

echo Step 3: Starting development server...
echo.
echo ========================================
echo IMPORTANT: After the server starts:
echo 1. Open your browser
echo 2. Press Ctrl+Shift+R (hard refresh)
echo 3. Or press F12, right-click refresh, select "Empty Cache and Hard Reload"
echo ========================================
echo.

start cmd /k "npm run dev"

cd ..
echo.
echo Dev server is starting in a new window...
echo Please wait for it to be ready, then hard refresh your browser!
pause
