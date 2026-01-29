import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const LANGUAGE_NAMES: Record<string, string> = {
  'en-IN': 'English',
  'hi-IN': 'Hindi',
  'bn-IN': 'Bengali',
  'te-IN': 'Telugu',
  'mr-IN': 'Marathi',
  'ta-IN': 'Tamil',
  'gu-IN': 'Gujarati',
  'kn-IN': 'Kannada',
  'ml-IN': 'Malayalam',
  'pa-IN': 'Punjabi',
  'or-IN': 'Odia',
  'as-IN': 'Assamese',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { text, targetLanguage } = await req.json();

    if (!text || typeof text !== 'string') {
      throw new Error('Text is required');
    }

    const languageName = LANGUAGE_NAMES[targetLanguage] || 'English';
    
    // If target is English, return as-is
    if (targetLanguage === 'en-IN' || languageName === 'English') {
      return new Response(JSON.stringify({ translatedText: text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Translating to ${languageName}: "${text.substring(0, 50)}..."`);

    // First translate to the target language, then transliterate to Roman script for TTS
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          {
            role: 'system',
            content: `You are a translator and transliterator. Your task:
1. Translate the given English text to ${languageName}
2. Then provide a ROMANIZED (Latin script) version of the translation that an English text-to-speech system can pronounce naturally

IMPORTANT: Output ONLY the romanized transliteration, nothing else. The output should be easy for an English TTS engine to read aloud and sound like natural ${languageName}.

Example for Hindi: "Take a deep breath" -> "Gehri saans lein" (not "गहरी सांस लें")
Example for Tamil: "Welcome" -> "Vanakkam" (not "வணக்கம்")
Example for Bengali: "Hello" -> "Namaskar" (not "নমস্কার")`
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limited');
        return new Response(JSON.stringify({ translatedText: text, error: 'rate_limited' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      // Fallback to original text
      return new Response(JSON.stringify({ translatedText: text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content?.trim() || text;
    
    console.log(`Transliteration result: "${translatedText.substring(0, 50)}..."`);

    return new Response(JSON.stringify({ translatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Translation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Translation failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
