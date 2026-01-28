import { useState, useCallback, useRef, useEffect } from 'react';

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
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isProcessingQueueRef = useRef(false);

  // Preload browser voices on mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoicesLoaded(true);
        }
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    audioQueueRef.current = [];
    isProcessingQueueRef.current = false;
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  // Browser's Web Speech API (always available fallback)
  const speakWithBrowserTTS = useCallback((text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        console.warn('Web Speech API not supported');
        resolve(); // Don't reject, just continue silently
        return;
      }

      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage.code;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to find a matching voice
      const voices = window.speechSynthesis.getVoices();
      const langCode = selectedLanguage.code.split('-')[0];
      
      // First try exact match, then partial match, then any English voice
      let matchingVoice = voices.find(v => v.lang === selectedLanguage.code);
      if (!matchingVoice) {
        matchingVoice = voices.find(v => v.lang.startsWith(langCode));
      }
      if (!matchingVoice) {
        matchingVoice = voices.find(v => v.lang.startsWith('en'));
      }
      
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.warn('Browser TTS error:', e);
        resolve(); // Don't reject, just continue
      };

      // Chrome bug workaround: resume synthesis if it gets stuck
      const resumeInfinity = () => {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      };
      const timeout = setTimeout(resumeInfinity, 10000);

      utterance.onend = () => {
        clearTimeout(timeout);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [selectedLanguage.code]);

  // Skip ElevenLabs entirely - use browser TTS only (ElevenLabs free tier is blocked)
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
        
        // Use browser's built-in TTS (ElevenLabs free tier is currently blocked)
        await speakWithBrowserTTS(text);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Voice assistant error:', error);
        setIsLoading(false);
      }
    }

    isProcessingQueueRef.current = false;
    setIsSpeaking(false);
  }, [speakWithBrowserTTS]);

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
