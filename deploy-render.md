# 🚀 ODIADEV Render Deployment Guide

## Quick Start

### 1. **Automatic Deployment (Recommended)**
- Push your code to GitHub
- Render will automatically detect the `render.yaml` file
- Both frontend and backend will be deployed automatically

### 2. **Manual Deployment**

#### **Frontend Service:**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `odiadev-frontend`
   - **Build Command:** `npm ci && npm run build`
   - **Publish Directory:** `dist`
   - **Node Version:** `20`

#### **Backend Service:**
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `odiadev-brain`
   - **Root Directory:** `server`
   - **Build Command:** `npm ci`
   - **Start Command:** `npm start`
   - **Node Version:** `20`

### 3. **Environment Variables**

#### **Frontend:**
```
VITE_SITE_URL=https://odiadev-frontend.onrender.com
VITE_AGENT_API_URL=https://odiadev-brain.onrender.com
VITE_TTS_PROXY_URL=https://nyrvnskbkitrazudrkkc.supabase.co/functions/v1/tts
VITE_SUPABASE_URL=https://nyrvnskbkitrazudrkkc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55cnZuc2tia2l0cmF6dWRya2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NjAwNTQsImV4cCI6MjA3MjMzNjA1NH0.4OjZqbrvXrF3N0CNpzUndh9HTKCtXiadA6NRQv98fCg
```

#### **Backend:**
```
NODE_ENV=production
GROQ_API_KEY=your-groq-api-key-here
ALLOWED_ORIGINS=https://odiadev-frontend.onrender.com,https://odia.dev,http://localhost:5173
RENDER_EXTERNAL_URL=https://odiadev-brain.onrender.com
```

### 4. **Custom Domains (Optional)**
- Add custom domain `odia.dev` to your frontend service
- Update CORS settings to include your custom domain

## 🎯 **Benefits of Render-Only Deployment**

✅ **Simplified Architecture** - One platform for everything
✅ **Cost Effective** - No need for multiple service subscriptions
✅ **Easier Management** - Single dashboard for all services
✅ **Better Integration** - Services can communicate seamlessly
✅ **Automatic Deployments** - Git-based deployments for both services

## 🔧 **Troubleshooting**

### Common Issues:
1. **Build Failures** - Check Node.js version (should be 20.x)
2. **CORS Errors** - Verify ALLOWED_ORIGINS includes your frontend URL
3. **Environment Variables** - Ensure all required variables are set
4. **Health Check Failures** - Verify backend is running on correct port

### Support:
- Check Render logs for detailed error messages
- Verify all environment variables are set correctly
- Test endpoints individually using curl or Postman
