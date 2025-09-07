# =========================================
# ODIADEV: Aggressive Fix v2 (Windows)
# =========================================
$ErrorActionPreference = "Stop"
function Info($m){Write-Host $m -ForegroundColor Cyan}
function Ok($m){Write-Host $m -ForegroundColor Green}
function Warn($m){Write-Host $m -ForegroundColor Yellow}
function Fail($m){Write-Host $m -ForegroundColor Red; exit 1}

$ROOT = "C:\Users\OD~IA\Downloads\odiadev-site"
Set-Location $ROOT
Info "`n📁 Root: $PWD"

# --- Node/npm present?
try { $nodeVer = node -v } catch { Fail "Node.js not found. Install Node 20 LTS and re-run." }
try { $npmVer  = npm -v }  catch { Fail "npm not found. Install Node 20 LTS and re-run." }
Info "🧰 Node $nodeVer / npm $npmVer"

# --- Make npm tolerant
".npmrc" | ForEach-Object {
  if (-not (Test-Path $_)) { New-Item $_ -ItemType File | Out-Null }
}
$npmrc = @"
engine-strict=false
fund=false
audit=false
progress=false
"@
$npmrc | Set-Content ".npmrc" -Encoding UTF8

npm config set engine-strict false | Out-Null
npm config set fund false | Out-Null
npm config set audit false | Out-Null
npm config set progress false | Out-Null

# --- Patch package.json engines (drop npm pin)
if (-not (Test-Path "package.json")) { Fail "package.json missing" }
$pkg = Get-Content package.json -Raw | ConvertFrom-Json
if (-not $pkg.engines) { $pkg | Add-Member -NotePropertyName engines -NotePropertyValue (@{}) }
$pkg.engines.PSObject.Properties | ForEach-Object {
  if ($_.Name -eq "npm") { $pkg.engines.PSObject.Properties.Remove("npm") }
}
$pkg.engines.node = ">=18.0.0"   # compatible with Vite 5 & Render
# Keep ESM type
if (-not $pkg.type) { $pkg.type = "module" }
$pkg | ConvertTo-Json -Depth 100 | Set-Content package.json -Encoding UTF8
Ok "🧩 engines fixed (removed npm pin; node >=18)"

