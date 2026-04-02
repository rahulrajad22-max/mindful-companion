import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle2, XCircle, Timer, Zap, Trophy } from "lucide-react";

const QUESTIONS = [
  {
    q: "What's a simple thing you can do when feeling overwhelmed?",
    options: ["Push through it", "Take 5 deep breaths", "Ignore the feeling", "Stay up late"],
    correct: 1,
    fact: "Deep breathing slows your heart rate and helps your body relax — try it anytime!",
  },
  {
    q: "Which of these is a healthy way to deal with sadness?",
    options: ["Bottling it up", "Talking to someone you trust", "Pretending to be happy", "Avoiding everyone"],
    correct: 1,
    fact: "Sharing your feelings with someone you trust can make you feel lighter and more understood.",
  },
  {
    q: "What's a good bedtime habit for better sleep?",
    options: ["Scrolling your phone", "Putting screens away 30 min before bed", "Eating a big meal", "Watching intense movies"],
    correct: 1,
    fact: "Screens emit blue light that tricks your brain into staying awake — try reading or stretching instead!",
  },
  {
    q: "How does spending time in nature help you?",
    options: ["It doesn't help", "It can reduce stress and boost mood", "It makes you tired", "It's only for fitness"],
    correct: 1,
    fact: "Even a 20-minute walk in a park can lower stress and make you feel happier!",
  },
  {
    q: "What does 'self-care' really mean?",
    options: ["Being selfish", "Doing things that recharge your mind and body", "Buying expensive stuff", "Avoiding responsibilities"],
    correct: 1,
    fact: "Self-care is about small daily habits like rest, hydration, and doing things you enjoy.",
  },
  {
    q: "Which of these can boost your mood quickly?",
    options: ["Complaining about everything", "Listening to your favorite song", "Skipping meals", "Staying indoors all day"],
    correct: 1,
    fact: "Music can instantly shift your mood — create a playlist of songs that make you feel good!",
  },
  {
    q: "When a friend is going through a tough time, what helps most?",
    options: ["Giving unsolicited advice", "Just listening without judging", "Telling them to get over it", "Changing the subject"],
    correct: 1,
    fact: "Sometimes people don't need solutions — they just need someone to listen and care.",
  },
  {
    q: "What's a sign that you might need a mental health break?",
    options: ["Feeling energetic all the time", "Feeling constantly tired or irritable", "Sleeping perfectly", "Having no stress at all"],
    correct: 1,
    fact: "Constant tiredness or irritability are your body's way of saying 'slow down and rest.'",
  },
  {
    q: "How many glasses of water a day can help your mood?",
    options: ["1-2 glasses", "6-8 glasses", "Only when thirsty", "Water doesn't matter"],
    correct: 1,
    fact: "Staying hydrated helps your brain work better and can prevent headaches and fatigue.",
  },
  {
    q: "What's a good way to start your morning positively?",
    options: ["Checking social media immediately", "Writing down 3 things you're grateful for", "Rushing out of bed", "Skipping breakfast"],
    correct: 1,
    fact: "Gratitude journaling in the morning sets a positive tone for your whole day!",
  },
  {
    q: "Which activity helps calm your mind before a stressful event?",
    options: ["Overthinking every detail", "Taking a short walk", "Drinking lots of coffee", "Arguing with someone"],
    correct: 1,
    fact: "A short walk clears your head and helps you approach challenges with a fresh perspective.",
  },
  {
    q: "What should you do if negative thoughts keep coming back?",
    options: ["Believe every thought", "Acknowledge them and let them pass", "Fight them angrily", "Pretend they don't exist"],
    correct: 1,
    fact: "Thoughts are like clouds — you can notice them without holding on. Let them drift by.",
  },
];

interface MoodTriviaProps {
  onGameEnd: (score: number) => void;
}

export function MoodTrivia({ onGameEnd }: MoodTriviaProps) {
  const { t } = useTranslation();
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
          <h3 className="font-display text-xl font-bold text-foreground">{t("games.moodTriviaTitle")}</h3>
          <p className="text-sm text-muted-foreground mt-2">{t("games.moodTriviaDesc")}</p>
        </div>
        <CardContent className="p-6 text-center">
          <div className="flex gap-4 justify-center mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Timer className="h-4 w-4" /> {t("games.perQuestion")}</span>
            <span className="flex items-center gap-1"><Zap className="h-4 w-4" /> {t("games.streakBonuses")}</span>
          </div>
          <Button onClick={startGame} className="rounded-xl px-8">{t("games.startQuiz")}</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === "finished") {
    return (
      <Card className="border-border/30 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 text-center">
          <Trophy className="h-12 w-12 mx-auto text-primary mb-3" />
          <h3 className="font-display text-2xl font-bold text-foreground">{t("games.quizComplete")}</h3>
          <p className="text-4xl font-bold text-primary mt-2">{score} {t("games.pts")}</p>
        </div>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">{t("games.greatJob")}</p>
          <Button onClick={startGame} className="rounded-xl px-8">{t("games.playAgain")}</Button>
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
          {streak >= 2 && <Badge className="bg-accent text-accent-foreground"><Zap className="h-3 w-3 mr-1" />{streak} {t("games.streak")}</Badge>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">{score} {t("games.pts")}</span>
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
