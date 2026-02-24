import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, boardId } = await req.json();
    const PINTEREST_API_KEY = Deno.env.get("PINTEREST_API_KEY");
    if (!PINTEREST_API_KEY) throw new Error("PINTEREST_API_KEY is not configured");

    let url: string;
    let params: Record<string, string> = {};

    if (boardId) {
      // Fetch pins from a specific board
      url = `https://api.pinterest.com/v5/boards/${boardId}/pins`;
      params = { page_size: "25" };
    } else if (query) {
      // Search pins
      url = `https://api.pinterest.com/v5/search/pins`;
      params = { query, page_size: "25" };
    } else {
      return new Response(JSON.stringify({ error: "Provide either a query or boardId" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${url}?${searchParams}`, {
      headers: {
        Authorization: `Bearer ${PINTEREST_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pinterest API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: `Pinterest API error [${response.status}]` }), {
        status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("pinterest error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
