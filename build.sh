#!/bin/bash
set -e

echo "🚀 Building ODIADEV Application for Production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.vite/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Verify build
echo "✅ Verifying build..."
if [ -d "dist" ]; then
    echo "✅ Build successful! Files in dist/:"
    ls -la dist/
else
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "🎉 Build completed successfully!"
