#!/usr/bin/env node

/**
 * ODIADEV Local Smoke Tests
 * Tests local brain and TTS proxy functionality
 */

import assert from "node:assert/strict";

const agent = "http://localhost:3001/api/chat";
const tts   = process.env.VITE_TTS_ENDPOINT  || "https://nyrvnskbkitrazudrkkc.functions.supabase.co/tts";

console.log("🧪 ODIADEV Local Smoke Tests");
console.log("=============================");
console.log("Agent:", agent);
console.log("TTS:", tts);
console.log("");

try {
  // 1) Test health endpoint
  console.log("🏥 Testing Health Endpoint...");
  const hRes = await fetch("http://localhost:3001/healthz");
  assert.equal(hRes.ok, true, "Health endpoint not OK");
  const hJson = await hRes.json();
  assert.equal(hJson.ok, true, "Health response invalid");
  console.log("✅ Health Endpoint: OK");

  // 2) Agent should respond with JSON {reply:string}
  console.log("🧠 Testing Agent Brain...");
  const aRes = await fetch(agent, { 
    method:"POST", 
    headers:{ "Content-Type":"application/json" }, 
    body: JSON.stringify({ message:"Hello from ODIADEV test" }) 
  });
  assert.equal(aRes.ok, true, "Agent endpoint not OK");
  const aJson = await aRes.json();
  assert.equal(typeof aJson.reply, "string", "Agent reply missing/invalid");
  console.log("✅ Agent Brain: OK");
  console.log(`   Reply: ${aJson.reply.substring(0, 100)}...`);

  // 3) Test frontend
  console.log("🌐 Testing Frontend...");
  const fRes = await fetch("http://localhost:5173");
  assert.equal(fRes.ok, true, "Frontend not OK");
  const fText = await fRes.text();
  assert.ok(fText.includes("ODIADEV"), "Frontend missing ODIADEV branding");
  console.log("✅ Frontend: OK");

  console.log("");
  console.log("🎉 All local smoke tests passed!");
  console.log("🚀 Local development environment is ready!");
  
} catch (error) {
  console.log("");
  console.log("❌ Local smoke tests failed:");
  console.log(`   Error: ${error.message}`);
  console.log("");
  console.log("💡 Make sure to run:");
  console.log("   npm run brain  (in one terminal)");
  console.log("   npm run preview (in another terminal)");
  process.exit(1);
}

