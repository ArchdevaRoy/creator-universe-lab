import { supabase } from "@/integrations/supabase/client";

// ─── Deepseek AI Chat ───────────────────────────────────────────────
type Msg = { role: "user" | "assistant" | "system"; content: string };
type ChatType = "chat" | "script" | "hook" | "repurpose" | "blueprint";

export async function streamDeepseekChat({
  messages,
  type = "chat",
  onDelta,
  onDone,
}: {
  messages: Msg[];
  type?: ChatType;
  onDelta: (text: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/deepseek-chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages, type }),
    }
  );

  if (!resp.ok || !resp.body) throw new Error(`Chat request failed: ${resp.status}`);

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { onDone(); return; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch { buf = line + "\n" + buf; break; }
    }
  }
  onDone();
}

// ─── Pinterest Boards ────────────────────────────────────────────────
export async function fetchPinterestPins(query: string) {
  const { data, error } = await supabase.functions.invoke("pinterest-boards", {
    body: { query },
  });
  if (error) throw error;
  return data;
}

export async function fetchPinterestBoard(boardId: string) {
  const { data, error } = await supabase.functions.invoke("pinterest-boards", {
    body: { boardId },
  });
  if (error) throw error;
  return data;
}

// ─── Video Generation ────────────────────────────────────────────────
export type VideoProvider = "sora" | "pixverse" | "veo";

export async function generateVideo({
  provider,
  prompt,
  duration = 5,
  aspectRatio = "9:16",
}: {
  provider: VideoProvider;
  prompt: string;
  duration?: number;
  aspectRatio?: string;
}) {
  const fnMap: Record<VideoProvider, string> = {
    sora: "sora-video",
    pixverse: "pixverse-video",
    veo: "veo-video",
  };

  const { data, error } = await supabase.functions.invoke(fnMap[provider], {
    body: { prompt, duration, aspect_ratio: aspectRatio },
  });
  if (error) throw error;
  return data;
}

// ─── ElevenLabs Audio ────────────────────────────────────────────────
export async function generateTTS(text: string, voiceId?: string) {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-audio`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ text, voiceId, type: "tts" }),
    }
  );
  if (!response.ok) throw new Error(`TTS failed: ${response.status}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function generateSFX(text: string) {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-audio`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ text, type: "sfx" }),
    }
  );
  if (!response.ok) throw new Error(`SFX failed: ${response.status}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function generateMusic(prompt: string) {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-audio`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ text: prompt, type: "music" }),
    }
  );
  if (!response.ok) throw new Error(`Music gen failed: ${response.status}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
