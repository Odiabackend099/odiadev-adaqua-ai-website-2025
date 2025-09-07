import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 10000;

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

// Chat endpoint
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }
  
  // Simple response for now
  const reply = `Hello! I'm Adaqua AI by ODIADEV. You said: "${message}". How can I help you today?`;
  
  res.json({ reply });
});

// Bind to all interfaces for Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🧠 ODIADEV Brain running on 0.0.0.0:${PORT}`);
});

export default app;
