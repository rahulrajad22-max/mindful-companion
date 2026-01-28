import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VoiceLanguage {
  code: string;
  name: string;
  flag: string;
}

export const VOICE_LANGUAGES: VoiceLanguage[] = [
  { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'pa-IN', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'or-IN', name: 'Odia', flag: '🇮🇳' },
  { code: 'as-IN', name: 'Assamese', flag: '🇮🇳' },
];

interface UseVoiceAssistantReturn {
  isEnabled: boolean;
  isSpeaking: boolean;
  isLoading: boolean;
  selectedLanguage: VoiceLanguage;
  setSelectedLanguage: (lang: VoiceLanguage) => void;
  toggleVoiceAssistant: () => void;
  speak: (text: string) => Promise<void>;
  stop: () => void;
}

export function useVoiceAssistant(): UseVoiceAssistantReturn {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceLanguage>(VOICE_LANGUAGES[0]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isProcessingQueueRef = useRef(false);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    audioQueueRef.current = [];
    isProcessingQueueRef.current = false;
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  const processQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    isProcessingQueueRef.current = true;
    setIsSpeaking(true);

    while (audioQueueRef.current.length > 0) {
      const text = audioQueueRef.current.shift();
      if (!text) continue;

      try {
        setIsLoading(true);
        
        // Call the TTS edge function
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ 
              text, 
              language: selectedLanguage.code 
            }),
          }
        );

        setIsLoading(false);

        if (!response.ok) {
          console.error('TTS request failed:', response.status);
          continue;
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Play the audio
        await new Promise<void>((resolve, reject) => {
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            resolve();
          };
          
          audio.onerror = (e) => {
            URL.revokeObjectURL(audioUrl);
            console.error('Audio playback error:', e);
            reject(e);
          };
          
          audio.play().catch(reject);
        });
      } catch (error) {
        console.error('Voice assistant error:', error);
      }
    }

    isProcessingQueueRef.current = false;
    setIsSpeaking(false);
  }, [selectedLanguage.code]);

  const speak = useCallback(async (text: string) => {
    if (!isEnabled || !text) return;
    
    audioQueueRef.current.push(text);
    
    if (!isProcessingQueueRef.current) {
      processQueue();
    }
  }, [isEnabled, processQueue]);

  const toggleVoiceAssistant = useCallback(() => {
    if (isEnabled) {
      stop();
    }
    setIsEnabled(!isEnabled);
  }, [isEnabled, stop]);

  return {
    isEnabled,
    isSpeaking,
    isLoading,
    selectedLanguage,
    setSelectedLanguage,
    toggleVoiceAssistant,
    speak,
    stop,
  };
}