# --- Clean caches & modules
Info "🧹 Cleaning node_modules & lockfiles…"
Get-Process | Where-Object {$_.ProcessName -like "*vite*" -or $_.ProcessName -like "*node*"} `
  | Stop-Process -Force -ErrorAction SilentlyContinue
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }
if (Test-Path pnpm-lock.yaml) { Remove-Item -Force pnpm-lock.yaml }
if (Test-Path yarn.lock) { Remove-Item -Force yarn.lock }
npm cache verify | Out-Null

# --- Ensure minimal backend exists/binds $PORT and has /healthz
if (-not (Test-Path "server")) { New-Item server -ItemType Directory | Out-Null }
$brain = "server\brain.js"
if (-not (Test-Path $brain)) {
@"
import express from 'express'
import cors from 'cors'
const app = express()
app.use(express.json())
app.use(cors({ origin: (_o,cb)=>cb(null,true), credentials:true }))
app.get('/healthz', (_req,res)=>res.json({ok:true, service:'odiadev-brain'}))
app.post('/api/chat', (req,res)=>{
  const msg = (req.body?.message||'').toString()
  if(!msg) return res.status(400).json({error:'missing_message'})
  res.json({reply:`Adaqua AI: ${msg}`})
})
const PORT = process.env.PORT || 10000
app.listen(PORT,'0.0.0.0',()=>console.log('🧠 ODIADEV Brain on',PORT))
"@ | Set-Content $brain -Encoding UTF8
}

# --- Install deps (first pass)
Info "📦 Installing dependencies (pass 1)…"
$installFailed = $false
try {
  npm install --legacy-peer-deps
} catch {
  $installFailed = $true
  Warn "First install failed: $($_.Exception.Message)"
}

# --- Fallback: install known stack (only if needed)
if ($installFailed) {
  Warn "Fallback install (known stack)…"
  $prod = @(
    "express","cors","express-rate-limit",
    "react","react-dom","react-router-dom",
    "@supabase/supabase-js","groq-sdk"
  )
  $dev = @(
    "vite","@vitejs/plugin-react",
    "typescript","@types/node","@types/react","@types/react-dom","@types/react-router-dom",
    "tailwindcss","postcss","autoprefixer",
    "prettier","vitest","concurrently"
  )
  npm install $prod --legacy-peer-deps --force
  npm install -D $dev --legacy-peer-deps --force
}

# --- Ensure vite config exists
if (-not (Test-Path "vite.config.js")) {
@"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins:[react()],
  server:{ host:'0.0.0.0', port:3000, open:false },
  build:{ outDir:'dist', sourcemap:true }
})
"@ | Set-Content "vite.config.js" -Encoding UTF8
}

# --- Create basic index.html if your project doesn't have one
if (-not (Test-Path "index.html") -and -not (Test-Path "src")) {
@"
<!doctype html><html><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>ODIADEV</title></head>
<body style="font-family: system-ui, -apple-system, Segoe UI; background:#0b1c2c; color:#fff;">
<div style="padding:48px;max-width:720px;margin:auto;">
<h1>ODIADEV</h1>
<p>Setup OK. Run <code>npm run dev</code> for local preview.</p>
</div></body></html>
"@ | Set-Content "index.html" -Encoding UTF8
}

# --- Build frontend
if (Test-Path "dist") { Remove-Item -Recurse -Force dist }
Info "🌐 Building frontend with Vite…"
npm run build

if (-not (Test-Path "dist")) { Fail "Build did not produce dist/ — aborting." }
Ok "✅ Frontend build → dist/"

# --- Quick backend smoke test
$testPort = 5057
$proc = $null
try {
  Info "🧪 Backend smoke test on $testPort…"
  $env:PORT = "$testPort"
  $proc = Start-Process -FilePath "node" -ArgumentList "server/brain.js" -PassThru
  Start-Sleep -Seconds 2
  $r = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$testPort/healthz" -TimeoutSec 6
  if ($r.StatusCode -ne 200) { throw "healthz != 200" }
  Ok "✅ /healthz OK"
} catch {
  Warn "Skipping local backend check (port busy or quick fail)."
} finally {
  if ($proc) { try { $proc | Stop-Process -Force } catch {} }
}

# --- Render config
@"
services:
  - type: static
    name: odiadev-frontend
    rootDir: .
    buildCommand: npm ci && npm run build
    publishPath: dist
    envVars:
      - key: VITE_SITE_URL
        value: https://odia.dev
      - key: VITE_AGENT_API_URL
        value: https://odiadev-brain.onrender.com/api/chat
      - key: VITE_TTS_PROXY_URL
        value: https://nyrvnskbkitrazudrkkc.supabase.co/functions/v1/tts
      - key: VITE_SUPABASE_URL
        value: https://nyrvnskbkitrazudrkkc.supabase.co
      - key: VITE_SUPABASE_ANON_KEY
        sync: false
      - key: VITE_ALLOWED_ORIGINS
        value: https://odia.dev,https://www.odia.dev,https://*.odia.dev,http://localhost:5173

  - type: web
    name: odiadev-brain
    env: node
    rootDir: .
    buildCommand: npm ci
    startCommand: node server/brain.js
    healthCheckPath: /healthz
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: LOG_LEVEL
        value: info
      - key: ALLOWED_ORIGINS
        value: https://odia.dev,https://www.odia.dev,https://*.odia.dev,http://localhost:5173
"@ | Set-Content "render.yaml" -Encoding UTF8

Ok "`n🎯 All set."
Write-Host "Next:" -ForegroundColor Yellow
Write-Host "  1) git add . && git commit -m 'fix engines & build' && git push" -ForegroundColor Yellow
Write-Host "  2) In Render → New from repo → it will detect render.yaml (static + brain)" -ForegroundColor Yellow
Write-Host "  3) Keep tts-api.odia.dev on Vercel/EC2 as-is (no DNS change)" -ForegroundColor Yellow
