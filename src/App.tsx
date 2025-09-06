import React from "react";
import ChatWidget from "./components/ChatWidget";
import images from "./data/images.json";

export default function App(){
  return (
    <div className="min-h-screen bg-[#0e2240] text-white">
      <header className="p-6 flex items-center gap-3">
        <img src={images.brand.logo.src} alt={images.brand.logo.alt} className="w-10 h-10"/>
        <h1 className="text-2xl font-bold">ODIADEV</h1>
        <span className="ml-2 text-sm opacity-75">Adaqua AI — conversational assistant</span>
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        <h2 className="text-4xl mb-4">Nigeria-first Voice AI</h2>
        <p className="opacity-90 max-w-2xl">Text chat by default. Turn on voice when you want spoken replies in Nigerian voices.</p>
      </main>

      <ChatWidget />
      <footer className="p-6 opacity-70 text-sm">© {new Date().getFullYear()} ODIADEV</footer>
    </div>
  );
}
