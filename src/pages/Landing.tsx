import React from 'react';
import site from '../data/site.json';
import images from '../data/images.json';
import ChatWidget from '../components/ChatWidget';

export default function Landing() {
  const { hero, products, cta } = site;
  return (
    <div className="min-h-screen bg-[#0e2240] text-white">
      <header className="px-6 py-4 flex items-center gap-3">
        <img src={images.brand.logo.src} alt={images.brand.logo.alt} className="w-10 h-10" />
        <div className="font-bold text-xl">ODIADEV</div>
      </header>

      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">{hero.title}</h1>
        <p className="text-lg opacity-90 max-w-3xl">{hero.subtitle}</p>
        <div className="mt-6 flex gap-3">
          <a href={cta.primary.href} className="bg-[#b08d57] text-black px-5 py-3 rounded-xl font-semibold hover:bg-[#a07c4f] transition-colors">{cta.primary.label}</a>
          <a href={cta.secondary.href} className="border border-[#b08d57] px-5 py-3 rounded-xl hover:bg-[#b08d57] hover:text-black transition-colors">{cta.secondary.label}</a>
        </div>
      </section>

      <section className="px-6 py-8 max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
        {products.map((p) => (
          <div key={p.key} className="bg-[#132a52] border border-[#b08d57] rounded-2xl p-5">
            <h3 className="text-2xl font-semibold text-[#b08d57] mb-2">{p.name}</h3>
            <p className="opacity-90 mb-3">{p.copy}</p>
            <ul className="list-disc pl-5 opacity-80 space-y-1">
              {p.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <ChatWidget />
      <footer className="px-6 py-10 opacity-70 text-sm text-center">© {new Date().getFullYear()} ODIADEV</footer>
    </div>
  );
}
