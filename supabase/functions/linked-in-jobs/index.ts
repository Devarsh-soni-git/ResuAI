import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function normalizeText(value: string | null): string {
  return value?.trim().replace(/\s+/g, " ") || "";
}

function toAbsoluteUrl(href: string): string {
  if (!href) return "";
  if (href.startsWith("http")) return href;
  if (href.startsWith("//")) return `https:${href}`;
  if (href.startsWith("/")) return `https://www.linkedin.com${href}`;
  return `https://www.linkedin.com/${href}`;
}

serve(async (req) => {
  console.log('LinkedIn jobs function called');
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keyword, location } = await req.json();
    console.log('Received request with:', { keyword, location });

    if (!keyword || typeof keyword !== "string" || !keyword.trim()) {
      return new Response(JSON.stringify({ error: "Keyword is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Always return mock data for testing
    console.log('Returning mock data for keyword:', keyword);
    const mockJobs = [
      {
        id: "1",
        title: `${keyword} Developer`,
        company: "Tech Corp",
        location: location || "San Francisco, CA",
        posted: "2 days ago",
        snippet: `We are looking for a skilled ${keyword} developer to join our team...`,
        url: "https://example.com/job/1"
      },
      {
        id: "2",
        title: `Senior ${keyword} Engineer`,
        company: "Startup Inc",
        location: location || "New York, NY",
        posted: "1 week ago",
        snippet: `Join our growing team as a senior ${keyword} engineer...`,
        url: "https://example.com/job/2"
      }
    ];
    return new Response(JSON.stringify({ jobs: mockJobs }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("linked-in-jobs error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
