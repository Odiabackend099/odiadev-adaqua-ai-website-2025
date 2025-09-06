# ODIADEV Production Build Script for Windows
Write-Host "🚀 Building ODIADEV Application for Production..." -ForegroundColor Green

# Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path "node_modules\.vite") { Remove-Item -Recurse -Force "node_modules\.vite" }

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Yellow
npm run build

# Verify build
Write-Host "✅ Verifying build..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Write-Host "✅ Build successful! Files in dist/:" -ForegroundColor Green
    Get-ChildItem -Path "dist" | Format-Table Name, Length, LastWriteTime
} else {
    Write-Host "❌ Build failed - dist directory not found" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Build completed successfully!" -ForegroundColor Green
