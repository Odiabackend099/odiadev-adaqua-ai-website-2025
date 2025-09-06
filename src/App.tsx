import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthForm from "./components/AuthForm";
import AssistantWizard from "./components/AssistantWizard";
import CRMDashboard from "./components/CRMDashboard";
import ChatWidget from "./components/ChatWidget";
import HealthBanner from "./components/HealthBanner";
import { supabase, Assistant } from "./lib/supabase";
import images from "./data/images.json";

function AppContent() {
  const { user, loading } = useAuth();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [checkingAssistant, setCheckingAssistant] = useState(true);

  React.useEffect(() => {
    const checkAssistant = async () => {
      if (!user) {
        setCheckingAssistant(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('assistants')
          .select('*')
          .eq('owner_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking assistant:', error);
        } else if (data) {
          setAssistant(data);
        }
      } catch (error) {
        console.error('Error checking assistant:', error);
      } finally {
        setCheckingAssistant(false);
      }
    };

    checkAssistant();
  }, [user]);

  if (loading || checkingAssistant) {
    return (
      <div className="min-h-screen bg-[#0e2240] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => window.location.reload()} />;
  }

  if (!assistant) {
    return <AssistantWizard onComplete={setAssistant} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<CRMDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#0e2240] text-white">
      <HealthBanner />
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={images.brand.logo.src} alt={images.brand.logo.alt} className="w-10 h-10"/>
          <h1 className="text-2xl font-bold">ODIADEV</h1>
          <span className="ml-2 text-sm opacity-75">Adaqua AI — conversational assistant</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">
            Welcome, {user?.full_name || user?.email}
          </span>
          <a
            href="/dashboard"
            className="bg-[#b08d57] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#a07c4f]"
          >
            Dashboard
          </a>
          <button
            onClick={signOut}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        <h2 className="text-4xl mb-4">Nigeria-first Voice AI</h2>
        <p className="opacity-90 max-w-2xl mb-8">Text chat by default. Turn on voice when you want spoken replies in Nigerian voices.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
            <h3 className="text-xl font-bold text-[#b08d57] mb-2">Text Chat</h3>
            <p className="text-gray-300">Start with text conversations for quick responses</p>
          </div>
          <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
            <h3 className="text-xl font-bold text-[#b08d57] mb-2">Voice Mode</h3>
            <p className="text-gray-300">Toggle voice for natural Nigerian speech</p>
          </div>
          <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
            <h3 className="text-xl font-bold text-[#b08d57] mb-2">4 Personas</h3>
            <p className="text-gray-300">Choose from Ezinne, Lexi, ODIA, or Atlas</p>
          </div>
        </div>
      </main>

      <ChatWidget />
      <footer className="p-6 opacity-70 text-sm">© {new Date().getFullYear()} ODIADEV</footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
