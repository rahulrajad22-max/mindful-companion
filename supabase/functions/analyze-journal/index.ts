import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { journalEntry, mood } = await req.json();
    
    if (!journalEntry || journalEntry.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Journal entry is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service is not configured');
    }

    console.log('Analyzing journal entry with mood:', mood);

    const systemPrompt = `You are a compassionate mental health support AI assistant. Your role is to:
1. Analyze journal entries for emotional sentiment and stress indicators
2. Detect patterns that might indicate anxiety, depression, or elevated stress
3. Provide warm, supportive, and non-clinical feedback
4. Suggest personalized self-care activities

IMPORTANT: You are NOT a replacement for professional mental health care. Always encourage seeking professional help for serious concerns.

Respond in JSON format with this structure:
{
  "sentiment": "positive" | "neutral" | "negative" | "mixed",
  "sentimentScore": number between -1 (very negative) and 1 (very positive),
  "stressLevel": "low" | "medium" | "high",
  "emotionsDetected": string[] (list of emotions like "anxious", "hopeful", "sad", "grateful", etc.),
  "supportiveResponse": string (a warm, empathetic 2-3 sentence response),
  "selfCareRecommendations": string[] (3-5 personalized suggestions),
  "patterns": string[] (any notable patterns or themes observed),
  "disclaimer": "This analysis is for self-reflection only and is not a substitute for professional mental health care."
}`;

    const userPrompt = `Please analyze this journal entry${mood ? ` (user's self-reported mood: ${mood})` : ''}:

"${journalEntry}"

Provide a compassionate analysis focusing on emotional well-being and helpful suggestions.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('Failed to analyze journal entry');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from AI');
    }

    console.log('AI response received:', content.substring(0, 200));

    // Parse the JSON response from the AI
    let analysis;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      analysis = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Return a fallback response
      analysis = {
        sentiment: 'neutral',
        sentimentScore: 0,
        stressLevel: 'medium',
        emotionsDetected: ['reflective'],
        supportiveResponse: content,
        selfCareRecommendations: [
          'Take a few deep breaths',
          'Go for a short walk',
          'Connect with someone you trust'
        ],
        patterns: [],
        disclaimer: 'This analysis is for self-reflection only and is not a substitute for professional mental health care.'
      };
    }

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-journal function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
