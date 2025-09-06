import React, { useMemo, useState, useRef } from "react";
import { withBackoff } from "../lib/retry";
import { ttsGenerate } from "../lib/tts";
import { PersonaSelect, Persona } from "./PersonaSelect";

type Msg = { role:"user"|"assistant"; text:string; audioUrl?:string };

export default function ChatWidget() {
  const [messages,setMessages]=useState<Msg[]>([]);
  const [text,setText]=useState("");
  const [voiceMode,setVoiceMode]=useState(false);
  const [persona,setPersona]=useState<Persona>("Ezinne");
  const [isListening,setIsListening]=useState(false);
  const [speechSupported,setSpeechSupported]=useState(false);
  const recognitionRef = useRef<any>(null);
  const TTS_FN = useMemo(()=> (import.meta.env.VITE_TTS_FUNCTION_URL as string),[]);

  // Check for speech recognition support
  React.useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  async function send() {
    if (!text.trim()) return;
    const user:Msg={role:"user",text};
    setMessages(m=>[...m,user]);
    setText("");

    // Agent brain (Local)
    const agentUrl = import.meta.env.VITE_AGENT_API_URL || "http://localhost:3001/api/chat";
    const resp = await fetch(agentUrl,{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({message:user.text})});
    const data = await resp.json().catch(()=>({reply:"Sorry, I had trouble answering."}));
    const replyText = (data.reply || "").toString() || "…";

    let audioUrl: string|undefined;
    if (voiceMode) {
      audioUrl = await withBackoff(() => ttsGenerate({ endpoint: TTS_FN, text: replyText, persona }));
    }

    setMessages(m=>[...m,{role:"assistant",text:replyText,audioUrl}]);
  }

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md bg-navySoft rounded-2xl shadow-smooth border border-gold overflow-hidden">
      <div className="p-3 flex items-center gap-2 border-b border-gold">
        <img src="/images/logo-fingerprint.png" className="w-6 h-6" />
        <div className="font-semibold">Adaqua AI by ODIADEV</div>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm">Voice</label>
          <input type="checkbox" checked={voiceMode} onChange={e=>setVoiceMode(e.target.checked)} />
          <PersonaSelect value={persona} onChange={setPersona}/>
        </div>
      </div>

      <div className="p-3 max-h-96 overflow-y-auto space-y-3">
        {messages.map((m,i)=>(
          <div key={i} className={m.role==="user"?"text-right":""}>
            <div className={`inline-block px-3 py-2 rounded-xl ${m.role==="user"?"bg-gold text-ink":"bg-cloud text-ink"}`}>{m.text}</div>
            {m.audioUrl && <audio src={m.audioUrl} controls className="mt-1 w-full" autoPlay />}
          </div>
        ))}
      </div>

      <div className="p-3 flex gap-2 border-t border-gold">
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={2} maxLength={5000}
          placeholder="Type your message…" className="flex-1 bg-navy text-white border border-gold rounded-xl p-2"/>
        <button 
          onClick={toggleListening} 
          disabled={!speechSupported}
          className={`px-3 py-2 rounded-xl font-semibold ${
            speechSupported 
              ? (isListening ? 'bg-red-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600') 
              : 'bg-gray-500 text-gray-300 cursor-not-allowed'
          }`}
          title={speechSupported ? (isListening ? 'Stop listening' : 'Start voice input') : 'Speech input not supported on this device'}
        >
          {isListening ? '🎤' : '🎙️'}
        </button>
        <button onClick={send} className="bg-gold text-ink px-4 py-2 rounded-xl font-semibold">Send</button>
      </div>
    </div>
  );
}