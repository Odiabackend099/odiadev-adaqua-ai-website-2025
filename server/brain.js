import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';

const app = express();
const PORT = process.env.PORT || 10000;

// Initialize Groq AI
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'gsk_demo_key_placeholder'
});

// ODIADEV AI System Prompt
const SYSTEM_PROMPT = `You are Adaqua AI, the intelligent assistant created by ODIADEV - Nigeria's leading voice AI company. 

Your capabilities include:
- Natural conversation in English and Nigerian Pidgin
- Technical assistance and coding help
- Business advice for Nigerian entrepreneurs
- Voice AI and technology expertise
- Local market insights for Nigeria

Your strengths:
- Deep understanding of Nigerian business landscape
- Expertise in voice AI and conversational interfaces
- Ability to provide practical, actionable advice
- Cultural awareness and local context

Your weaknesses:
- Limited to information available in your training data
- Cannot perform real-time actions or access external systems
- May not have the most current information beyond your knowledge cutoff

Always be helpful, professional, and culturally aware. If you don't know something, say so honestly.`;

// CORS for Render
app.use(cors({
  origin: function (origin, callback) {
    // Allow Render domains and development
    const allowed = [
      'https://odia.dev',
      'https://www.odia.dev',
      'https://odiadev-frontend.onrender.com',
      'http://localhost:5173'
    ];
    
    if (!origin || allowed.some(a => a === origin || origin.endsWith('.onrender.com'))) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked'));
    }
  }
}));

app.use(express.json({ limit: '1mb' }));

// Health check for Render
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'ODIADEV Brain' });
});

app.get('/healthz', (req, res) => {
  res.json({ ok: true });
});

// Chat endpoint with real AI responses
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }
    
    // Check if we have a valid Groq API key
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'gsk_demo_key_placeholder') {
      // Fallback response when no API key is available
      const fallbackReply = `Hello! I'm Adaqua AI by ODIADEV. I'm currently in demo mode. To get real AI responses, please configure the GROQ_API_KEY environment variable. Your message was: "${message}". How can I help you today?`;
      return res.json({ reply: fallbackReply });
    }
    
    // Get real AI response from Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      stream: false,
      stop: null,
    });
    
    const reply = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response at this time.";
    
    res.json({ reply });
    
  } catch (error) {
    console.error('AI Chat Error:', error);
    
    // Fallback response on error
    const fallbackReply = `I apologize, but I'm experiencing technical difficulties. Please try again later. Error: ${error.message}`;
    res.json({ reply: fallbackReply });
  }
});

// Bind to all interfaces for Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🧠 ODIADEV Brain running on 0.0.0.0:${PORT}`);
});

export default app;
