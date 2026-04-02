import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grid3X3, Trophy, Star, PartyPopper } from "lucide-react";

const BINGO_ACTIVITIES = [
  "Drank 8 glasses of water 💧",
  "Went for a walk outside 🚶",
  "Called or texted a friend 📱",
  "Wrote in a journal ✍️",
  "Did 5 minutes of stretching 🧘",
  "Ate a healthy meal 🥗",
  "Listened to calming music 🎵",
  "Took 3 deep breaths 🌬️",
  "Said something kind to someone 💬",
  "Read for 10 minutes 📖",
  "Smiled at a stranger 😊",
  "Noticed something beautiful 🌸",
  "Practiced gratitude 🙏",
  "Avoided social media for 1 hour 📵",
  "Spent time with a pet or nature 🐾",
  "Organized something small 🗂️",
  "Laughed at something funny 😂",
  "Drank herbal tea ☕",
  "Complimented yourself 💪",
  "Did a random act of kindness 🎁",
  "Took a screen break 👀",
  "Tried a new healthy recipe 🍳",
  "Meditated for 5 minutes 🧘‍♀️",
  "Wrote down 3 things you're grateful for 📝",
  "Went to bed on time 😴",
];

interface PositivityBingoProps {
  onGameEnd: (score: number) => void;
}

export function PositivityBingo({ onGameEnd }: PositivityBingoProps) {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [board, setBoard] = useState<string[]>([]);
  const [marked, setMarked] = useState<boolean[]>(new Array(16).fill(false));
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);

  const startGame = () => {
    const shuffled = [...BINGO_ACTIVITIES].sort(() => Math.random() - 0.5).slice(0, 16);
    setBoard(shuffled);
    setMarked(new Array(16).fill(false));
    setScore(0);
    setLines(0);
    setGameState("playing");
  };

  const WINNING_LINES = [
    [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], // rows
    [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], // cols
    [0, 5, 10, 15], [3, 6, 9, 12], // diagonals
  ];

  const checkLines = (newMarked: boolean[]) => {
    let completedLines = 0;
    for (const line of WINNING_LINES) {
      if (line.every((i) => newMarked[i])) completedLines++;
    }
    return completedLines;
  };

  const toggleCell = (idx: number) => {
    if (gameState !== "playing") return;
    const newMarked = [...marked];
    newMarked[idx] = !newMarked[idx];
    setMarked(newMarked);

    const markedCount = newMarked.filter(Boolean).length;
    const completedLines = checkLines(newMarked);
    const newScore = markedCount * 5 + completedLines * 25;
    setScore(newScore);
    setLines(completedLines);

    // Game ends when all cells marked or all possible lines completed
    if (markedCount === 16) {
      setGameState("finished");
      onGameEnd(newScore);
    }
  };

  const finishEarly = () => {
    setGameState("finished");
    onGameEnd(score);
  };

  if (gameState === "idle") {
    return (
      <Card className="border-border/30 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-secondary/30 p-6 text-center">
          <Grid3X3 className="h-12 w-12 mx-auto text-primary mb-3" />
          <h3 className="font-display text-xl font-bold text-foreground">{t("games.bingoTitle")}</h3>
          <p className="text-sm text-muted-foreground mt-2">{t("games.bingoDesc")}</p>
        </div>
        <CardContent className="p-6 text-center">
          <div className="flex gap-4 justify-center mb-6 text-sm text-muted-foreground">
            <span>{t("games.bingoGrid")}</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4" /> {t("games.bingoLines")}</span>
          </div>
          <Button onClick={startGame} className="rounded-xl px-8">{t("games.startGame")}</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === "finished") {
    return (
      <Card className="border-border/30 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-secondary/30 p-6 text-center">
          <PartyPopper className="h-12 w-12 mx-auto text-primary mb-3" />
          <h3 className="font-display text-2xl font-bold text-foreground">{t("games.bingoComplete")}</h3>
          <p className="text-4xl font-bold text-primary mt-2">{score} {t("games.pts")}</p>
        </div>
        <CardContent className="p-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {lines} {t("games.bingoLinesCompleted")} • {marked.filter(Boolean).length}/16 {t("games.bingoMarked")}
          </p>
          <Button onClick={startGame} className="rounded-xl px-8">{t("games.playAgain")}</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/30 overflow-hidden">
      <div className="px-5 py-3 flex items-center justify-between bg-muted/50">
        <Badge variant="secondary">{marked.filter(Boolean).length}/16 {t("games.bingoMarked")}</Badge>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">{lines} {t("games.bingoLinesCompleted")}</span>
          <span className="font-semibold text-foreground">{score} {t("games.pts")}</span>
        </div>
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {board.map((activity, i) => (
            <button
              key={i}
              onClick={() => toggleCell(i)}
              className={`p-2 rounded-xl border-2 text-[11px] leading-tight text-center min-h-[72px] flex items-center justify-center transition-all duration-200 ${
                marked[i]
                  ? "border-primary bg-primary/15 text-primary font-medium scale-95 ring-1 ring-primary/20"
                  : "border-border/40 bg-background hover:bg-muted/50 text-muted-foreground cursor-pointer hover:scale-[1.02]"
              }`}
            >
              {activity}
            </button>
          ))}
        </div>
        <div className="text-center">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={finishEarly}>
            {t("games.bingoFinish")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
