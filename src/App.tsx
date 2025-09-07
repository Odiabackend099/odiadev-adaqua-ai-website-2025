import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import VoiceCall from './components/VoiceCall'
import ChatWidget from './components/ChatWidget'

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...rest }) => (
  <button
    {...rest}
    className={`px-5 py-3 rounded-lg font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300 ${className}`}
  >
    {children}
  </button>
)

function Home() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#0C1C3A] text-white">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;600&display=swap" rel="stylesheet" />

      <header className="max-w-6xl mx-auto px-4 py-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img alt="ODIA" src="/logo.svg" className="w-7 h-7" />
          <span className="font-semibold tracking-wide">ODIADEV</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm opacity-90">
          <a href="#products" className="hover:opacity-100">Products</a>
          <a onClick={() => navigate('/contact')} className="hover:opacity-100 cursor-pointer">Contact</a>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        <section className="py-6 md:py-12">
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight" style={{fontFamily:'Cormorant Garamond, serif'}}>
            Nigeria's Voice AI That Works —<br/> ODIADEV
          </h1>
          <p className="mt-5 max-w-2xl text-[#93A4BE]">
            Reliable speech solutions for real businesses in Nigeria: web & WhatsApp assistants,
            high‑clarity TTS, and always‑on emergency response. Adaqua AI (assistant) and CrossAI (escalation) are ready today.
          </p>
          <div className="mt-8 flex gap-4">
            <Button
              onClick={() => navigate('/call')}
              className="bg-[#C8A862] text-[#0C1C3A] border-[#C8A862] hover:bg-[#f0d79a]"
            >
              Call Adaqua AI
            </Button>
            <Button
              onClick={() => navigate('/contact')}
              className="bg-transparent border-[#C8A862] text-[#C8A862] hover:bg-[#1a2a4a]"
            >
              Talk to Sales
            </Button>
          </div>
        </section>

        <section id="products" className="grid md:grid-cols-2 gap-6 py-12">
          <div className="rounded-xl border border-[#C8A862] p-6 bg-[#1a2a4a]">
            <h3 className="text-xl font-semibold text-[#C8A862]">Adaqua AI — Conversational Assistant</h3>
            <ul className="mt-4 space-y-2 text-[#E9EEF5] opacity-90 text-sm">
              <li>Voice‑only or voice+text. Hands‑free call mode on the web.</li>
              <li>Natural Nigerian voices: Ezinne, Lexi, ODIA, Atlas.</li>
              <li>Secure TTS via Supabase Edge proxy (no API keys in the browser).</li>
              <li>Low‑bandwidth friendly: retries + backoff + text fallback.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-[#C8A862] p-6 bg-[#1a2a4a]">
            <h3 className="text-xl font-semibold text-[#C8A862]">CrossAI — Emergency Response</h3>
            <ul className="mt-4 space-y-2 text-[#E9EEF5] opacity-90 text-sm">
              <li>24/7 voice prompts with clear, local accents.</li>
              <li>Configurable playbooks and escalation paths.</li>
              <li>Audit trails and real‑time status.</li>
            </ul>
          </div>
        </section>
      </main>

      <ChatWidget persona="Ezinne" voiceEnabled position="bottom-right" theme="dark" />

      <footer className="text-center text-xs opacity-70 py-12">© 2025 ODIADEV</footer>
    </div>
  )
}

function Contact() {
  return (
    <div className="min-h-screen bg-[#0C1C3A] text-white px-4">
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-3xl font-semibold" style={{fontFamily:'Cormorant Garamond, serif'}}>Talk to Sales</h1>
        <p className="text-[#93A4BE] mt-3">Pick the channel you prefer—response is fastest on WhatsApp.</p>
        <div className="mt-8 grid gap-4">
          <a className="p-4 rounded-lg border border-[#C8A862] hover:bg-[#1a2a4a]" href="https://wa.me/2348105786326?text=Hi%20ODIADEV%2C%20I%E2%80%99d%20like%20a%20demo.">WhatsApp: +234 810 578 6326</a>
          <a className="p-4 rounded-lg border border-[#C8A862] hover:bg-[#1a2a4a]" href="sms:+2348105786326">SMS: +234 810 578 6326</a>
          <a className="p-4 rounded-lg border border-[#C8A862] hover:bg-[#1a2a4a]" href="mailto:info.odiadev@outlook.com">Email: info.odiadev@outlook.com</a>
          <a className="p-4 rounded-lg border border-[#C8A862] hover:bg-[#1a2a4a]" href="mailto:support.odiadev@outlook.com">Support: support.odiadev@outlook.com</a>
          <a className="p-4 rounded-lg border border-[#C8A862] hover:bg-[#1a2a4a]" href="mailto:austyn@odia.dev">Founder: austyn@odia.dev</a>
          <a className="p-4 rounded-lg border border-[#C8A862] hover:bg-[#1a2a4a]" href="https://t.me/Adaqua_AI_bot" target="_blank" rel="noreferrer">Telegram: @Adaqua_AI_bot</a>
        </div>
      </div>
    </div>
  )
}

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/call" element={<VoiceCall/>} />
      <Route path="*" element={<Home/>} />
    </Routes>
  )
}