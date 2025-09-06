export async function ttsGenerate(opts: { endpoint: string; text: string; persona?: "Ezinne"|"Lexi"|"ODIA"|"Atlas"; voice_id?: string; format?: "mp3" }) {
  const res = await fetch(opts.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: opts.text, persona: opts.persona, voice_id: opts.voice_id, format: opts.format ?? "mp3" })
  });
  if (!res.ok) throw new Error("TTS failed");
  const ct = res.headers.get("Content-Type") || "";
  if (!ct.startsWith("audio/")) {
    const msg = await res.text().catch(()=>"");
    throw new Error(msg || "Non-audio response");
  }
  const blob = await res.blob();
  if (!blob.size) throw new Error("Empty audio");
  return URL.createObjectURL(blob);
}
