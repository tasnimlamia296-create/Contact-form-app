import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/contact-api/, "");

  try {
    // POST /contact — validate and save a new contact message
    if (path === "/contact" && req.method === "POST") {
      let body: Record<string, unknown>;
      try {
        body = await req.json();
      } catch {
        return jsonResponse({ error: "Invalid JSON body" }, 400);
      }

      const fullName = String(body.full_name ?? "").trim();
      const companyName = String(body.company_name ?? "").trim();
      const email = String(body.email ?? "").trim();
      const phone = String(body.phone ?? "").trim();
      const agreement = Boolean(body.agreement);

      const errors: string[] = [];
      if (!fullName) errors.push("Full name is required");
      if (!companyName) errors.push("Company name is required");
      if (!email) errors.push("Email is required");
      else if (!emailRegex.test(email)) errors.push("Email is not valid");
      if (!phone) errors.push("Phone is required");
      if (!agreement) errors.push("You must agree to the terms");

      if (errors.length > 0) {
        return jsonResponse({ error: errors.join(". ") }, 422);
      }

      const { data, error } = await supabase
        .from("contact_messages")
        .insert({ full_name: fullName, company_name: companyName, email, phone, agreement })
        .select("id, full_name, company_name, email, phone, created_at")
        .single();

      if (error) {
        return jsonResponse({ error: "Failed to save message" }, 500);
      }

      return jsonResponse({ message: "Message sent successfully", data }, 201);
    }

    // GET /messages — list all saved messages
    if (path === "/messages" && req.method === "GET") {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("id, full_name, company_name, email, phone, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        return jsonResponse({ error: "Failed to fetch messages" }, 500);
      }

      return jsonResponse({ data });
    }

    return jsonResponse({ error: "Not found" }, 404);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return jsonResponse({ error: message }, 500);
  }
});
