/**
 * ODIADEV Widget Bundle
 * Standalone widget component for embedding
 */

import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

// Simplified retry logic for widget
const withBackoff = async (fn: () => Promise<any>, maxRetries = 2) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};

// Simplified TTS function for widget
const ttsGenerate = async ({ text, persona }: { text: string; persona: string }) => {
  const ttsUrl = 'https://nyrvnskbkitrazudrkkc.supabase.co/functions/v1/tts';
  
  const response = await fetch(ttsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text.substring(0, 5000),
      persona,
      format: 'mp3'
    })
  });

  if (!response.ok) {
    throw new Error(`TTS request failed: ${response.status}`);
  }

  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
};

// Persona mapping
const PERSONA_MAP = {
  'Ezinne': 'naija_female_warm',
  'Lexi': 'naija_female_bold', 
  'ODIA': 'naija_male_deep',
  'Atlas': 'naija_male_warm'
} as const;

type Persona = keyof typeof PERSONA_MAP;

interface WidgetProps {
  assistantId?: string;
  persona?: Persona;
  voiceEnabled?: boolean;
  theme?: 'dark' | 'light';
}

type Msg = { role: "user" | "assistant"; text: string; audioUrl?: string };

const ODIADEVWidget: React.FC<WidgetProps> = ({ 
  assistantId, 
  persona: initialPersona = 'Ezinne', 
  voiceEnabled = true,
  theme = 'dark'
}) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const [persona, setPersona] = useState<Persona>(initialPersona);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const agentUrl = 'https://odiadev-adaqua-ai-brain.onrender.com/api/chat';

  async function send() {
    if (!text.trim() || isLoading) return;
    
    const user: Msg = { role: "user", text };
    setMessages(m => [...m, user]);
    setText("");
    setIsLoading(true);

    try {
      // Try to fetch from the agent URL
      const resp = await fetch(agentUrl, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: user.text })
      });
      
      const data = await resp.json().catch(() => ({ reply: "Sorry, I had trouble answering." }));
      const replyText = (data.reply || "").toString() || "Hello! I'm Adaqua AI by ODIADEV. How can I help you today?";
      
      let audioUrl: string | undefined;
      if (voiceMode && voiceEnabled) {
        try {
          audioUrl = await withBackoff(() => ttsGenerate({ 
            text: replyText, 
            persona: PERSONA_MAP[persona] 
          }));
        } catch (error) {
          console.error('TTS failed:', error);
        }
      }
      
      const assistantMsg: Msg = { role: "assistant", text: replyText, audioUrl };
      setMessages(m => [...m, assistantMsg]);
      
    } catch (error) {
      // Fallback responses
      const fallbackReplies = [
        "Hello! I'm Adaqua AI by ODIADEV. How can I help you today?",
        "I can help you with information about ODIADEV's voice AI solutions.",
        "That's interesting! Can you tell me more about what you're looking for?",
        "I'm here to help with any questions about ODIADEV and our AI services."
      ];
      const replyText = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      
      let audioUrl: string | undefined;
      if (voiceMode && voiceEnabled) {
        try {
          audioUrl = await withBackoff(() => ttsGenerate({ 
            text: replyText, 
            persona: PERSONA_MAP[persona] 
          }));
        } catch (error) {
          console.error('TTS failed:', error);
        }
      }
      
      const assistantMsg: Msg = { role: "assistant", text: replyText, audioUrl };
      setMessages(m => [...m, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  const themeClasses = theme === 'light' ? {
    container: 'bg-white text-gray-900 border-gray-300',
    header: 'border-gray-300',
    messageUser: 'bg-blue-500 text-white',
    messageAssistant: 'bg-gray-100 text-gray-900',
    input: 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500',
    button: 'bg-blue-500 text-white hover:bg-blue-600',
    voiceButton: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
  } : {
    container: 'bg-[#132a52] text-white border-[#b08d57]',
    header: 'border-[#b08d57]',
    messageUser: 'bg-[#b08d57] text-black',
    messageAssistant: 'bg-[#1a3a5c] text-white',
    input: 'bg-[#1a3a5c] border-[#b08d57] text-white placeholder-gray-400',
    button: 'bg-[#b08d57] text-black hover:bg-[#c09867]',
    voiceButton: 'bg-gray-600 text-white hover:bg-gray-500'
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-lg hover:scale-105 transition-transform ${
          theme === 'light' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-[#b08d57] hover:bg-[#c09867]'
        }`}
        style={{ zIndex: 999999 }}
      >
        💬
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 w-full max-w-md rounded-2xl shadow-xl border overflow-hidden ${themeClasses.container}`} style={{ zIndex: 999999 }}>
      <div className={`p-3 flex items-center gap-2 border-b ${themeClasses.header}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          theme === 'light' ? 'bg-blue-500 text-white' : 'bg-[#b08d57] text-black'
        }`}>
          O
        </div>
        <span className="font-medium">Adaqua AI</span>
        <div className="ml-auto flex items-center gap-2">
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value as Persona)}
            className={`px-2 py-1 rounded text-xs border ${themeClasses.input}`}
          >
            <option value="Ezinne">Ezinne</option>
            <option value="Lexi">Lexi</option>
            <option value="ODIA">ODIA</option>
            <option value="Atlas">Atlas</option>
          </select>
          {voiceEnabled && (
            <button
              onClick={() => setVoiceMode(!voiceMode)}
              className={`p-2 rounded-lg transition-colors ${themeClasses.voiceButton}`}
              title={voiceMode ? "Voice ON" : "Voice OFF"}
            >
              {voiceMode ? "🔊" : "🔇"}
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className={`p-1 rounded ${themeClasses.voiceButton}`}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="h-64 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            <p>Start a conversation with Adaqua AI</p>
            <p className="text-sm mt-1">Ask me anything about ODIADEV!</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === "user" ? themeClasses.messageUser : themeClasses.messageAssistant
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              {msg.audioUrl && (
                <audio
                  controls
                  className="mt-2 w-full"
                  autoPlay
                >
                  <source src={msg.audioUrl} type="audio/mpeg" />
                </audio>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`p-3 rounded-lg ${themeClasses.messageAssistant}`}>
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`p-3 border-t ${themeClasses.header}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && send()}
            placeholder="Type your message..."
            className={`flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 ${themeClasses.input}`}
            maxLength={5000}
            disabled={isLoading}
          />
          <button
            onClick={send}
            disabled={!text.trim() || isLoading}
            className={`px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${themeClasses.button}`}
          >
            Send
          </button>
        </div>
        <div className={`text-xs mt-1 text-right ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          {text.length}/5000 characters
        </div>
      </div>
    </div>
  );
};

// Export for global use
(window as any).ODIADEVWidget = ODIADEVWidget;

// Auto-initialize if this script is loaded directly
if (typeof window !== 'undefined') {
  const container = document.getElementById('odiadev-chat-widget');
  if (container && window.React && window.ReactDOM) {
    const root = createRoot(container);
    root.render(React.createElement(ODIADEVWidget));
  }
}
