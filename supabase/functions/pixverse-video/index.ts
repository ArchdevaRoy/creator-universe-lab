import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, duration = 5, aspect_ratio = "9:16", style = "realistic" } = await req.json();
    const PIXVERSE_API_KEY = Deno.env.get("PIXVERSE_API_KEY");
    if (!PIXVERSE_API_KEY) throw new Error("PIXVERSE_API_KEY is not configured");

    const response = await fetch("https://api.pixverse.ai/v2/video/text/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PIXVERSE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        duration,
        aspect_ratio,
        style,
        quality: "high",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pixverse API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: `Pixverse API error [${response.status}]` }), {
        status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("pixverse error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
