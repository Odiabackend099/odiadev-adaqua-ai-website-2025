# ODIADEV Deployment Guide

## 🚀 Quick Deployment Summary

Your ODIADEV site is now **ready for full Render deployment** with all critical fixes implemented:

### ✅ **What's Fixed:**
- ✅ Brain server binds to `0.0.0.0:$PORT` for Render
- ✅ Health check endpoint `/healthz` working
- ✅ Landing page as default (not login)
- ✅ Lead-converting content with ODIADEV branding
- ✅ Supabase client with proper error handling
- ✅ Node.js 20.x and stable rollup versions
- ✅ All endpoints tested and working

### 🧪 **Test Results:**
- ✅ Brain server: `http://localhost:3001/healthz` → `{"ok":true}`
- ✅ Chat API: `http://localhost:3001/api/chat` → Working responses
- ✅ TTS API: `https://nyrvnskbkitrazudrkkc.supabase.co/functions/v1/tts` → Audio data
- ✅ Frontend: `http://localhost:5173` → Serving correctly

---

## 📋 **Deployment Steps**

### 1. **Push to GitHub**
```bash
git add .
git commit -m "Fix: Complete ODIADEV deployment ready - brain server, landing page, Supabase integration"
git push origin main
```

### 2. **Deploy Brain Server to Render**

**Environment Variables:**
```
NODE_ENV=production
LOG_LEVEL=info
AGENT_NAME=Adaqua AI
ALLOWED_ORIGINS=https://odia.dev,https://www.odia.dev,https://*.odia.dev,https://odiadev-adaqua-ai-brain.onrender.com,http://localhost:5173
GROQ_API_KEY=your-groq-key-here
```

**Render Settings:**
- **Root Directory:** `server`
- **Build Command:** `npm ci`
- **Start Command:** `npm start`
- **Health Check Path:** `/healthz`
- **Region:** Oregon (US West)

**Alternative: Use render.yaml**
- The `render.yaml` file is already configured
- Render will automatically detect and use it
- No manual configuration needed

### 3. **Deploy Frontend to Render (Static Site)**

**Environment Variables:**
```
VITE_SITE_URL=https://odiadev-frontend.onrender.com
VITE_AGENT_API_URL=https://odiadev-brain.onrender.com/api/chat
VITE_TTS_PROXY_URL=https://nyrvnskbkitrazudrkkc.supabase.co/functions/v1/tts
VITE_SUPABASE_URL=https://nyrvnskbkitrazudrkkc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55cnZuc2tia2l0cmF6dWRya2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NjAwNTQsImV4cCI6MjA3MjMzNjA1NH0.4OjZqbrvXrF3N0CNpzUndh9HTKCtXiadA6NRQv98fCg
```

**Render Settings:**
- **Environment:** Static Site
- **Build Command:** `npm ci && npm run build`
- **Publish Directory:** `dist`
- **Node.js Version:** `20.x`

### 4. **Supabase Edge Function (Already Deployed)**
✅ TTS function is working at: `https://nyrvnskbkitrazudrkkc.supabase.co/functions/v1/tts`

---

## 🔧 **Post-Deployment Verification**

### Test Brain Server:
```bash
curl https://odiadev-adaqua-ai-brain.onrender.com/healthz
# Expected: {"ok":true}
```

### Test Chat API:
```bash
curl -X POST https://odiadev-adaqua-ai-brain.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}'
# Expected: {"reply":"Hello! I'm Adaqua AI by ODIADEV. How can I help you today?"}
```

### Test Frontend:
1. Visit `https://odiadev-frontend.onrender.com`
2. Should see ODIADEV landing page with hero section
3. Chat widget should be visible
4. No console errors about missing Supabase env vars

### Test TTS:
```bash
curl -X POST https://nyrvnskbkitrazudrkkc.supabase.co/functions/v1/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello Nigeria","persona":"Ezinne","format":"mp3"}' \
  -o test-audio.mp3
# Expected: Audio file downloaded
```

---

## 🎯 **Key Features Ready**

### **Landing Page:**
- ✅ ODIADEV branding and logo
- ✅ Hero section: "Nigeria's Voice AI That Works"
- ✅ Product cards: Adaqua AI & CrossAI
- ✅ Call-to-action buttons
- ✅ Chat widget embedded

### **Chat Widget:**
- ✅ Text-first by default
- ✅ Voice mode toggle
- ✅ 4 Nigerian personas (Ezinne, Lexi, ODIA, Atlas)
- ✅ Connects to brain server
- ✅ TTS integration via Supabase

### **Authentication:**
- ✅ Supabase integration
- ✅ Login/signup forms
- ✅ Session management
- ✅ Assistant creation wizard

### **Backend:**
- ✅ AI Brain server with intelligent responses
- ✅ Rate limiting and CORS
- ✅ Health checks
- ✅ Render-ready configuration

---

## 🚨 **Security Notes**

1. **Environment Variables:** Never commit `.env` files to Git
2. **API Keys:** Use Render/Vercel environment variable settings
3. **CORS:** Properly configured for production domains
4. **Rate Limiting:** Enabled on brain server
5. **Supabase:** Using anon key (safe for frontend)

---

## 📞 **Support**

If you encounter issues:
1. Check Render logs for both frontend and backend services
2. Verify environment variables are set correctly
3. Test endpoints individually
4. Check Supabase dashboard for function logs
5. Ensure CORS settings allow your Render domains

**Your ODIADEV site is production-ready on Render! 🎉**
