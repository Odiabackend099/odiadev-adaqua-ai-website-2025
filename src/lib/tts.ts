// Persona to voice ID mapping
const PERSONA_MAP = {
  'Ezinne': 'naija_female_warm',
  'Lexi': 'naija_female_bold', 
  'ODIA': 'naija_male_deep',
  'Atlas': 'naija_male_warm'
} as const;

export async function ttsGenerate(opts: { text: string; persona?: "Ezinne"|"Lexi"|"ODIA"|"Atlas"; voice_id?: string; format?: "mp3" }) {
  const endpoint = import.meta.env.VITE_TTS_PROXY_URL as string || 'https://nyrvnskbkitrazudrkkc.supabase.co/functions/v1/tts';
  
  // Map persona to voice_id if not provided
  const voiceId = opts.voice_id || (opts.persona ? PERSONA_MAP[opts.persona] : 'naija_female_warm');
  
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      text: opts.text.substring(0, 5000), // Limit text length
      persona: opts.persona,
      voice_id: voiceId,
      format: opts.format ?? "mp3" 
    })
  });
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new Error(`TTS failed: ${res.status} - ${errorText}`);
  }
  
  const ct = res.headers.get("Content-Type") || "";
  if (!ct.startsWith("audio/")) {
    const errorText = await res.text().catch(() => "Non-audio response");
    throw new Error(errorText);
  }
  
  const blob = await res.blob();
  if (!blob.size) throw new Error("Empty audio");
  return URL.createObjectURL(blob);
}