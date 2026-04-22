import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { email, name } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const safeName = String(name || "").trim();

    if (!normalizedEmail) {
      throw new Error("Email address is required");
    }

    if (!emailPattern.test(normalizedEmail)) {
      throw new Error("Please enter a valid email address");
    }

    const { error } = await supabaseAdmin
      .from("event_subscribers")
      .upsert(
        {
          email: normalizedEmail,
          name: safeName || null,
          active: true,
          subscribed_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      );

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ message: "Subscribed successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
