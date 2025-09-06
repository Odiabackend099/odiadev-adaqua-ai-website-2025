import { expect, it, vi } from "vitest";
import { ttsGenerate } from "./tts";

it("returns object URL on audio response", async () => {
  const blob = new Blob(["123"], { type: "audio/mpeg" });
  global.fetch = vi.fn(() => Promise.resolve(new Response(blob, { headers: { "Content-Type": "audio/mpeg" } }))) as any;
  const url = await ttsGenerate({ text: "ok", persona: "Ezinne" });
  expect(url.startsWith("blob:")).toBe(true);
});
