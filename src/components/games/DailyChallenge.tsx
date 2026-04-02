import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Sunrise, Trophy, Heart } from "lucide-react";

const DAILY_TASKS = [
  { id: "grateful", emoji: "🙏", task: "Name 3 things you're grateful for", points: 15 },
  { id: "breathe", emoji: "🌬️", task: "Take 5 slow deep breaths", points: 10 },
  { id: "compliment", emoji: "💬", task: "Give someone a genuine compliment", points: 15 },
  { id: "water", emoji: "💧", task: "Drink a full glass of water", points: 10 },
  { id: "stretch", emoji: "🧘", task: "Do a 2-minute stretch", points: 10 },
  { id: "smile", emoji: "😊", task: "Smile at yourself in the mirror", points: 10 },
  { id: "nature", emoji: "🌿", task: "Look at something green in nature", points: 10 },
  { id: "kindness", emoji: "🎁", task: "Do one random act of kindness", points: 20 },
  { id: "music", emoji: "🎵", task: "Listen to a song that makes you happy", points: 10 },
  { id: "journal", emoji: "✍️", task: "Write one positive thing about today", points: 15 },
  { id: "unplug", emoji: "📵", task: "Put your phone away for 15 minutes", points: 15 },
  { id: "hug", emoji: "🤗", task: "Hug someone (or hug yourself!)", points: 10 },
  { id: "laugh", emoji: "😂", task: "Watch or read something funny", points: 10 },
  { id: "tidy", emoji: "✨", task: "Tidy up one small area around you", points: 10 },
  { id: "affirmation", emoji: "💪", task: "Say a positive affirmation out loud", points: 15 },
];

interface DailyChallengeProps {
  onGameEnd: (score: number) => void;
}

export function DailyChallenge({ onGameEnd }: DailyChallengeProps) {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [tasks, setTasks] = useState<typeof DAILY_TASKS>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);

  const startGame = () => {
    const shuffled = [...DAILY_TASKS].sort(() => Math.random() - 0.5).slice(0, 7);
    setTasks(shuffled);
    setCompleted(new Set());
    setScore(0);
    setGameState("playing");
  };

  const toggleTask = (taskId: string) => {
    if (gameState !== "playing") return;
    const newCompleted = new Set(completed);
    const task = tasks.find((t) => t.id === taskId)!;

    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
      setScore((s) => s - task.points);
    } else {
      newCompleted.add(taskId);
      setScore((s) => s + task.points);
    }
    setCompleted(newCompleted);
  };

  const finishChallenge = () => {
    // Bonus for completing all tasks
    const bonus = completed.size === tasks.length ? 30 : 0;
    const finalScore = score + bonus;
    setScore(finalScore);
    setGameState("finished");
    onGameEnd(finalScore);
  };

  if (gameState === "idle") {
    return (
      <Card className="border-border/30 overflow-hidden">
        <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-6 text-center">
          <Sunrise className="h-12 w-12 mx-auto text-accent mb-3" />
          <h3 className="font-display text-xl font-bold text-foreground">{t("games.challengeTitle")}</h3>
          <p className="text-sm text-muted-foreground mt-2">{t("games.challengeDesc")}</p>
        </div>
        <CardContent className="p-6 text-center">
          <div className="flex gap-4 justify-center mb-6 text-sm text-muted-foreground">
            <span>{t("games.challengeTasks")}</span>
            <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {t("games.challengeBonus")}</span>
          </div>
          <Button onClick={startGame} className="rounded-xl px-8">{t("games.startGame")}</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === "finished") {
    const allDone = completed.size === tasks.length;
    return (
      <Card className="border-border/30 overflow-hidden">
        <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-6 text-center">
          <Trophy className="h-12 w-12 mx-auto text-primary mb-3" />
          <h3 className="font-display text-2xl font-bold text-foreground">
            {allDone ? t("games.challengeAllDone") : t("games.challengeComplete")}
          </h3>
          <p className="text-4xl font-bold text-primary mt-2">{score} {t("games.pts")}</p>
        </div>
        <CardContent className="p-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {completed.size}/{tasks.length} {t("games.challengeTasksDone")}
            {allDone && ` (+30 ${t("games.challengeBonusPts")})`}
          </p>
          <Button onClick={startGame} className="rounded-xl px-8">{t("games.playAgain")}</Button>
        </CardContent>
      </Card>
    );
  }

  const progress = (completed.size / tasks.length) * 100;

  return (
    <Card className="border-border/30 overflow-hidden">
      <div className="px-5 py-3 flex items-center justify-between bg-muted/50">
        <Badge variant="secondary">{completed.size}/{tasks.length} {t("games.challengeTasksDone")}</Badge>
        <span className="text-sm font-semibold text-foreground">{score} {t("games.pts")}</span>
      </div>
      <div className="h-1 bg-muted">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <CardContent className="p-4 space-y-2">
        {tasks.map((task) => {
          const isDone = completed.has(task.id);
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                isDone
                  ? "border-primary/30 bg-primary/10"
                  : "border-border/40 bg-background hover:bg-muted/50 cursor-pointer"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
              )}
              <span className="text-lg shrink-0">{task.emoji}</span>
              <span className={`flex-1 text-sm ${isDone ? "text-primary line-through" : "text-foreground"}`}>
                {task.task}
              </span>
              <Badge variant={isDone ? "default" : "outline"} className="text-xs shrink-0">
                +{task.points}
              </Badge>
            </button>
          );
        })}
        <div className="text-center pt-2">
          <Button
            onClick={finishChallenge}
            className="rounded-xl px-8"
            disabled={completed.size === 0}
          >
            {t("games.challengeFinish")} ({score} {t("games.pts")})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
