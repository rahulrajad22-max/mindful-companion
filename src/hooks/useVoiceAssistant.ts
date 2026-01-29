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
  testVoice: () => Promise<void>;
  stop: () => void;
}

export function useVoiceAssistant(): UseVoiceAssistantReturn {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceLanguage>(VOICE_LANGUAGES[0]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  
  const audioQueueRef = useRef<string[]>([]);
  const isProcessingQueueRef = useRef(false);
  const translationCacheRef = useRef<Map<string, string>>(new Map());

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

  // Clear cache when language changes
  useEffect(() => {
    translationCacheRef.current.clear();
  }, [selectedLanguage.code]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    audioQueueRef.current = [];
    isProcessingQueueRef.current = false;
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  // Translate text using Lovable AI (Gemini)
  const translateText = useCallback(async (text: string): Promise<string> => {
    // Check cache first
    const cacheKey = `${selectedLanguage.code}:${text}`;
    const cached = translationCacheRef.current.get(cacheKey);
    if (cached) {
      return cached;
    }

    // If English, no translation needed
    if (selectedLanguage.code === 'en-IN') {
      return text;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-text`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ 
            text, 
            targetLanguage: selectedLanguage.code 
          }),
        }
      );

      if (!response.ok) {
        console.warn('Translation failed, using original text');
        return text;
      }

      const data = await response.json();
      const translatedText = data.translatedText || text;
      
      // Cache the translation
      translationCacheRef.current.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.warn('Translation error:', error);
      return text;
    }
  }, [selectedLanguage.code]);

  // Browser's Web Speech API
  const speakWithBrowserTTS = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.warn('Web Speech API not supported');
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage.code;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to find a matching voice
      const voices = window.speechSynthesis.getVoices();
      const langCode = selectedLanguage.code.split('-')[0];
      
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

      // Chrome bug workaround
      const timeout = setTimeout(() => {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 10000);

      utterance.onend = () => {
        clearTimeout(timeout);
        resolve();
      };
      
      utterance.onerror = () => {
        clearTimeout(timeout);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
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
        
        // Translate using Gemini, then speak with browser TTS
        const translatedText = await translateText(text);
        setIsLoading(false);
        
        await speakWithBrowserTTS(translatedText);
      } catch (error) {
        console.error('Voice assistant error:', error);
        setIsLoading(false);
      }
    }

    isProcessingQueueRef.current = false;
    setIsSpeaking(false);
  }, [translateText, speakWithBrowserTTS]);

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

  const testVoice = useCallback(async () => {
    const testPhrase = "Welcome to your wellness journey. Take a deep breath and relax.";
    
    setIsLoading(true);
    try {
      const translatedText = await translateText(testPhrase);
      setIsLoading(false);
      await speakWithBrowserTTS(translatedText);
    } catch (error) {
      console.error('Test voice error:', error);
      setIsLoading(false);
    }
  }, [translateText, speakWithBrowserTTS]);

  return {
    isEnabled,
    isSpeaking,
    isLoading,
    selectedLanguage,
    setSelectedLanguage,
    toggleVoiceAssistant,
    speak,
    testVoice,
    stop,
  };
}
