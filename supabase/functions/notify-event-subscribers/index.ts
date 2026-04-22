import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function formatEventDate(dateValue: string | null) {
  if (!dateValue) {
    return "Date to be announced";
  }

  return new Date(dateValue).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });
}

function escapeHtml(value: string | null | undefined) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const resendFromEmail = Deno.env.get("RESEND_FROM_EMAIL");

    if (!resendApiKey || !resendFromEmail) {
      throw new Error("Missing RESEND_API_KEY or RESEND_FROM_EMAIL secret");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Not authenticated");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller } } = await supabaseAdmin.auth.getUser(token);
    if (!caller) {
      throw new Error("Invalid token");
    }

    const { data: isAdmin } = await supabaseAdmin.rpc("has_role", { _user_id: caller.id, _role: "admin" });
    if (!isAdmin) {
      throw new Error("Not authorized");
    }

    const { eventId } = await req.json();
    if (!eventId) {
      throw new Error("Event ID is required");
    }

    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      throw new Error("Event not found");
    }

    const { data: subscribers, error: subscribersError } = await supabaseAdmin
      .from("event_subscribers")
      .select("email, name")
      .eq("active", true);

    if (subscribersError) {
      throw subscribersError;
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active subscribers found", sent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const eventDate = formatEventDate(event.start_at);
    const locationLine = event.location_name?.trim()
      ? event.location_name
      : "Location will be shared soon";
    const locationUrl = event.location_url?.trim();

    const results = await Promise.allSettled(
      subscribers.map((subscriber) =>
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: resendFromEmail,
            to: [subscriber.email],
            subject: `Upcoming Tembo Event: ${event.name}`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
                <h2 style="margin-bottom: 8px;">${escapeHtml(event.name)}</h2>
                <p style="margin-top: 0;">${escapeHtml(event.description || "Join us for the next Tembo experience.")}</p>
                <p><strong>Date:</strong> ${escapeHtml(eventDate)}</p>
                <p><strong>Location:</strong> ${escapeHtml(locationLine)}</p>
                ${locationUrl ? `<p><a href="${locationUrl}">Open live location</a></p>` : ""}
                <p>We are mwasi.</p>
              </div>
            `,
          }),
        }),
      ),
    );

    const deliveredSubscribers = subscribers.filter((_, index) => {
      const result = results[index];
      return result.status === "fulfilled" && result.value.ok;
    });

    const failedCount = subscribers.length - deliveredSubscribers.length;

    if (deliveredSubscribers.length > 0) {
      const deliveredEmails = deliveredSubscribers.map((subscriber) => subscriber.email);
      await supabaseAdmin
        .from("event_subscribers")
        .update({ last_notified_at: new Date().toISOString() })
        .in("email", deliveredEmails);
    }

    return new Response(
      JSON.stringify({
        message: `Notification run completed`,
        sent: deliveredSubscribers.length,
        failed: failedCount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
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
