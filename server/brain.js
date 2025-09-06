import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// AI Agent Brain - Simple but effective responses
const generateResponse = (message) => {
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
  if (lowerMessage.includes('data') && (lowerMessage.includes('protect') || lowerMessage.includes('privacy') || lowerMessage.includes('secure'))) {
    return "Your data is protected through secure encryption and we follow privacy best practices. We don't store personal conversations and only process what's necessary to provide our services.";
  }
  
  // Pidgin responses
  if (lowerMessage.includes('pidgin') || lowerMessage.includes('speak pidgin')) {
    return "Wetin you wan know? I fit help you with any question about ODIADEV and our voice AI services. Just ask me anything!";
  }
  
  // Voice AI questions
  if (lowerMessage.includes('voice') || lowerMessage.includes('audio') || lowerMessage.includes('speech')) {
    return "I support voice interactions! Toggle the Voice mode to hear my responses. I can speak in different Nigerian personas - Ezinne (warm female), Lexi (bold female), ODIA (deep male), and Atlas (warm male).";
  }
  
  // Technical questions
  if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
    return "I use advanced AI to understand your messages and provide helpful responses. When voice is enabled, I convert my text responses to natural-sounding Nigerian speech using our TTS technology.";
  }
  
  // Default responses
  const responses = [
    "That's interesting! Can you tell me more about what you're looking for?",
    "I'm here to help with any questions about ODIADEV and our AI services. What would you like to know?",
    "Great question! I can help you understand more about our voice AI solutions. What specific aspect interests you?",
    "I'm Adaqua AI, your conversational assistant. How can I make your day better?",
    "Thanks for reaching out! I'm here to help with information about ODIADEV's voice AI technology."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

// Chat endpoint
app.post('/api/chat', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    if (message.length > 5000) {
      return res.status(400).json({ error: 'Message too long' });
    }
    
    const reply = generateResponse(message);
    
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'ODIADEV Brain' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🧠 ODIADEV Brain running on port ${PORT}`);
  console.log(`📡 Chat endpoint: http://localhost:${PORT}/api/chat`);
});

export default app;