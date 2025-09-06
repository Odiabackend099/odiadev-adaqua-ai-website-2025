import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowed = (process.env.ALLOWED_ORIGINS || 'https://odia.dev,https://*.odia.dev,http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: function (origin, cb) {
    if (!origin) return cb(null, true);
    const ok = allowed.some((a) =>
      a === origin ||
      (a.includes('*.odia.dev') && origin.endsWith('.odia.dev'))
    );
    cb(ok ? null : new Error('CORS blocked'), ok ? true : false);
  },
  credentials: false
}));

// Rate limiting
app.use('/api/', rateLimit({
  windowMs: (Number(process.env.RATE_LIMIT_WINDOW || 60)) * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 60),
  standardHeaders: true,
  legacyHeaders: false
}));

// Middleware
app.use(express.json({ limit: '1mb' }));

// GROQ client (only if API key is available)
let groq = null;
if (process.env.GROQ_API_KEY) {
  try {
    const { Groq } = await import('groq-sdk');
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log('✅ GROQ client initialized');
  } catch (error) {
    console.warn('⚠️ GROQ SDK not available, using fallback responses');
  }
}

// Fallback responses (when GROQ is not available)
const generateFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm Adaqua AI by ODIADEV. How can I help you today?";
  }
  
  // ODIADEV mission
  if (lowerMessage.includes('mission') || lowerMessage.includes('what is odiadev') || lowerMessage.includes('about odiadev')) {
    return "ODIADEV builds reliable voice agents for the web and WhatsApp, focusing on Nigeria-first AI solutions that work well on mobile networks.";
  }
  
  // Adaqua AI use cases
  if (lowerMessage.includes('use case') || lowerMessage.includes('what can you do') || lowerMessage.includes('capabilities')) {
    return "I can help with customer support, answer questions about ODIADEV services, provide information about our voice AI solutions, and assist with general inquiries. I work on both web and WhatsApp platforms.";
  }
  
  // Data protection
  if (lowerMessage.includes('privacy') || lowerMessage.includes('data') || lowerMessage.includes('gdpr')) {
    return "ODIADEV follows strict data protection practices. We only collect necessary information and never share your data with third parties without consent. All communications are encrypted and secure.";
  }
  
  // Pricing
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
    return "ODIADEV offers flexible pricing for voice AI solutions. Contact us for a custom quote based on your specific needs and usage requirements.";
  }
  
  // Contact information
  if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
    return "You can reach ODIADEV at hello@odia.dev or visit our website at https://odia.dev for more information about our voice AI solutions.";
  }
  
  // Default response
  return "I'm Adaqua AI, your intelligent assistant from ODIADEV. I can help you with information about our voice AI solutions, customer support, and general inquiries. How can I assist you today?";
};

// Chat endpoint with GROQ integration
app.post('/api/chat', async (req, res) => {
  try {
    const { message, system, history } = req.body || {};
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'invalid_message' });
    }

    let reply;

    if (groq) {
      // Use GROQ for intelligent responses
      try {
        const messages = [
          { 
            role: 'system', 
            content: system || `You are ${process.env.AGENT_NAME || 'Adaqua AI'} from ODIADEV. Be concise, helpful, and Nigeria-aware. Keep responses under 200 words.` 
          },
          ...(Array.isArray(history) ? history.slice(-5) : []), // Limit history
          { role: 'user', content: message }
        ];

        const response = await groq.chat.completions.create({
          model: 'llama-3.1-70b-versatile',
          messages,
          temperature: 0.3,
          max_tokens: 300
        });

        reply = response.choices?.[0]?.message?.content?.toString() || generateFallbackResponse(message);
      } catch (groqError) {
        console.error('GROQ error:', groqError);
        reply = generateFallbackResponse(message);
      }
    } else {
      // Use fallback responses
      reply = generateFallbackResponse(message);
    }

    res.json({ 
      reply, 
      persona: process.env.PERSONA_DEFAULT || 'Ezinne' 
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'ODIADEV Brain' });
});

// Health check for Render
app.get('/healthz', (req, res) => {
  res.json({ ok: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`🧠 ODIADEV Brain running on port ${PORT}`);
  console.log(`📡 Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🏥 Health check: http://localhost:${PORT}/healthz`);
  if (groq) {
    console.log('🤖 GROQ AI enabled');
  } else {
    console.log('⚠️ GROQ AI disabled (using fallback responses)');
  }
});

export default app;
