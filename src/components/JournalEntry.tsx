import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInput } from "@/components/VoiceInput";
import { Sparkles, Send } from "lucide-react";

interface JournalEntryProps {
  onSave: (entry: string) => void;
  isAnalyzing?: boolean;
}

export function JournalEntry({ onSave, isAnalyzing }: JournalEntryProps) {
  const [entry, setEntry] = useState("");

  const handleSave = () => {
    if (entry.trim()) {
      onSave(entry);
      setEntry("");
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setEntry((prev) => prev + (prev ? " " : "") + text);
  };

  return (
    <Card className="gradient-card border-border/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Today's Thoughts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="How are you feeling? What's on your mind? Write freely..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="min-h-[150px] resize-none rounded-xl border-border/50 bg-background/50 focus:border-primary/50 focus:ring-primary/20"
        />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <VoiceInput 
              onTranscript={handleVoiceTranscript} 
              disabled={isAnalyzing}
            />
            <p className="text-xs text-muted-foreground">
              Your entries are private and secure
            </p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!entry.trim() || isAnalyzing}
            className="gap-2"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse-soft" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Save Entry
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
