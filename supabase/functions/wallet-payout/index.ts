import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Not authenticated");
    
    const userId = userData.user.id;
    const { action, karma_amount } = await req.json();

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    if (action === "request_payout") {
      // Use the database function to handle the payout request atomically
      const { data, error } = await supabaseClient.rpc("request_payout", {
        p_user_id: userId,
        p_karma_amount: karma_amount,
      });

      if (error) throw new Error(error.message);
      if (!data.success) throw new Error(data.error);

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "setup_stripe_connect") {
      // Create a Stripe Connect account for the creator
      const { data: wallet } = await supabaseClient
        .from("wallets")
        .select("stripe_account_id")
        .eq("user_id", userId)
        .single();

      let accountId = wallet?.stripe_account_id;

      if (!accountId) {
        const account = await stripe.accounts.create({
          type: "express",
          email: userData.user.email,
          capabilities: {
            transfers: { requested: true },
          },
        });
        accountId = account.id;

        // Upsert wallet with stripe account
        await supabaseClient
          .from("wallets")
          .upsert({ user_id: userId, stripe_account_id: accountId }, { onConflict: "user_id" });
      }

      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${req.headers.get("origin")}/wallet`,
        return_url: `${req.headers.get("origin")}/wallet?stripe_connected=true`,
        type: "account_onboarding",
      });

      return new Response(JSON.stringify({ url: accountLink.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "check_stripe_status") {
      const { data: wallet } = await supabaseClient
        .from("wallets")
        .select("stripe_account_id")
        .eq("user_id", userId)
        .single();

      if (!wallet?.stripe_account_id) {
        return new Response(JSON.stringify({ connected: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const account = await stripe.accounts.retrieve(wallet.stripe_account_id);
      return new Response(JSON.stringify({
        connected: account.charges_enabled && account.payouts_enabled,
        details_submitted: account.details_submitted,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action");
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
