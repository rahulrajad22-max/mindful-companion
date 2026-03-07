import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Flag, PartyPopper } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ChapterCheckpointProps {
  title: string;
  checklist: string[];
  index: number;
}

export function ChapterCheckpoint({ title, checklist, index }: ChapterCheckpointProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const progress = Math.round((checked.size / checklist.length) * 100);
  const allDone = checked.size === checklist.length;

  return (
    <Card className={`my-6 overflow-hidden transition-all duration-500 ${allDone ? "border-mood-great/40 bg-mood-great/[0.03]" : "border-border/40"}`}>
      <div className={`px-5 py-3 flex items-center gap-2 ${allDone ? "bg-mood-great/10" : "bg-muted/50"}`}>
        {allDone ? <PartyPopper className="h-4 w-4 text-mood-great" /> : <Flag className="h-4 w-4 text-muted-foreground" />}
        <span className="text-sm font-display font-semibold text-foreground">{title}</span>
        <Badge variant={allDone ? "default" : "secondary"} className={`text-[10px] ml-auto ${allDone ? "bg-mood-great/20 text-mood-great border-mood-great/30" : ""}`}>
          {checked.size}/{checklist.length}
        </Badge>
      </div>
      <CardContent className="p-5 space-y-3">
        <Progress value={progress} className="h-1.5" />
        <div className="space-y-2.5">
          {checklist.map((item, i) => (
            <label
              key={i}
              className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors text-sm ${checked.has(i) ? "bg-mood-great/5" : "hover:bg-muted/40"}`}
            >
              <Checkbox
                checked={checked.has(i)}
                onCheckedChange={() => toggle(i)}
                className="mt-0.5"
              />
              <span className={`leading-relaxed transition-all ${checked.has(i) ? "text-muted-foreground line-through" : "text-foreground/80"}`}>
                {item}
              </span>
            </label>
          ))}
        </div>
        {allDone && (
          <p className="text-xs text-mood-great font-medium text-center pt-1 animate-fade-up">
            🎉 Checkpoint complete! You're making great progress.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
