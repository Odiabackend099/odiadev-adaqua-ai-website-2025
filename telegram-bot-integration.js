/**
 * ODIADEV Telegram Bot Integration
 * Connects Telegram bot to ODIADEV AI Brain
 * 
 * Bot Details:
 * - Name: Adaqua AI Bot
 * - Username: @Adaqua_AI_bot
 * - Token: 8220781503:AAFWjcLZxYIaYdvpgQWwfjlDDwD_nws6tJY
 * - URL: t.me/Adaqua_AI_bot
 */

const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

// Bot configuration
const BOT_TOKEN = '8220781503:AAFWjcLZxYIaYdvpgQWwfjlDDwD_nws6tJY';
const ODIADEV_AI_URL = process.env.ODIADEV_AI_URL || 'http://localhost:10000/api/chat';

// Initialize bot
const bot = new TelegramBot(BOT_TOKEN, {polling: true});

console.log('🤖 Adaqua AI Telegram Bot Started');
console.log('📱 Bot URL: t.me/Adaqua_AI_bot');
console.log('🧠 Connected to ODIADEV AI Brain');

// Handle incoming messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;
  const userName = msg.from.first_name || 'User';

  console.log(`📨 Message from ${userName}: ${userMessage}`);

  try {
    // Send typing indicator
    await bot.sendChatAction(chatId, 'typing');

    // Get response from ODIADEV AI Brain
    const response = await fetch(ODIADEV_AI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        user: userName,
        platform: 'telegram'
      })
    });

    if (!response.ok) {
      throw new Error(`AI Brain API error: ${response.status}`);
    }

    const data = await response.json();
    const aiReply = data.reply || 'Sorry, I could not process your message at this time.';

    // Send AI response
    await bot.sendMessage(chatId, aiReply);
    console.log(`✅ Response sent to ${userName}`);

  } catch (error) {
    console.error('❌ Error processing message:', error);
    
    // Send fallback message
    await bot.sendMessage(chatId, 
      'Sorry, I\'m experiencing technical difficulties. Please try again later. ' +
      'For immediate assistance, you can contact ODIADEV support at info.odiadev@outlook.com'
    );
  }
});

// Handle /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'there';

  const welcomeMessage = `
👋 Hello ${userName}! Welcome to Adaqua AI!

I'm your intelligent assistant powered by ODIADEV - Nigeria's leading voice AI company. I can help you with:

🤖 AI-powered conversations
💬 Business inquiries
📞 Technical support
🎯 General assistance

Just type your message and I'll respond with intelligent, contextual answers!

For more information about ODIADEV, visit: https://odia.dev
  `;

  await bot.sendMessage(chatId, welcomeMessage);
});

// Handle /help command
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;

  const helpMessage = `
🆘 Adaqua AI Help

Available commands:
/start - Welcome message
/help - Show this help
/about - About ODIADEV
/contact - Contact information

Just type any message to chat with me! I'm powered by advanced AI technology and can help with various topics.

For business inquiries, contact:
📧 info.odiadev@outlook.com
📱 WhatsApp: +234 810 578 6326
  `;

  await bot.sendMessage(chatId, helpMessage);
});

// Handle /about command
bot.onText(/\/about/, async (msg) => {
  const chatId = msg.chat.id;

  const aboutMessage = `
🏢 About ODIADEV

ODIADEV is Nigeria's leading voice AI company, specializing in:

🎤 Voice AI solutions
🤖 Conversational AI agents
📱 Multi-platform integration
🌍 Nigerian market expertise

Our AI technology powers:
• Web chat widgets
• WhatsApp assistants
• Telegram bots
• Voice-enabled applications

Visit us at: https://odia.dev
Contact: info.odiadev@outlook.com
  `;

  await bot.sendMessage(chatId, aboutMessage);
});

// Handle /contact command
bot.onText(/\/contact/, async (msg) => {
  const chatId = msg.chat.id;

  const contactMessage = `
📞 Contact ODIADEV

Get in touch with us:

📧 Email: info.odiadev@outlook.com
📧 Support: support.odiadev@outlook.com
📧 Founder: austyn@odia.dev

📱 WhatsApp: +234 810 578 6326
📱 SMS: +234 810 578 6326

🌐 Website: https://odia.dev
📱 Telegram: @Adaqua_AI_bot

We're here to help with your AI needs!
  `;

  await bot.sendMessage(chatId, contactMessage);
});

// Error handling
bot.on('error', (error) => {
  console.error('❌ Bot error:', error);
});

bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Adaqua AI Telegram Bot...');
  bot.stopPolling();
  process.exit(0);
});

console.log('✅ Bot is running and ready to receive messages!');
