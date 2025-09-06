import React, { useState, useEffect } from 'react';
import { supabase, User } from '../lib/supabase';
import ChatWidget from './ChatWidget';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalChats: number;
  voiceUsage: number;
}

export default function CRMDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalChats: 0,
    voiceUsage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
        });
      }
      setLoading(false);
    };

    getUser();

    // Mock stats for demo - in production, fetch from your analytics
    setStats({
      totalUsers: 1247,
      activeUsers: 892,
      totalChats: 15420,
      voiceUsage: 68,
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e2240] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e2240] text-white">
      {/* Header */}
      <header className="bg-[#132a52] border-b border-[#b08d57] p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/images/logo-fingerprint.png" alt="ODIADEV" className="w-8 h-8" />
            <h1 className="text-xl font-bold">ODIADEV CRM Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              Welcome, {user?.full_name || user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
            <h3 className="text-lg font-semibold text-[#b08d57] mb-2">Total Users</h3>
            <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
          </div>
          <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
            <h3 className="text-lg font-semibold text-[#b08d57] mb-2">Active Users</h3>
            <p className="text-3xl font-bold">{stats.activeUsers.toLocaleString()}</p>
          </div>
          <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
            <h3 className="text-lg font-semibold text-[#b08d57] mb-2">Total Chats</h3>
            <p className="text-3xl font-bold">{stats.totalChats.toLocaleString()}</p>
          </div>
          <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
            <h3 className="text-lg font-semibold text-[#b08d57] mb-2">Voice Usage</h3>
            <p className="text-3xl font-bold">{stats.voiceUsage}%</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Adaqua AI Demo */}
          <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
            <h2 className="text-xl font-bold mb-4 text-[#b08d57]">Adaqua AI Demo</h2>
            <p className="text-gray-300 mb-4">
              Test the conversational AI assistant with text and voice capabilities.
            </p>
            <div className="bg-[#0e2240] p-4 rounded-lg">
              <ChatWidget />
            </div>
          </div>

          {/* User Management */}
          <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
            <h2 className="text-xl font-bold mb-4 text-[#b08d57]">User Management</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-[#0e2240] rounded-lg">
                <div>
                  <p className="font-medium">Recent Signups</p>
                  <p className="text-sm text-gray-400">Last 24 hours</p>
                </div>
                <span className="text-[#b08d57] font-bold">+23</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#0e2240] rounded-lg">
                <div>
                  <p className="font-medium">Voice Adoption</p>
                  <p className="text-sm text-gray-400">Users using voice mode</p>
                </div>
                <span className="text-[#b08d57] font-bold">68%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#0e2240] rounded-lg">
                <div>
                  <p className="font-medium">Avg Session Time</p>
                  <p className="text-sm text-gray-400">Per user session</p>
                </div>
                <span className="text-[#b08d57] font-bold">4.2m</span>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
            <h2 className="text-xl font-bold mb-4 text-[#b08d57]">Analytics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Page Views</span>
                <span className="text-[#b08d57]">12,847</span>
              </div>
              <div className="flex justify-between">
                <span>Chat Messages</span>
                <span className="text-[#b08d57]">15,420</span>
              </div>
              <div className="flex justify-between">
                <span>Voice Requests</span>
                <span className="text-[#b08d57]">10,486</span>
              </div>
              <div className="flex justify-between">
                <span>Error Rate</span>
                <span className="text-green-400">0.2%</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-[#132a52] p-6 rounded-xl border border-[#b08d57]">
            <h2 className="text-xl font-bold mb-4 text-[#b08d57]">System Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>AI Brain API</span>
                <span className="text-green-400">● Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span>TTS Service</span>
                <span className="text-green-400">● Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Database</span>
                <span className="text-green-400">● Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span>CDN</span>
                <span className="text-green-400">● Online</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
