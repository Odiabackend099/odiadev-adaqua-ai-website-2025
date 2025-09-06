import React, { useMemo, useState } from "react";
import { withBackoff } from "../lib/retry";
import { ttsGenerate } from "../lib/tts";
import { PersonaSelect, Persona } from "./PersonaSelect";
import { analytics } from "../lib/analytics";

type Msg = { role:"user"|"assistant"; text:string; audioUrl?:string };

export default function ChatWidget() {
  const [messages,setMessages]=useState<Msg[]>([]);
  const [text,setText]=useState("");
  const [voiceMode,setVoiceMode]=useState(false);
  const [persona,setPersona]=useState<Persona>("Ezinne");
  const agentUrl = import.meta.env.VITE_AGENT_API_URL as string;
  const ttsReady = useMemo(()=>Boolean(import.meta.env.VITE_TTS_FUNCTION_URL),[]);

  async function send() {
    if (!text.trim()) return;
    const user:Msg={role:"user",text};
    setMessages(m=>[...m,user]);
    
    // Track chat message
    analytics.trackChatMessage(text.length, voiceMode);
    
    setText("");

    const resp = await fetch(agentUrl,{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({message:user.text})});
    const data = await resp.json().catch(()=>({reply:"Sorry, I had trouble answering."}));
    const replyText = (data.reply || "").toString() || "…";

    let audioUrl: string|undefined;
    if (voiceMode && ttsReady) {
      try {
        audioUrl = await withBackoff(() => ttsGenerate({ text: replyText, persona }));
        analytics.trackTTSRequest(persona, replyText.length, true);
      } catch (error) {
        analytics.trackTTSRequest(persona, replyText.length, false);
        console.error('TTS failed:', error);
      }
    }
    setMessages(m=>[...m,{role:"assistant",text:replyText,audioUrl}]);
  }

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md bg-[#132a52] text-white rounded-2xl shadow-xl border border-[#b08d57] overflow-hidden">
      <div className="p-3 flex items-center gap-2 border-b border-[#b08d57]">
        <img src="/images/logo-fingerprint.png" className="w-6 h-6" alt="ODIADEV logo"/>
        <div className="font-semibold">Adaqua AI by ODIADEV</div>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm">Voice</label>
          <input 
            type="checkbox" 
            checked={voiceMode} 
            onChange={e => {
              setVoiceMode(e.target.checked);
              analytics.trackVoiceToggle(e.target.checked);
            }} 
          />
          <PersonaSelect 
            value={persona} 
            onChange={p => {
              setPersona(p);
              analytics.trackPersonaChange(p);
            }}
          />
        </div>
      </div>

      <div className="p-3 max-h-96 overflow-y-auto space-y-3">
        {messages.map((m,i)=>(
          <div key={i} className={m.role==="user"?"text-right":""}>
            <div className={`inline-block px-3 py-2 rounded-xl ${m.role==="user"?"bg-[#b08d57] text-black":"bg-white text-black"}`}>{m.text}</div>
            {m.audioUrl && <audio src={m.audioUrl} controls className="mt-1 w-full" />}
          </div>
        ))}
      </div>

      <div className="p-3 flex gap-2 border-t border-[#b08d57]">
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={2} maxLength={5000}
          placeholder="Type your message…" className="flex-1 bg-[#0e2240] text-white border border-[#b08d57] rounded-xl p-2"/>
        <button onClick={send} className="bg-[#b08d57] text-black px-4 py-2 rounded-xl font-semibold">Send</button>
      </div>
    </div>
  );
}