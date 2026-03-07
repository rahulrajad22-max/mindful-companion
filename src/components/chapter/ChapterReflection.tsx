import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Save, CheckCircle2 } from "lucide-react";

interface ChapterReflectionProps {
  prompt: string;
  placeholder?: string;
  index: number;
}

export function ChapterReflection({ prompt, placeholder, index }: ChapterReflectionProps) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!text.trim()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="my-6 border-accent/20 bg-accent/[0.03] overflow-hidden">
      <div className="px-5 py-3 bg-accent/10 flex items-center gap-2">
        <PenLine className="h-4 w-4 text-accent-foreground" />
        <span className="text-sm font-display font-semibold text-accent-foreground">Reflection Prompt</span>
      </div>
      <CardContent className="p-5 space-y-4">
        <p className="text-sm font-medium text-foreground leading-relaxed italic">"{prompt}"</p>
        <Textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setSaved(false); }}
          placeholder={placeholder || "Take a moment to reflect and write your thoughts..."}
          className="rounded-xl min-h-[100px] resize-none text-sm bg-background"
        />
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl gap-2"
            disabled={!text.trim()}
            onClick={handleSave}
          >
            {saved ? <CheckCircle2 className="h-4 w-4 text-mood-great" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved!" : "Save Reflection"}
          </Button>
          <span className="text-xs text-muted-foreground">{text.length > 0 ? `${text.split(/\s+/).filter(Boolean).length} words` : ""}</span>
        </div>
      </CardContent>
    </Card>
  );
}
