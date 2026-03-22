import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume, jobDescription } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a premium career coach and resume improvement specialist. Your goal is to transform resumes into polished, ATS-friendly, achievement-focused documents while being encouraging and supportive.

IMPORTANT: Structure your response as a valid JSON object with the following comprehensive format:
{
  "overallScore": number (0-100),
  "atsScore": number (0-100),
  "strengths": ["array of 3-5 specific things the resume does well - be encouraging!"],
  "sections": [
    {
      "category": "string (Formatting, Achievements, Keywords, Grammar, Job Match)",
      "score": number (0-100),
      "findings": ["specific findings - frame constructively"],
      "suggestions": ["actionable, specific suggestions"]
    }
  ],
  "rewrittenBullets": [
    {
      "original": "original bullet point",
      "improved": "STAR-format version with metrics and achievements",
      "explanation": "brief explanation of improvement"
    }
  ],
  "keywordAnalysis": {
    "present": ["keywords found"],
    "missing": ["important keywords to add"],
    "jobMatch": number (0-100, if job description provided)
  },
  "interviewPrep": {
    "likelyQuestions": ["3-5 interview questions likely based on this resume"],
    "challengePoints": ["2-3 resume points interviewers may question"],
    "linkedinTips": ["2-3 LinkedIn/portfolio improvements"],
    "careerGrowth": ["3-4 short-term career tips for next 3-6 months"]
  },
  "smartCoaching": {
    "experienceLevel": "fresher" | "mid-level" | "senior",
    "readinessLevel": "Internship-ready" | "Job-ready" | "Interview-ready",
    "missingSKills": ["skills to develop based on experience level"],
    "recommendedCertifications": ["relevant certifications to pursue"],
    "generatedSummary": "A compelling 2-3 sentence professional summary for their resume"
  },
  "summary": "An encouraging summary paragraph that starts with strengths and provides motivation"
}

CRITICAL GUIDELINES:
1. START with strengths - make the user feel good about what they've accomplished
2. Use supportive, confidence-building language throughout
3. Frame suggestions as opportunities, not criticisms
4. Be specific with metrics in bullet point rewrites
5. Tailor advice based on detected experience level
6. Interview questions should be realistic and based on resume content
7. Career growth tips should be actionable for the next 3-6 months

Respond ONLY with the JSON object, no additional text.`;

    const userPrompt = jobDescription
      ? `Analyze this resume and compare against the job description. Be thorough but encouraging.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}`
      : `Analyze this resume comprehensively. Be thorough but encouraging.

RESUME:
${resume}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to analyze resume" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let analysis;
    try {
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return new Response(JSON.stringify({ error: "Failed to parse analysis results" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save to Supabase if user is authenticated
    try {
      const authHeader = req.headers.get("Authorization");
      console.log("Auth header present:", !!authHeader);

      if (authHeader) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY");

        console.log("SUPABASE_URL present:", !!supabaseUrl);
        console.log("SUPABASE_PUBLISHABLE_KEY present:", !!supabaseKey);

        const supabaseClient = createClient(
          supabaseUrl ?? "",
          supabaseKey ?? "",
          { global: { headers: { Authorization: authHeader } } }
        );

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        console.log("User found:", !!user, "User error:", userError?.message);

        if (!userError && user) {
          const { error: insertError } = await supabaseClient
            .from("resume_uploads")
            .insert({
              user_id: user.id,
              resume_text: resume,
              job_description: jobDescription || null,
              analysis: analysis,
            });

          console.log("Insert error:", insertError?.message ?? "none — saved successfully!");
        }
      } else {
        console.log("No auth header — user not logged in or token not passed");
      }
    } catch (dbError) {
      console.error("Database save error:", dbError);
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-resume error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});