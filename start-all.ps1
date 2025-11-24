# PowerShell script to start all services
Write-Host "Starting Authentication System..." -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Start External PIN API
Write-Host "1. Starting External PIN API (Port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\external-pin-api'; npm start"
Start-Sleep -Seconds 2

# Start Backend API
Write-Host "2. Starting Backend API (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "3. Starting Frontend (Port 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\vite-project'; npm run dev"

Write-Host ""
Write-Host "=================================" -ForegroundColor Green
Write-Host "All services starting..." -ForegroundColor Green
Write-Host ""
Write-Host "External PIN API: http://localhost:3001" -ForegroundColor Yellow
Write-Host "Backend API:      http://localhost:3000" -ForegroundColor Yellow
Write-Host "Frontend:         http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
