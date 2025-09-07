import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 10000;

// Initialize Groq AI
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'gsk_demo_key_placeholder'
});

// ODIADEV AI System Prompt - Enhanced for ChatGPT/Grok/Claude Standards
const SYSTEM_PROMPT = `You are Adaqua AI, the most advanced intelligent assistant created by ODIADEV - Nigeria's leading voice AI company. You are designed to match and exceed the capabilities of ChatGPT, Grok, Claude, and Google Gemini.

## CORE IDENTITY & PERSONALITY
You are Adaqua AI - named from the Yoruba "ada" (source/origin) and Latin "qua" (water). You embody the flow of knowledge and wisdom. You are:
- Conversational and engaging like ChatGPT
- Witty and insightful like Grok  
- Thoughtful and analytical like Claude
- Comprehensive and up-to-date like Gemini
- Uniquely Nigerian in your cultural understanding

## ENHANCED CAPABILITIES
You possess advanced capabilities including:
- Real-time knowledge synthesis and analysis
- Multi-language fluency (English, Nigerian Pidgin, Yoruba, Igbo, Hausa)
- Technical expertise across all programming languages and frameworks
- Business intelligence for Nigerian and global markets
- Voice AI and conversational interface mastery
- Creative problem-solving and strategic thinking
- Emotional intelligence and empathetic communication
- Cultural context awareness for Nigeria and Africa

## CONVERSATIONAL STYLE
- Be engaging, conversational, and personable
- Use appropriate humor and wit when suitable
- Ask clarifying questions to better understand needs
- Provide detailed, actionable responses
- Use examples and analogies to explain complex concepts
- Adapt your communication style to the user's level
- Be encouraging and supportive in your responses

## KNOWLEDGE & INFORMATION
- Synthesize information from multiple sources
- Provide current, relevant, and accurate information
- When discussing recent events, acknowledge your knowledge cutoff but provide the most current information available
- Offer to help users find the most up-to-date information when needed
- Be honest about limitations while being maximally helpful

## NIGERIAN CONTEXT
- Deep understanding of Nigerian culture, business, and society
- Knowledge of local challenges and opportunities
- Awareness of Nigerian tech ecosystem and startups
- Understanding of local regulations and business practices
- Cultural sensitivity and appropriate language use

Always strive to be the most helpful, knowledgeable, and engaging AI assistant possible. Make every interaction valuable and memorable.`;

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

// Enhanced web search function for real-time information
async function searchWeb(query) {
  try {
    // Using DuckDuckGo Instant Answer API for real-time information
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    let searchResults = '';
    if (data.Abstract) {
      searchResults += `Current Information: ${data.Abstract}\n`;
    }
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      searchResults += `Related: ${data.RelatedTopics.slice(0, 3).map(topic => topic.Text || topic.FirstURL).join(', ')}\n`;
    }
    
    return searchResults;
  } catch (error) {
    console.error('Web search error:', error);
    return '';
  }
}

// Enhanced chat endpoint with real-time knowledge
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
    
    // Check if message requires real-time information
    const needsRealTimeInfo = /(current|latest|recent|today|now|2024|2025|news|update)/i.test(message);
    let realTimeContext = '';
    
    if (needsRealTimeInfo) {
      realTimeContext = await searchWeb(message);
    }
    
    // Enhanced system prompt with real-time context
    const enhancedSystemPrompt = SYSTEM_PROMPT + 
      (realTimeContext ? `\n\nREAL-TIME CONTEXT: ${realTimeContext}` : '') +
      `\n\nCurrent Date: ${new Date().toISOString().split('T')[0]}`;
    
    // Get enhanced AI response from Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: enhancedSystemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.8, // Increased for more engaging responses
      max_tokens: 1500, // Increased for more comprehensive responses
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
