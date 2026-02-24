import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, duration = 5, aspect_ratio = "9:16" } = await req.json();
    const GOOGLE_VEO_API_KEY = Deno.env.get("GOOGLE_VEO_API_KEY");
    if (!GOOGLE_VEO_API_KEY) throw new Error("GOOGLE_VEO_API_KEY is not configured");

    // Google VEO video generation
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/veo-2.0-generate-001:predictLongRunning", {
      method: "POST",
      headers: {
        "x-goog-api-key": GOOGLE_VEO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          aspectRatio: aspect_ratio,
          durationSeconds: duration,
          sampleCount: 1,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("VEO API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: `VEO API error [${response.status}]` }), {
        status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("veo error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
