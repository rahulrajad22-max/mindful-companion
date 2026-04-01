import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle2, XCircle, Timer, Zap, Trophy } from "lucide-react";

const QUESTIONS = [
  {
    q: "Which neurotransmitter is often called the 'feel-good' chemical?",
    options: ["Dopamine", "Cortisol", "Adrenaline", "Melatonin"],
    correct: 0,
    fact: "Dopamine plays a key role in motivation, pleasure, and reward pathways in the brain.",
  },
  {
    q: "What is the recommended amount of sleep for most adults?",
    options: ["4-5 hours", "5-6 hours", "7-9 hours", "10-12 hours"],
    correct: 2,
    fact: "The National Sleep Foundation recommends 7-9 hours per night for optimal mental health.",
  },
  {
    q: "Which breathing technique is commonly used for anxiety relief?",
    options: ["Rapid breathing", "4-7-8 technique", "Holding breath", "Shallow breathing"],
    correct: 1,
    fact: "The 4-7-8 technique activates the parasympathetic nervous system, calming anxiety.",
  },
  {
    q: "What does CBT stand for in therapy?",
    options: ["Cognitive Brain Training", "Cognitive Behavioral Therapy", "Creative Body Therapy", "Clinical Behavior Test"],
    correct: 1,
    fact: "CBT helps people identify and change negative thought patterns and behaviors.",
  },
  {
    q: "Which activity has been shown to reduce cortisol levels?",
    options: ["Watching the news", "Mindfulness meditation", "Scrolling social media", "Multitasking"],
    correct: 1,
    fact: "Regular meditation can reduce cortisol by up to 25%, lowering stress and anxiety.",
  },
  {
    q: "What part of the brain processes emotions?",
    options: ["Cerebellum", "Amygdala", "Hippocampus", "Brain stem"],
    correct: 1,
    fact: "The amygdala is the brain's emotional center, processing fear, anxiety, and joy.",
  },
  {
    q: "How many minutes of exercise per day can improve mood?",
    options: ["60 minutes", "30 minutes", "5 minutes", "120 minutes"],
    correct: 1,
    fact: "Just 30 minutes of moderate exercise releases endorphins that boost mood significantly.",
  },
  {
    q: "What is 'grounding' in mental health?",
    options: ["Standing barefoot", "A technique to stay present", "A punishment method", "A sleep position"],
    correct: 1,
    fact: "Grounding techniques like the 5-4-3-2-1 method help anchor you during anxiety or panic.",
  },
  {
    q: "Which vitamin is linked to mood regulation?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
    correct: 2,
    fact: "Vitamin D deficiency is associated with depression — sunlight helps your body produce it.",
  },
  {
    q: "What is the 'fight or flight' response?",
    options: ["A workout routine", "A stress response by the nervous system", "A sleep cycle phase", "A meditation technique"],
    correct: 1,
    fact: "This survival response releases adrenaline and cortisol to prepare the body for danger.",
  },
];

interface MoodTriviaProps {
  onGameEnd: (score: number) => void;
}

export function MoodTrivia({ onGameEnd }: MoodTriviaProps) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [timer, setTimer] = useState(15);
  const [shuffledQuestions, setShuffledQuestions] = useState(QUESTIONS);

  const startGame = () => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 7);
    setShuffledQuestions(shuffled);
    setGameState("playing");
    setCurrentQ(0);
    setScore(0);
    setStreak(0);
    setSelected(null);
    setRevealed(false);
    setTimer(15);
  };

  useEffect(() => {
    if (gameState !== "playing" || revealed) return;
    if (timer <= 0) {
      setRevealed(true);
      setStreak(0);
      setTimeout(nextQuestion, 2000);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, gameState, revealed]);

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    const q = shuffledQuestions[currentQ];
    if (i === q.correct) {
      const bonus = streak >= 2 ? 15 : 10;
      setScore((s) => s + bonus + Math.max(0, timer));
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    setTimeout(nextQuestion, 2000);
  };

  const nextQuestion = useCallback(() => {
    if (currentQ + 1 >= shuffledQuestions.length) {
      setGameState("finished");
      onGameEnd(score);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setRevealed(false);
      setTimer(15);
    }
  }, [currentQ, shuffledQuestions.length, score, onGameEnd]);

  if (gameState === "idle") {
    return (
      <Card className="border-border/30 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 text-center">
          <Brain className="h-12 w-12 mx-auto text-primary mb-3" />
          <h3 className="font-display text-xl font-bold text-foreground">Mood Trivia</h3>
          <p className="text-sm text-muted-foreground mt-2">Test your mental health knowledge! Answer quickly for bonus points.</p>
        </div>
        <CardContent className="p-6 text-center">
          <div className="flex gap-4 justify-center mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Timer className="h-4 w-4" /> 15s per question</span>
            <span className="flex items-center gap-1"><Zap className="h-4 w-4" /> Streak bonuses</span>
          </div>
          <Button onClick={startGame} className="rounded-xl px-8">Start Quiz</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === "finished") {
    return (
      <Card className="border-border/30 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 text-center">
          <Trophy className="h-12 w-12 mx-auto text-primary mb-3" />
          <h3 className="font-display text-2xl font-bold text-foreground">Quiz Complete!</h3>
          <p className="text-4xl font-bold text-primary mt-2">{score} pts</p>
        </div>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">Great job learning about mental health!</p>
          <Button onClick={startGame} className="rounded-xl px-8">Play Again</Button>
        </CardContent>
      </Card>
    );
  }

  const q = shuffledQuestions[currentQ];

  return (
    <Card className="border-border/30 overflow-hidden">
      <div className="px-5 py-3 flex items-center justify-between bg-muted/50">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Q{currentQ + 1}/{shuffledQuestions.length}</Badge>
          {streak >= 2 && <Badge className="bg-accent text-accent-foreground"><Zap className="h-3 w-3 mr-1" />{streak} streak!</Badge>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">{score} pts</span>
          <span className={`text-sm font-bold ${timer <= 5 ? "text-destructive animate-pulse" : "text-muted-foreground"}`}>
            <Timer className="h-4 w-4 inline mr-1" />{timer}s
          </span>
        </div>
      </div>
      <Progress value={(timer / 15) * 100} className="h-1 rounded-none" />
      <CardContent className="p-5 space-y-4">
        <p className="font-medium text-foreground leading-relaxed">{q.q}</p>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let cls = "border-border/40 bg-background hover:bg-muted/50";
            if (selected === i && !revealed) cls = "border-primary bg-primary/10 ring-1 ring-primary/30";
            if (revealed && i === q.correct) cls = "border-mood-great bg-mood-great/10 ring-1 ring-mood-great/30";
            if (revealed && selected === i && i !== q.correct) cls = "border-destructive bg-destructive/10 ring-1 ring-destructive/30";

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 flex items-center gap-3 ${cls} ${revealed ? "cursor-default" : "cursor-pointer"}`}
              >
                <span className="w-6 h-6 rounded-full border border-border/60 flex items-center justify-center text-xs font-medium shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 text-foreground/80">{opt}</span>
                {revealed && i === q.correct && <CheckCircle2 className="h-4 w-4 text-mood-great shrink-0" />}
                {revealed && selected === i && i !== q.correct && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
              </button>
            );
          })}
        </div>
        {revealed && (
          <div className="p-3 rounded-xl bg-primary/5 text-sm text-muted-foreground animate-fade-up">
            💡 {q.fact}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
