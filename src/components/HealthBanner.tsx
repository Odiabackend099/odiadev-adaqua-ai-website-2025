import React, { useState, useEffect } from 'react';

interface HealthStatus {
  agent: boolean;
  tts: boolean;
  lastChecked: Date;
}

export default function HealthBanner() {
  const [health, setHealth] = useState<HealthStatus>({
    agent: true,
    tts: true,
    lastChecked: new Date()
  });
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      const agentUrl = import.meta.env.VITE_AGENT_API_URL;
      const ttsUrl = import.meta.env.VITE_TTS_FUNCTION_URL;
      
      let agentHealthy = true;
      let ttsHealthy = true;

      // Check agent health
      try {
        const agentResponse = await fetch(agentUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'health check' })
        });
        agentHealthy = agentResponse.ok;
      } catch (error) {
        agentHealthy = false;
      }

      // Check TTS health
      try {
        const ttsResponse = await fetch(ttsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: 'health check',
            persona: 'Ezinne',
            format: 'mp3'
          })
        });
        ttsHealthy = ttsResponse.ok;
      } catch (error) {
        ttsHealthy = false;
      }

      const newHealth = {
        agent: agentHealthy,
        tts: ttsHealthy,
        lastChecked: new Date()
      };

      setHealth(newHealth);
      setShowBanner(!agentHealthy || !ttsHealthy);
    };

    // Check health immediately
    checkHealth();

    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!showBanner) return null;

  return (
    <div className="bg-yellow-600 text-white p-3 text-center text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
        <span>⚠️ Service Status:</span>
        <span className={`px-2 py-1 rounded text-xs ${health.agent ? 'bg-green-500' : 'bg-red-500'}`}>
          Agent: {health.agent ? 'Online' : 'Offline'}
        </span>
        <span className={`px-2 py-1 rounded text-xs ${health.tts ? 'bg-green-500' : 'bg-red-500'}`}>
          Voice: {health.tts ? 'Online' : 'Offline'}
        </span>
        <span className="text-xs opacity-75">
          Last checked: {health.lastChecked.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
