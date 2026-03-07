import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, HelpCircle, Sparkles } from "lucide-react";
import type { QuizElement } from "@/data/mentalHealthBooks";

interface ChapterQuizProps {
  quiz: QuizElement;
  index: number;
}

export function ChapterQuiz({ quiz, index }: ChapterQuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const isCorrect = selected !== null && quiz.options[selected]?.correct;

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
  };

  const handleCheck = () => {
    if (selected === null) return;
    setRevealed(true);
  };

  const handleRetry = () => {
    setSelected(null);
    setRevealed(false);
  };

  return (
    <Card className="my-6 border-primary/20 bg-primary/[0.03] overflow-hidden">
      <div className="px-5 py-3 bg-primary/10 flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-primary" />
        <span className="text-sm font-display font-semibold text-primary">Quick Quiz</span>
        <Badge variant="secondary" className="text-[10px] ml-auto">#{index + 1}</Badge>
      </div>
      <CardContent className="p-5 space-y-4">
        <p className="font-medium text-foreground text-sm leading-relaxed">{quiz.question}</p>

        <div className="space-y-2">
          {quiz.options.map((opt, i) => {
            let variant: string = "border-border/40 bg-background hover:bg-muted/50";
            if (selected === i && !revealed) variant = "border-primary bg-primary/10 ring-1 ring-primary/30";
            if (revealed && opt.correct) variant = "border-mood-great bg-mood-great/10 ring-1 ring-mood-great/30";
            if (revealed && selected === i && !opt.correct) variant = "border-destructive bg-destructive/10 ring-1 ring-destructive/30";

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 flex items-center gap-3 ${variant} ${revealed ? "cursor-default" : "cursor-pointer"}`}
              >
                <span className="w-6 h-6 rounded-full border border-border/60 flex items-center justify-center text-xs font-medium shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 text-foreground/80">{opt.text}</span>
                {revealed && opt.correct && <CheckCircle2 className="h-4 w-4 text-mood-great shrink-0" />}
                {revealed && selected === i && !opt.correct && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
              </button>
            );
          })}
        </div>

        {!revealed ? (
          <Button
            size="sm"
            className="rounded-xl"
            disabled={selected === null}
            onClick={handleCheck}
          >
            Check Answer
          </Button>
        ) : (
          <div className="space-y-3">
            <div className={`flex items-start gap-2 p-3 rounded-xl text-sm ${isCorrect ? "bg-mood-great/10 text-mood-great" : "bg-destructive/10 text-destructive"}`}>
              {isCorrect ? <Sparkles className="h-4 w-4 mt-0.5 shrink-0" /> : <XCircle className="h-4 w-4 mt-0.5 shrink-0" />}
              <span>{isCorrect ? "Correct! " : "Not quite. "}{quiz.explanation}</span>
            </div>
            {!isCorrect && (
              <Button variant="outline" size="sm" className="rounded-xl" onClick={handleRetry}>
                Try Again
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
