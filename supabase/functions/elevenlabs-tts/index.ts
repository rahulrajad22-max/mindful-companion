import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Language to voice mapping for multilingual support
const LANGUAGE_VOICES: Record<string, string> = {
  'en-IN': 'EXAVITQu4vr4xnSDxMaL', // Sarah - English
  'hi-IN': 'EXAVITQu4vr4xnSDxMaL', // Sarah - supports Hindi
  'bn-IN': 'EXAVITQu4vr4xnSDxMaL', // Sarah - Bengali
  'te-IN': 'EXAVITQu4vr4xnSDxMaL', // Sarah - Telugu
  'mr-IN': 'EXAVITQu4vr4xnSDxMaL', // Sarah - Marathi
  'ta-IN': 'EXAVITQu4vr4xnSDxMaL', // Sarah - Tamil
  'gu-IN': 'EXAVITQu4vr4xnSDxMaL', // Sarah - Gujarati
  'kn-IN': 'EXAVITQu4vr4xnSDxMaL', // Sarah - Kannada
  'ml-IN': 'EXAVITQu4vr4xnSDxMaL', // Sarah - Malayalam
  'pa-IN': 'EXAVITQu4vr4xnSDxMaL', // Sarah - Punjabi
  'or-IN': 'EXAVITQu4vr4xnSDxMaL', // Sarah - Odia
  'as-IN': 'EXAVITQu4vr4xnSDxMaL', // Sarah - Assamese
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY not configured');
      throw new Error('ElevenLabs API key not configured');
    }

    const { text, language = 'en-IN' } = await req.json();

    if (!text || typeof text !== 'string') {
      throw new Error('Text is required');
    }

    console.log(`TTS request - Language: ${language}, Text: ${text.substring(0, 50)}...`);

    // Get voice ID for the language (ElevenLabs multilingual v2 supports all these languages)
    const voiceId = LANGUAGE_VOICES[language] || LANGUAGE_VOICES['en-IN'];

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
            speed: 0.9, // Slightly slower for exercise instructions
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs TTS error:', response.status, errorText);
      throw new Error(`TTS failed: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    console.log('TTS audio generated successfully, size:', audioBuffer.byteLength);

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error: unknown) {
    console.error('Error in TTS function:', error);
    const errorMessage = error instanceof Error ? error.message : 'TTS failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
