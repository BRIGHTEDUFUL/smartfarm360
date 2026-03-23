Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Smart Farming 360 - Unified Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
Set-Location ..

Write-Host ""
Write-Host "Starting server on port 5000..." -ForegroundColor Green
Write-Host "Frontend and Backend will run together" -ForegroundColor Green
Write-Host "Open: http://localhost:5000" -ForegroundColor Green
Write-Host ""

Set-Location backend
npm start
