import React, { useState, useEffect } from 'react';
import { supabase, Assistant, Channel } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import ChatWidget from './ChatWidget';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalChats: number;
  voiceUsage: number;
}

export default function CRMDashboard() {
  const { user, signOut } = useAuth();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalChats: 0,
    voiceUsage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [widgetSnippet, setWidgetSnippet] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;

      try {
        // Load user's assistant
        const { data: assistantData, error: assistantError } = await supabase
          .from('assistants')
          .select('*')
          .eq('owner_id', user.id)
          .single();

        if (assistantError && assistantError.code !== 'PGRST116') {
          throw assistantError;
        }

        if (assistantData) {
          setAssistant(assistantData);

          // Load web channel
          const { data: channelData, error: channelError } = await supabase
            .from('channels')
            .select('*')
            .eq('assistant_id', assistantData.id)
            .eq('type', 'web')
            .single();

          if (channelData) {
            setChannel(channelData);
          }

          // Generate widget snippet
          const snippet = generateWidgetSnippet(assistantData.id);
          setWidgetSnippet(snippet);
        }

        // Mock stats for demo - in production, fetch from analytics
        setStats({
          totalUsers: 1247,
          activeUsers: 892,
          totalChats: 15420,
          voiceUsage: 68,
        });
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  const generateWidgetSnippet = (assistantId: string) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://odia.dev';
    return `<!-- Adaqua AI Chat Widget -->
<script>
  (function() {
    const script = document.createElement('script');
    script.src = '${siteUrl}/widget.js';
    script.setAttribute('data-assistant-id', '${assistantId}');
    document.head.appendChild(script);
  })();
</script>`;
  };

  const copyWidgetSnippet = async () => {
    try {
      await navigator.clipboard.writeText(widgetSnippet);
      alert('Widget snippet copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e2240] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="min-h-screen bg-[#0e2240] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Assistant Found</h2>
          <p className="text-gray-300 mb-6">You need to create an assistant first.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#b08d57] text-white px-6 py-3 rounded-lg hover:bg-[#c09867] transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e2240]">
      {/* Header */}
      <header className="bg-[#132a52] border-b border-[#b08d57] p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/images/logo-fingerprint.png" className="w-8 h-8" alt="ODIADEV" />
            <h1 className="text-xl font-bold text-white">ODIADEV Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white">Welcome, {user?.full_name || user?.email}</span>
            <button
              onClick={signOut}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Assistant Card */}
        <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57] mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{assistant.name}</h2>
              <p className="text-gray-300">Persona: {assistant.persona} • Voice: {assistant.voice_enabled ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowChat(true)}
                className="bg-[#b08d57] text-white px-6 py-3 rounded-lg hover:bg-[#c09867] transition-colors"
              >
                Open Web Chat
              </button>
              <button
                onClick={copyWidgetSnippet}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy Widget Snippet
              </button>
            </div>
          </div>
          
          <div className="bg-[#1a3a5c] p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Widget Integration Code:</h3>
            <pre className="text-sm text-gray-300 bg-black p-3 rounded overflow-x-auto">
              {widgetSnippet}
            </pre>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
            <h3 className="text-lg font-semibold text-white mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-[#b08d57]">{stats.totalUsers.toLocaleString()}</p>
          </div>
          <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
            <h3 className="text-lg font-semibold text-white mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-[#b08d57]">{stats.activeUsers.toLocaleString()}</p>
          </div>
          <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
            <h3 className="text-lg font-semibold text-white mb-2">Total Chats</h3>
            <p className="text-3xl font-bold text-[#b08d57]">{stats.totalChats.toLocaleString()}</p>
          </div>
          <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
            <h3 className="text-lg font-semibold text-white mb-2">Voice Usage</h3>
            <p className="text-3xl font-bold text-[#b08d57]">{stats.voiceUsage}%</p>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
          <h2 className="text-xl font-semibold text-white mb-4">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1a3a5c] p-4 rounded-lg border border-[#b08d57]">
              <h3 className="text-white font-medium mb-2">WhatsApp Integration</h3>
              <p className="text-gray-400 text-sm">Connect your assistant to WhatsApp Business API</p>
            </div>
            <div className="bg-[#1a3a5c] p-4 rounded-lg border border-[#b08d57]">
              <h3 className="text-white font-medium mb-2">Telegram Bot</h3>
              <p className="text-gray-400 text-sm">Deploy your assistant as a Telegram bot</p>
            </div>
          </div>
        </div>
      </main>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#132a52] rounded-xl border border-[#b08d57] w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-[#b08d57] flex justify-between items-center">
              <h3 className="text-white font-medium">Chat with {assistant.name}</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 h-96 overflow-y-auto">
              <ChatWidget 
                assistantId={assistant.id}
                persona={assistant.persona}
                voiceEnabled={assistant.voice_enabled}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}