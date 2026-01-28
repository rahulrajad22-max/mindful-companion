import { useState, useCallback, useRef } from 'react';

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
    // Stop HTML5 audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    // Stop Web Speech API if speaking
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    audioQueueRef.current = [];
    isProcessingQueueRef.current = false;
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  // Fallback to browser's Web Speech API
  const speakWithBrowserTTS = useCallback((text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Web Speech API not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage.code;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to find a voice matching the selected language
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(voice => 
        voice.lang.startsWith(selectedLanguage.code.split('-')[0])
      );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);

      window.speechSynthesis.speak(utterance);
    });
  }, [selectedLanguage.code]);

  // Try ElevenLabs first, fallback to browser TTS
  const speakWithElevenLabs = useCallback(async (text: string): Promise<boolean> => {
    try {
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

      if (!response.ok) {
        console.warn('ElevenLabs TTS failed, using browser fallback');
        return false;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      await new Promise<void>((resolve, reject) => {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        audio.onerror = (e) => {
          URL.revokeObjectURL(audioUrl);
          reject(e);
        };
        
        audio.play().catch(reject);
      });

      return true;
    } catch (error) {
      console.warn('ElevenLabs error, using browser fallback:', error);
      return false;
    }
  }, [selectedLanguage.code]);

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
        
        // Try ElevenLabs first, fallback to browser TTS
        const elevenLabsSuccess = await speakWithElevenLabs(text);
        
        if (!elevenLabsSuccess) {
          // Use browser's built-in TTS as fallback
          await speakWithBrowserTTS(text);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Voice assistant error:', error);
        setIsLoading(false);
      }
    }

    isProcessingQueueRef.current = false;
    setIsSpeaking(false);
  }, [speakWithElevenLabs, speakWithBrowserTTS]);

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
