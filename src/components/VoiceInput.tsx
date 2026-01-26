import { useState, useCallback } from "react";
import { useScribe } from "@elevenlabs/react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceInput({ onTranscript, disabled, className }: VoiceInputProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    onPartialTranscript: (data) => {
      console.log("Partial transcript:", data.text);
    },
    onCommittedTranscript: (data) => {
      console.log("Committed transcript:", data.text);
      if (data.text.trim()) {
        onTranscript(data.text);
      }
    },
  });

  const handleToggle = useCallback(async () => {
    setError(null);

    if (scribe.isConnected) {
      scribe.disconnect();
      return;
    }

    setIsConnecting(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "elevenlabs-scribe-token"
      );

      if (fnError) {
        console.error("Error getting scribe token:", fnError);
        throw new Error("Failed to get voice token");
      }

      if (!data?.token) {
        throw new Error("No token received");
      }

      await scribe.connect({
        token: data.token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (err) {
      console.error("Voice input error:", err);
      setError(err instanceof Error ? err.message : "Failed to start voice input");
    } finally {
      setIsConnecting(false);
    }
  }, [scribe]);

  const isActive = scribe.isConnected;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant={isActive ? "destructive" : "outline"}
        size="icon"
        onClick={handleToggle}
        disabled={disabled || isConnecting}
        className={cn(
          "relative transition-all",
          isActive && "animate-pulse"
        )}
        title={isActive ? "Stop recording" : "Start voice input"}
      >
        {isConnecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isActive ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
        {isActive && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-pulse" />
        )}
      </Button>
      
      {isActive && scribe.partialTranscript && (
        <span className="text-xs text-muted-foreground italic max-w-[200px] truncate">
          {scribe.partialTranscript}
        </span>
      )}
      
      {error && (
        <span className="text-xs text-destructive">{error}</span>
      )}
    </div>
  );
}
