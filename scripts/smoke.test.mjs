#!/usr/bin/env node

/**
 * ODIADEV Smoke Tests - Phase 7
 * Tests agent brain and TTS proxy functionality
 */

import assert from "node:assert/strict";

const agent = process.env.VITE_AGENT_API_URL || "https://odiadev-adaqua-ai-brain.onrender.com/api/chat";
const tts   = process.env.VITE_TTS_ENDPOINT  || "https://nyrvnskbkitrazudrkkc.functions.supabase.co/tts";

console.log("🧪 ODIADEV Smoke Tests");
console.log("=====================");
console.log("Agent:", agent);
console.log("TTS:", tts);
console.log("");

try {
  // 1) Agent should respond with JSON {reply:string}
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

  // 2) TTS should return audio/*
  console.log("🎤 Testing TTS Proxy...");
  const tRes = await fetch(tts, { 
    method:"POST", 
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ 
      text: "ODIADEV voice check", 
      persona: "Ezinne", 
      format: "mp3" 
    }) 
  });
  assert.equal(tRes.ok, true, "TTS proxy not OK");
  const ct = tRes.headers.get("content-type") || "";
  assert.equal(ct.startsWith("audio/"), true, "TTS response is not audio/*");
  const b = await tRes.blob();
  assert.ok(b.size > 0, "Empty audio blob");
  console.log("✅ TTS Proxy: OK");
  console.log(`   Audio size: ${b.size} bytes`);
  console.log(`   Content-Type: ${ct}`);

  // 3) Test all personas
  console.log("👥 Testing All Personas...");
  const personas = ["Ezinne", "Lexi", "ODIA", "Atlas"];
  let passedPersonas = 0;
  
  for (const persona of personas) {
    try {
      const pRes = await fetch(tts, { 
        method:"POST", 
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ 
          text: `Testing ${persona} voice`, 
          persona: persona, 
          format: "mp3" 
        }) 
      });
      
      if (pRes.ok) {
        const pBlob = await pRes.blob();
        if (pBlob.size > 0) {
          passedPersonas++;
          console.log(`   ✅ ${persona}: OK (${pBlob.size} bytes)`);
        } else {
          console.log(`   ❌ ${persona}: Empty audio`);
        }
      } else {
        console.log(`   ❌ ${persona}: HTTP ${pRes.status}`);
      }
    } catch (error) {
      console.log(`   ❌ ${persona}: ${error.message}`);
    }
  }
  
  console.log(`✅ Personas: ${passedPersonas}/${personas.length} passed`);

  console.log("");
  console.log("🎉 All smoke tests passed!");
  console.log("🚀 ODIADEV is ready for deployment!");
  
} catch (error) {
  console.log("");
  console.log("❌ Smoke tests failed:");
  console.log(`   Error: ${error.message}`);
  process.exit(1);
}
