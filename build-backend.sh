#!/bin/bash
# Backend build script for Render

echo "🔧 Installing backend dependencies..."
cd server
npm ci

echo "✅ Backend dependencies installed!"
echo "🚀 Starting AI Brain server..."
npm start
