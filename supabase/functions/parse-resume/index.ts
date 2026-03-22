import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const fileName = file.name.toLowerCase();
    const fileType = file.type;
    
    // Check if it's a text-based file we can read directly
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      const text = await file.text();
      return new Response(
        JSON.stringify({ text, fileName: file.name }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For PDFs, use the Lovable document parsing API
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      const apiKey = Deno.env.get('LOVABLE_API_KEY');
      
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'API key not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Read file as base64
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Use the AI to extract text from PDF
      const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: 'You are a document text extractor. Extract all text content from the provided PDF document and return it as plain text. Preserve the structure and formatting as much as possible, including sections, bullet points, and line breaks. Do not add any commentary or analysis - just extract and return the raw text content.'
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extract all text from this PDF resume document:'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:application/pdf;base64,${base64}`
                  }
                }
              ]
            }
          ],
          max_tokens: 8000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', errorText);
        return new Response(
          JSON.stringify({ error: 'Failed to parse PDF. Please try pasting the text directly.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      const extractedText = data.choices?.[0]?.message?.content || '';

      return new Response(
        JSON.stringify({ text: extractedText, fileName: file.name }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For Word documents
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        fileName.endsWith('.docx')) {
      return new Response(
        JSON.stringify({ error: 'Word documents (.docx) are not yet supported. Please save as PDF or paste the text directly.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Unsupported file type. Please upload a PDF or paste your resume text.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error parsing resume:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to parse file. Please try pasting your resume text instead.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
