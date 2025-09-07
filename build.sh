#!/bin/bash
# Render deployment script

echo "🚀 ODIADEV Render Deployment Starting..."

# Install dependencies with legacy peer deps
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --no-audit --no-fund

# Build the application
echo "🔨 Building application..."
npm run build

# Verify build
if [ ! -f "dist/index.html" ]; then
  echo "❌ Build failed - no index.html found"
  exit 1
fi

echo "✅ ODIADEV Build Complete!"
ls -la dist/
