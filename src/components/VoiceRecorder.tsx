import { useState, useCallback } from "react";
import { useScribe, CommitStrategy } from "@elevenlabs/react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceRecorder({ onTranscript, disabled, className }: VoiceRecorderProps) {
  const [isReframing, setIsReframing] = useState(false);
  const [rawTranscript, setRawTranscript] = useState("");
  const { toast } = useToast();

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    commitStrategy: CommitStrategy.VAD,
    onPartialTranscript: (data) => {
      // partial updates shown in UI
    },
    onCommittedTranscript: (data) => {
      setRawTranscript((prev) => prev + (prev ? " " : "") + data.text);
    },
  });

  const handleStart = useCallback(async () => {
    try {
      setRawTranscript("");

      const { data, error } = await supabase.functions.invoke("elevenlabs-scribe-token");

      if (error || !data?.token) {
        throw new Error("Failed to get voice token");
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
      console.error("Failed to start recording:", err);
      toast({
        title: "Could not start recording",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    }
  }, [scribe, toast]);

  const handleStop = useCallback(async () => {
    scribe.disconnect();

    // Combine committed transcripts + any remaining raw
    const allText = [
      ...scribe.committedTranscripts.map((t) => t.text),
    ].join(" ").trim();

    const finalText = allText || rawTranscript;

    if (!finalText) {
      toast({
        title: "No speech detected",
        description: "Please try speaking again.",
      });
      return;
    }

    // Reframe the transcribed text
    setIsReframing(true);
    try {
      const { data, error } = await supabase.functions.invoke("reframe-text", {
        body: { text: finalText },
      });

      if (error || !data?.reframed) {
        // Fallback to raw transcript
        onTranscript(finalText);
        toast({
          title: "Voice recorded",
          description: "Used raw transcription (reframing unavailable).",
        });
      } else {
        onTranscript(data.reframed);
        toast({
          title: "Voice recorded & refined",
          description: "Your speech has been transcribed and polished.",
        });
      }
    } catch {
      onTranscript(finalText);
    } finally {
      setIsReframing(false);
      setRawTranscript("");
    }
  }, [scribe, rawTranscript, onTranscript, toast]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {scribe.isConnected ? (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleStop}
          disabled={disabled || isReframing}
          className="gap-2 animate-pulse"
        >
          <MicOff className="h-4 w-4" />
          Stop Recording
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleStart}
          disabled={disabled || isReframing}
          className="gap-2"
        >
          {isReframing ? (
            <>
              <Wand2 className="h-4 w-4 animate-spin" />
              Refining...
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Record Voice
            </>
          )}
        </Button>
      )}

      {/* Recording indicator */}
      {scribe.isConnected && (
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
          </span>
          <div className="flex items-center gap-[3px] h-6">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="w-1 bg-destructive rounded-full"
                style={{
                  animation: "waveform 0.8s ease-in-out infinite",
                  animationDelay: `${i * 0.1}s`,
                  height: "100%",
                }}
              />
            ))}
          </div>
          {scribe.partialTranscript && (
            <span className="text-xs text-muted-foreground italic max-w-[200px] truncate">
              {scribe.partialTranscript}
            </span>
          )}
        </div>
      )}

      {isReframing && (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          AI is refining your speech...
        </span>
      )}

      <style>{`
        @keyframes waveform {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
