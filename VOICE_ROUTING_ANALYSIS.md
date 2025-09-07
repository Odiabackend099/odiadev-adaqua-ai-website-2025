# ODIADEV Voice Routing Analysis

## 🔍 **Issue Identified**
The TTS system is generating different file sizes for different personas, but the actual voice quality/differences may not be audible enough.

## 📊 **Test Results**

### File Size Analysis:
- **Ezinne** (naija_female_warm): 61,824 bytes
- **Lexi** (naija_female_bold): 64,128 bytes  
- **ODIA** (naija_male_deep): 58,368 bytes
- **Atlas** (naija_male_warm): 72,192 bytes

### ✅ **What's Working:**
1. **Supabase Edge Function**: Correctly mapping personas to voice IDs
2. **Frontend TTS Library**: Properly sending persona and voice_id
3. **API Responses**: Different file sizes indicate different audio generation
4. **ChatWidget**: Fixed `ttsReady` variable to use `VITE_TTS_PROXY_URL`

### ❌ **Potential Issues:**

#### 1. **TTS Service Configuration**
The underlying TTS service (tts-api.odia.dev) may not have properly configured voice models:
- Voice IDs might not be properly mapped to distinct voice models
- The service might be falling back to a default voice
- Voice models might be too similar to distinguish

#### 2. **Voice Model Quality**
- The voice models might not be sufficiently different
- Audio quality might be too compressed to hear differences
- Voice characteristics might be subtle

#### 3. **Environment Variables**
Missing or incorrect TTS service configuration:
- `ODIADEV_TTS_URL` - Base URL of TTS service
- `ODIADEV_TTS_ENDPOINT` - API endpoint path
- `ODIADEV_API_KEY` - Authentication key
- Voice model configuration on the TTS service

## 🔧 **Required Fixes**

### 1. **Verify TTS Service Configuration**
Check that the TTS service (tts-api.odia.dev) has:
- Proper voice model files for each voice ID
- Correct API endpoint configuration
- Valid authentication keys

### 2. **Test TTS Service Directly**
```bash
# Test each voice ID directly against the TTS service
curl -X POST "https://tts-api.odia.dev/v1/tts" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, I am Ezinne","voice_id":"naija_female_warm","format":"mp3"}'
```

### 3. **Update Voice Model Configuration**
Ensure the TTS service has distinct voice models:
- `naija_female_warm` - Warm, friendly female voice
- `naija_female_bold` - Confident, professional female voice  
- `naija_male_deep` - Deep, authoritative male voice
- `naija_male_warm` - Warm, approachable male voice

### 4. **Add Voice Quality Validation**
Implement audio analysis to verify voice differences:
- Audio fingerprinting to detect voice model differences
- Frequency analysis to verify distinct voice characteristics
- Duration and pitch analysis

## 🎯 **Immediate Actions**

1. **Check TTS Service Logs**: Verify the service is receiving correct voice_id parameters
2. **Test Direct API Calls**: Bypass Supabase and test TTS service directly
3. **Verify Voice Models**: Ensure distinct voice models are deployed
4. **Update Environment Variables**: Confirm all TTS service configuration is correct

## 📋 **Environment Variables to Verify**

```env
ODIADEV_TTS_URL=https://tts-api.odia.dev
ODIADEV_TTS_ENDPOINT=/v1/tts
ODIADEV_API_KEY=your-api-key-here
ODIADEV_TTS_FORMAT=mp3
ODIADEV_TTS_TIMEOUT=120
ODIADEV_TTS_MAX_TEXT=5000
```

## 🎵 **Expected Behavior**
Each persona should produce distinctly different voices:
- **Ezinne**: Warm, friendly female voice
- **Lexi**: Bold, professional female voice
- **ODIA**: Deep, authoritative male voice  
- **Atlas**: Warm, approachable male voice

The current implementation is correctly routing to different voice IDs, but the underlying TTS service may need configuration updates to provide sufficiently distinct voice models.
