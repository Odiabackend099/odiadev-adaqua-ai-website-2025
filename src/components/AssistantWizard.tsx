import React, { useState } from 'react';
import { supabase, Assistant, Channel } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AssistantWizardProps {
  onComplete: (assistant: Assistant) => void;
}

export default function AssistantWizard({ onComplete }: AssistantWizardProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [persona, setPersona] = useState<'Ezinne' | 'Lexi' | 'ODIA' | 'Atlas'>('Ezinne');
  const [lang, setLang] = useState('en');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      // Create assistant
      const { data: assistant, error: assistantError } = await supabase
        .from('assistants')
        .insert({
          owner_id: user.id,
          name: name.trim(),
          persona,
          voice_enabled: voiceEnabled,
          lang,
        })
        .select()
        .single();

      if (assistantError) throw assistantError;

      // Create web channel
      const { error: channelError } = await supabase
        .from('channels')
        .insert({
          assistant_id: assistant.id,
          type: 'web',
          status: 'active',
          config: {},
        });

      if (channelError) throw channelError;

      // Log audit event
      await supabase.rpc('log_audit_event', {
        action_name: 'assistant_create',
        metadata: { assistant_id: assistant.id, persona, voice_enabled: voiceEnabled }
      });

      onComplete(assistant);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const personaDescriptions = {
    Ezinne: 'Friendly female voice, perfect for customer service',
    Lexi: 'Professional female voice, great for business communications',
    ODIA: 'Warm male voice, ideal for personal interactions',
    Atlas: 'Confident male voice, excellent for presentations'
  };

  return (
    <div className="min-h-screen bg-[#0e2240] flex items-center justify-center p-4">
      <div className="bg-[#132a52] p-8 rounded-2xl shadow-xl border border-[#b08d57] w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/images/logo-fingerprint.png" className="w-12 h-12 mx-auto mb-4" alt="ODIADEV" />
          <h1 className="text-2xl font-bold text-white mb-2">Create Your Assistant</h1>
          <p className="text-gray-300">Let's set up your Adaqua AI assistant</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Assistant Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Customer Service Bot"
              className="w-full px-4 py-3 bg-[#1a3a5c] border border-[#b08d57] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b08d57]"
              required
              minLength={2}
              maxLength={40}
            />
            <p className="text-gray-400 text-xs mt-1">{name.length}/40 characters</p>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Voice Persona
            </label>
            <div className="space-y-2">
              {(['Ezinne', 'Lexi', 'ODIA', 'Atlas'] as const).map((p) => (
                <label key={p} className="flex items-center p-3 bg-[#1a3a5c] border border-[#b08d57] rounded-lg cursor-pointer hover:bg-[#2a4a6c] transition-colors">
                  <input
                    type="radio"
                    name="persona"
                    value={p}
                    checked={persona === p}
                    onChange={(e) => setPersona(e.target.value as any)}
                    className="mr-3 text-[#b08d57]"
                  />
                  <div>
                    <div className="text-white font-medium">{p}</div>
                    <div className="text-gray-400 text-sm">{personaDescriptions[p]}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Default Language
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a3a5c] border border-[#b08d57] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b08d57]"
            >
              <option value="en">English</option>
              <option value="pidgin">Pidgin</option>
            </select>
          </div>

          <div>
            <label className="flex items-center p-3 bg-[#1a3a5c] border border-[#b08d57] rounded-lg cursor-pointer hover:bg-[#2a4a6c] transition-colors">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="mr-3 text-[#b08d57]"
              />
              <div>
                <div className="text-white font-medium">Enable Voice Responses</div>
                <div className="text-gray-400 text-sm">Allow your assistant to speak responses</div>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-[#b08d57] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#c09867] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating Assistant...' : 'Create Assistant'}
          </button>
        </form>
      </div>
    </div>
  );
}
