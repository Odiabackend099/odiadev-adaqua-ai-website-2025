export async function ttsGenerate(opts: { text: string; persona?: "Ezinne"|"Lexi"|"ODIA"|"Atlas"; voice_id?: string; format?: "mp3" }) {
  const endpoint = import.meta.env.VITE_TTS_ENDPOINT as string;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: opts.text, persona: opts.persona, voice_id: opts.voice_id, format: opts.format ?? "mp3" })
  });
  if (!res.ok) throw new Error("TTS failed");
  const ct = res.headers.get("Content-Type") || "";
  if (!ct.startsWith("audio/")) throw new Error(await res.text().catch(()=> "Non-audio response"));
  const blob = await res.blob();
  if (!blob.size) throw new Error("Empty audio");
  return URL.createObjectURL(blob);
}