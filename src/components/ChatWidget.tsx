import React, { useMemo, useState } from "react";
import { withBackoff } from "../lib/retry";
import { ttsGenerate } from "../lib/tts";
import { PersonaSelect, Persona } from "./PersonaSelect";
import { analytics } from "../lib/analytics";
import { supabase } from "../lib/supabase";

type Msg = { role: "user" | "assistant"; text: string; audioUrl?: string };

interface ChatWidgetProps {
  assistantId?: string;
  persona?: Persona;
  voiceEnabled?: boolean;
}

export default function ChatWidget({ assistantId, persona: initialPersona, voiceEnabled = true }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const [persona, setPersona] = useState<Persona>(initialPersona || "Ezinne");
  const agentUrl = import.meta.env.VITE_AGENT_API_URL as string;
  const ttsReady = useMemo(() => Boolean(import.meta.env.VITE_TTS_PROXY_URL), []);

  // Save messages to database if assistantId is provided
  const saveMessage = async (role: "user" | "assistant", messageText: string) => {
    if (!assistantId) return;
    
    try {
      await supabase
        .from('messages')
        .insert({
          assistant_id: assistantId,
          role,
          text: messageText,
        });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  async function send() {
    if (!text.trim()) return;
    const user: Msg = { role: "user", text };
    setMessages(m => [...m, user]);
    
    // Save user message
    await saveMessage("user", text);
    
    // Track chat message
    analytics.trackChatMessage(text.length, voiceMode);
    
    setText("");

    try {
      // Try to fetch from the agent URL, fallback to mock response
      const resp = await fetch(agentUrl, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: user.text })
      });
      const data = await resp.json().catch(() => ({ reply: "Sorry, I had trouble answering." }));
      const replyText = (data.reply || "").toString() || "…";
      
      let audioUrl: string | undefined;
      if (voiceMode && ttsReady && voiceEnabled) {
        try {
          audioUrl = await withBackoff(() => ttsGenerate({ text: replyText, persona }));
          analytics.trackTTSRequest(persona, replyText.length, true);
        } catch (error) {
          analytics.trackTTSRequest(persona, replyText.length, false);
          console.error('TTS failed:', error);
        }
      }
      
      const assistantMsg: Msg = { role: "assistant", text: replyText, audioUrl };
      setMessages(m => [...m, assistantMsg]);
      
      // Save assistant message
      await saveMessage("assistant", replyText);
      
    } catch (error) {
      // Fallback to mock response if agent is not available
      const mockReplies = [
        "Hello! I'm Adaqua AI by ODIADEV. How can I help you today?",
        "I can help you with information about ODIADEV's voice AI solutions.",
        "That's interesting! Can you tell me more about what you're looking for?",
        "I'm here to help with any questions about ODIADEV and our AI services."
      ];
      const replyText = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      
      let audioUrl: string | undefined;
      if (voiceMode && ttsReady && voiceEnabled) {
        try {
          audioUrl = await withBackoff(() => ttsGenerate({ text: replyText, persona }));
          analytics.trackTTSRequest(persona, replyText.length, true);
        } catch (error) {
          analytics.trackTTSRequest(persona, replyText.length, false);
          console.error('TTS failed:', error);
        }
      }
      
      const assistantMsg: Msg = { role: "assistant", text: replyText, audioUrl };
      setMessages(m => [...m, assistantMsg]);
      
      // Save assistant message
      await saveMessage("assistant", replyText);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md bg-[#132a52] text-white rounded-2xl shadow-xl border border-[#b08d57] overflow-hidden">
      <div className="p-3 flex items-center gap-2 border-b border-[#b08d57]">
        <img src="/images/logo-fingerprint.png" className="w-6 h-6" alt="ODIADEV logo" />
        <span className="font-medium">Adaqua AI</span>
        <div className="ml-auto flex items-center gap-2">
          {!initialPersona && (
            <PersonaSelect value={persona} onChange={setPersona} />
          )}
          {voiceEnabled && (
            <button
              onClick={() => {
                setVoiceMode(!voiceMode);
                analytics.trackVoiceToggle(!voiceMode);
              }}
              className={`p-2 rounded-lg transition-colors ${
                voiceMode ? "bg-[#b08d57] text-black" : "bg-gray-600 text-white"
              }`}
              title={voiceMode ? "Voice ON" : "Voice OFF"}
            >
              {voiceMode ? "🔊" : "🔇"}
            </button>
          )}
        </div>
      </div>

      <div className="h-64 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p>Start a conversation with Adaqua AI</p>
            <p className="text-sm mt-1">Ask me anything about ODIADEV!</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-[#b08d57] text-black"
                  : "bg-[#1a3a5c] text-white"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              {msg.audioUrl && (
                <audio
                  controls
                  className="mt-2 w-full"
                  autoPlay
                  onPlay={() => analytics.trackTTSRequest(persona, msg.text.length, true)}
                >
                  <source src={msg.audioUrl} type="audio/mpeg" />
                </audio>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-[#b08d57]">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && send()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 bg-[#1a3a5c] border border-[#b08d57] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b08d57]"
            maxLength={5000}
          />
          <button
            onClick={send}
            disabled={!text.trim()}
            className="px-4 py-2 bg-[#b08d57] text-black rounded-lg font-medium hover:bg-[#c09867] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-1 text-right">
          {text.length}/5000 characters
        </div>
      </div>
    </div>
  );
}