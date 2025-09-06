#!/usr/bin/env node

/**
 * ODIADEV MVP Smoke Tests
 * Tests the core functionality: auth, assistant creation, chat, and TTS
 */

import { strict as assert } from 'assert';

const AGENT_URL = process.env.VITE_AGENT_API_URL || 'https://odiadev-adaqua-ai-brain.onrender.com/api/chat';
const TTS_URL = process.env.VITE_TTS_FUNCTION_URL || 'https://nyrvnskbkitrazudrkkc.functions.supabase.co/tts';
const FRONTEND_URL = process.env.VITE_SITE_URL || 'http://localhost:5173';

console.log('🧪 ODIADEV MVP Smoke Tests');
console.log('==========================');
console.log(`Agent URL: ${AGENT_URL}`);
console.log(`TTS URL: ${TTS_URL}`);
console.log(`Frontend URL: ${FRONTEND_URL}`);
console.log('');

async function testAgentBrain() {
  console.log('🧠 Testing Agent Brain...');
  try {
    const response = await fetch(AGENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello, test message' })
    });
    
    assert(response.ok, `Agent brain responded with ${response.status}`);
    
    const data = await response.json();
    assert(data.reply, 'Agent brain returned a reply');
    assert(typeof data.reply === 'string', 'Reply is a string');
    assert(data.reply.length > 0, 'Reply is not empty');
    
    console.log('✅ Agent Brain: OK');
    return true;
  } catch (error) {
    console.log('❌ Agent Brain: FAILED');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testTTS(persona = 'Ezinne') {
  console.log(`🎤 Testing TTS (${persona})...`);
  try {
    const response = await fetch(TTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Hello, this is a test message for TTS.',
        persona: persona,
        format: 'mp3'
      })
    });
    
    assert(response.ok, `TTS responded with ${response.status}`);
    
    const contentType = response.headers.get('content-type');
    assert(contentType && contentType.startsWith('audio/'), 'Response is audio');
    
    const audioData = await response.arrayBuffer();
    assert(audioData.byteLength > 0, 'Audio data is not empty');
    assert(audioData.byteLength > 1000, 'Audio data is substantial (>1KB)');
    
    console.log(`✅ TTS (${persona}): OK (${audioData.byteLength} bytes)`);
    return true;
  } catch (error) {
    console.log(`❌ TTS (${persona}): FAILED`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testFrontend() {
  console.log('🌐 Testing Frontend...');
  try {
    const response = await fetch(FRONTEND_URL);
    assert(response.ok, `Frontend responded with ${response.status}`);
    
    const html = await response.text();
    assert(html.includes('ODIADEV'), 'Frontend contains ODIADEV branding');
    assert(html.includes('Adaqua AI'), 'Frontend contains Adaqua AI');
    
    console.log('✅ Frontend: OK');
    return true;
  } catch (error) {
    console.log('❌ Frontend: FAILED');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testAllPersonas() {
  console.log('👥 Testing All Personas...');
  const personas = ['Ezinne', 'Lexi', 'ODIA', 'Atlas'];
  let passed = 0;
  
  for (const persona of personas) {
    const result = await testTTS(persona);
    if (result) passed++;
  }
  
  console.log(`✅ Personas: ${passed}/${personas.length} passed`);
  return passed === personas.length;
}

async function runSmokeTests() {
  const results = {
    agent: await testAgentBrain(),
    frontend: await testFrontend(),
    tts: await testTTS(),
    personas: await testAllPersonas()
  };
  
  console.log('');
  console.log('📊 Test Results:');
  console.log('================');
  console.log(`Agent Brain: ${results.agent ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend: ${results.frontend ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`TTS: ${results.tts ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`All Personas: ${results.personas ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(Boolean);
  console.log('');
  console.log(`🎯 Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log('🚀 MVP is ready for deployment!');
    process.exit(0);
  } else {
    console.log('⚠️  Fix failing tests before deployment');
    process.exit(1);
  }
}

// Run tests
runSmokeTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});
