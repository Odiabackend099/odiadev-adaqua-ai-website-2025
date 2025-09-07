#!/bin/bash
# Frontend build script for Render/Vercel

echo "🔧 Installing dependencies..."
npm ci

echo "🏗️ Building frontend..."
npm run build

echo "✅ Frontend build complete!"
ls -la dist/
