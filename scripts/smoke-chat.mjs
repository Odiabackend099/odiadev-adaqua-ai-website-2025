import assert from "node:assert/strict";

const AGENT = process.env.VITE_AGENT_API_URL || "http://localhost:3001/api/chat";
const TTS = process.env.VITE_TTS_FUNCTION_URL || "https://nyrvnskbkitrazudrkkc.functions.supabase.co/tts";
const PERSONAS = ["Ezinne","Lexi","ODIA","Atlas"];

async function postJSON(url, body) {
  const r = await fetch(url, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
  const ct = r.headers.get("content-type")||"";
  const t = await r.text();
  return { ok:r.ok, ct, body:t, res:r };
}

async function postBinary(url, body) {
  const r = await fetch(url, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
  const ct = r.headers.get("content-type")||"";
  const buf = await r.arrayBuffer();
  return { ok:r.ok, ct, body:buf, res:r };
}

async function testAgent() {
  const { ok, body } = await postJSON(AGENT, { message: "Say hello in one sentence." });
  assert.ok(ok, "Agent brain did not respond OK");
  assert.ok(body.length > 0, "Agent empty reply");
  console.log("✓ Agent reply OK");
}

async function testTTS(persona) {
  const { ok, ct, body } = await postBinary(TTS, { text: "Adaqua AI by ODIADEV is ready.", persona, format: "mp3" });
  assert.ok(ok, `TTS request failed for ${persona}`);
  assert.ok(ct.startsWith("audio/"), `TTS returned non-audio for ${persona} (ct=${ct})`);
  assert.ok(body.byteLength > 128, `TTS audio too small for ${persona}`);
  console.log(`✓ TTS audio OK for ${persona} (${body.byteLength} bytes)`);
}

await testAgent();
for (const p of PERSONAS) await testTTS(p);
console.log("All smoke tests passed.");