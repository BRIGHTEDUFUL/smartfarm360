# Smart Farming 360 - Development Setup Script (PowerShell)

Write-Host "========================================" -ForegroundColor Green
Write-Host " Smart Farming 360 - Development Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
Write-Host "[1/5] Checking Node.js installation..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check and install backend dependencies
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "[2/5] Installing backend dependencies..." -ForegroundColor Cyan
    Set-Location backend
    npm install
    Set-Location ..
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[2/5] ✓ Backend dependencies already installed" -ForegroundColor Green
    Write-Host ""
}

# Check and install frontend dependencies
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "[3/5] Installing frontend dependencies..." -ForegroundColor Cyan
    Set-Location frontend
    npm install
    Set-Location ..
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[3/5] ✓ Frontend dependencies already installed" -ForegroundColor Green
    Write-Host ""
}

# Check if database needs seeding
if (-not (Test-Path "backend\smart_farming.db")) {
    Write-Host "[4/5] Database not found. Seeding database..." -ForegroundColor Cyan
    Set-Location backend
    npm run seed
    Set-Location ..
    Write-Host "✓ Database seeded successfully" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[4/5] ✓ Database already exists" -ForegroundColor Green
    Write-Host ""
}

Write-Host "[5/5] Starting servers..." -ForegroundColor Cyan
Write-Host ""

# Start Backend Server
Write-Host "========================================" -ForegroundColor Green
Write-Host " Starting Backend Server (Port 5000)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"

Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " Starting Frontend Server (Port 3000)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " Servers Starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Waiting for servers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Open browser
Write-Host "Opening application in browser..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " Development servers are running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Test Accounts:" -ForegroundColor Yellow
Write-Host "  Consumer: consumer@test.com / consumer123" -ForegroundColor White
Write-Host "  Farmer:   farmer1@test.com / farmer123" -ForegroundColor White
Write-Host "  Admin:    admin@smartfarming.com / admin123" -ForegroundColor White
Write-Host ""
Write-Host "To stop the servers, close the PowerShell windows." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit this window"
