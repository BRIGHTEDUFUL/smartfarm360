@echo off
echo ========================================
echo Smart Farming 360 - Mobile Access Setup
echo ========================================
echo.
echo This will add a Windows Firewall rule to allow
echo mobile devices to access your dev server.
echo.
echo You need to run this as Administrator!
echo.
pause

echo.
echo Adding firewall rule for port 3000...
netsh advfirewall firewall add rule name="Vite Dev Server (Port 3000)" dir=in action=allow protocol=TCP localport=3000

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Firewall rule added.
    echo.
    echo Now you can access the app from your phone using:
    echo http://192.168.1.40:3000
    echo.
    echo Make sure:
    echo 1. Your phone and computer are on the same WiFi
    echo 2. Dev server is running (npm run dev)
    echo.
) else (
    echo.
    echo ❌ FAILED! You need to run this as Administrator.
    echo.
    echo Right-click this file and select "Run as administrator"
    echo.
)

pause
