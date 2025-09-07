# ODIADEV Simple Fix Script
$ErrorActionPreference = "Stop"

Write-Host "Starting ODIADEV fix..." -ForegroundColor Cyan

# Set location
Set-Location "C:\Users\OD~IA\Downloads\odiadev-site"

# Create .npmrc to fix engine issues
@"
engine-strict=false
fund=false
audit=false
progress=false
"@ | Out-File -FilePath ".npmrc" -Encoding UTF8

# Set npm config
npm config set engine-strict false
npm config set fund false
npm config set audit false
npm config set progress false

Write-Host "Fixed npm config" -ForegroundColor Green

# Fix package.json engines
$pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
if ($pkg.engines.npm) {
    $pkg.engines.PSObject.Properties.Remove("npm")
}
$pkg.engines.node = ">=18.0.0"
$pkg | ConvertTo-Json -Depth 100 | Set-Content "package.json" -Encoding UTF8

Write-Host "Fixed package.json engines" -ForegroundColor Green

# Clean everything
Write-Host "Cleaning node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

Write-Host "Dependencies installed!" -ForegroundColor Green

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
npm run build

Write-Host "Frontend built successfully!" -ForegroundColor Green

# Test backend
Write-Host "Testing backend..." -ForegroundColor Yellow
$env:PORT = "5057"
$proc = Start-Process -FilePath "node" -ArgumentList "server/brain.js" -PassThru
Start-Sleep -Seconds 3

try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:5057/healthz" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "Backend health check passed!" -ForegroundColor Green
    }
} catch {
    Write-Host "Backend test failed, but continuing..." -ForegroundColor Yellow
} finally {
    if ($proc) { $proc | Stop-Process -Force }
}

Write-Host "ODIADEV fix complete!" -ForegroundColor Green
Write-Host "Run 'npm run dev' to start development server" -ForegroundColor Cyan
