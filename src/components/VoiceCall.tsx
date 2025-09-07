import React, { useCallback, useEffect, useRef, useState } from 'react'

// Env
const agentApiUrl = (import.meta as any).env.VITE_AGENT_API_URL || 'https://odiadev-adaqua-ai-brain.onrender.com/api/chat'
const ttsProxyUrl = (import.meta as any).env.VITE_TTS_PROXY_URL || 'https://nyrvnskbkitrazudrkkc.supabase.co/functions/v1/tts'

type Msg = { role: 'user' | 'assistant'; text: string }

type SR = typeof window !== 'undefined' && (window as any).webkitSpeechRecognition
  ? any
  : undefined

const VoiceCall: React.FC = () => {
  const [status, setStatus] = useState<'idle'|'listening'|'thinking'|'speaking'|'blocked'>('idle')
  const [messages, setMessages] = useState<Msg[]>([])
  const [persona, setPersona] = useState<'Ezinne'|'Lexi'|'ODIA'|'Atlas'>('Ezinne')
  const recognitionRef = useRef<InstanceType<SR> | null>(null)
  const abortSpeakRef = useRef<(() => void) | null>(null)

  const speak = useCallback(async (text: string)=>{
    setStatus('speaking')
    const res = await fetch(ttsProxyUrl, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ text, persona, format: 'mp3' })
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    abortSpeakRef.current = () => { audio.pause(); audio.currentTime = 1e9 }
    await new Promise<void>((resolve)=>{
      audio.onended = ()=>{ URL.revokeObjectURL(url); resolve() }
      audio.onerror = ()=>{ URL.revokeObjectURL(url); resolve() }
      audio.play().catch(()=>resolve())
    })
  },[persona])

  const startListening = useCallback(async ()=>{
    try {
      await navigator.mediaDevices.getUserMedia({audio:true})
    } catch (e){ setStatus('blocked'); return }

    const SRImpl = (window as any).webkitSpeechRecognition
    if (!SRImpl){
      alert('Speech Recognition not available in this browser. Use Chrome on Android/desktop for hands‑free mode.')
      return
    }
    const rec = new SRImpl()
    rec.lang = 'en-NG'
    rec.continuous = true
    rec.interimResults = true

    let finalBuffer = ''
    let lastResultTs = Date.now()
    const finishIfSilent = () => {
      if (Date.now() - lastResultTs > 900 && finalBuffer.trim()){ // ~1s silence
        rec.stop()
      }
    }

    rec.onresult = (e: any) => {
      lastResultTs = Date.now()
      let transcript = ''
      for (let i=e.resultIndex; i<e.results.length; i++){
        transcript += e.results[i][0].transcript
        if (e.results[i].isFinal) finalBuffer += e.results[i][0].transcript
      }
      // show interim in UI if desired
    }

    rec.onend = async () => {
      const userText = finalBuffer.trim()
      if (!userText){ if(status!=='speaking'){ rec.start() }; return }
      setMessages(m=>[...m,{role:'user', text:userText}])
      setStatus('thinking')
      finalBuffer = ''

      // call brain
      const res = await fetch(agentApiUrl, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ message: userText })
      })
      const data = await res.json()
      const reply = data.reply || 'Sorry, I could not process that.'
      setMessages(m=>[...m,{role:'assistant', text:reply}])
      await speak(reply)
      setStatus('listening')
      rec.start()
    }

    recognitionRef.current = rec
    setStatus('listening')
    rec.start()
    const iv = setInterval(finishIfSilent, 300)
    return () => clearInterval(iv)
  },[agentApiUrl, speak, status])

  const hangup = useCallback(()=>{
    if (recognitionRef.current){ recognitionRef.current.onend = null; recognitionRef.current.stop() }
    if (abortSpeakRef.current){ abortSpeakRef.current() }
    setStatus('idle')
  },[])

  useEffect(()=>{ startListening(); return ()=>hangup() }, [])

  return (
    <div className="min-h-screen bg-[#0C1C3A] text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold" style={{fontFamily:'Cormorant Garamond, serif'}}>Call Adaqua AI</h1>
          <div className="flex items-center gap-2">
            <select value={persona} onChange={(e)=>setPersona(e.target.value as any)} className="bg-[#1a2a4a] border border-[#C8A862] rounded px-2 py-1">
              <option>Ezinne</option><option>Lexi</option><option>ODIA</option><option>Atlas</option>
            </select>
            {status!=='idle' ? (
              <button onClick={hangup} className="px-3 py-2 rounded border border-red-300 text-red-200">Hang up</button>
            ) : null}
          </div>
        </div>

        <div className="mt-6 text-sm opacity-80">Status: {status}</div>

        <div className="mt-6 space-y-3">
          {messages.map((m,i)=> (
            <div key={i} className={`p-3 rounded-lg border ${m.role==='user' ? 'border-[#C8A862] bg-[#1a2a4a]' : 'border-[#2f436b] bg-[#14233f]'}`}>
              <div className="text-xs opacity-60 mb-1">{m.role==='user'?'You':'Adaqua'}</div>
              <div>{m.text}</div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[#93A4BE] text-sm">
          Tip: keep this tab active. Speaking pauses for ~1s cue the assistant to respond.
        </p>
      </div>
    </div>
  )
}

export default VoiceCall
