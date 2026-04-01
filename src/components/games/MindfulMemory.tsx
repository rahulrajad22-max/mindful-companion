import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RotateCcw, Trophy, Timer } from "lucide-react";

const CARD_PAIRS = [
  { id: "calm", emoji: "🧘", label: "Calm" },
  { id: "joy", emoji: "😊", label: "Joy" },
  { id: "love", emoji: "💚", label: "Love" },
  { id: "peace", emoji: "☮️", label: "Peace" },
  { id: "strength", emoji: "💪", label: "Strength" },
  { id: "hope", emoji: "🌟", label: "Hope" },
  { id: "growth", emoji: "🌱", label: "Growth" },
  { id: "rest", emoji: "😴", label: "Rest" },
];

interface MemoryCard {
  id: string;
  emoji: string;
  label: string;
  uniqueId: number;
  flipped: boolean;
  matched: boolean;
}

interface MindfulMemoryProps {
  onGameEnd: (score: number) => void;
}

export function MindfulMemory({ onGameEnd }: MindfulMemoryProps) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);

  const startGame = () => {
    const selected = [...CARD_PAIRS].sort(() => Math.random() - 0.5).slice(0, 6);
    const doubled = selected.flatMap((c, i) => [
      { ...c, uniqueId: i * 2, flipped: false, matched: false },
      { ...c, uniqueId: i * 2 + 1, flipped: false, matched: false },
    ]).sort(() => Math.random() - 0.5);
    setCards(doubled);
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setScore(0);
    setGameState("playing");
  };

  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (flippedIds.length !== 2) return;
    const [a, b] = flippedIds;
    const cardA = cards.find((c) => c.uniqueId === a)!;
    const cardB = cards.find((c) => c.uniqueId === b)!;

    if (cardA.id === cardB.id) {
      setTimeout(() => {
        setCards((prev) => prev.map((c) => c.id === cardA.id ? { ...c, matched: true } : c));
        setMatches((m) => {
          const newMatches = m + 1;
          if (newMatches === 6) {
            const finalScore = Math.max(10, 200 - moves * 5 - timer * 2);
            setScore(finalScore);
            setGameState("finished");
            onGameEnd(finalScore);
          }
          return newMatches;
        });
        setFlippedIds([]);
      }, 500);
    } else {
      setTimeout(() => {
        setFlippedIds([]);
      }, 800);
    }
  }, [flippedIds]);

  const handleCardClick = (uniqueId: number) => {
    if (flippedIds.length >= 2) return;
    const card = cards.find((c) => c.uniqueId === uniqueId)!;
    if (card.matched || flippedIds.includes(uniqueId)) return;
    setFlippedIds((prev) => [...prev, uniqueId]);
    setMoves((m) => m + 1);
  };

  if (gameState === "idle") {
    return (
      <Card className="border-border/30 overflow-hidden">
        <div className="bg-gradient-to-r from-secondary/50 to-primary/20 p-6 text-center">
          <Sparkles className="h-12 w-12 mx-auto text-secondary-foreground mb-3" />
          <h3 className="font-display text-xl font-bold text-foreground">Mindful Memory</h3>
          <p className="text-sm text-muted-foreground mt-2">Match pairs of positive emotions. Fewer moves = higher score!</p>
        </div>
        <CardContent className="p-6 text-center">
          <div className="flex gap-4 justify-center mb-6 text-sm text-muted-foreground">
            <span>12 cards • 6 pairs</span>
            <span className="flex items-center gap-1"><Timer className="h-4 w-4" /> Timed</span>
          </div>
          <Button onClick={startGame} className="rounded-xl px-8">Start Game</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === "finished") {
    return (
      <Card className="border-border/30 overflow-hidden">
        <div className="bg-gradient-to-r from-secondary/50 to-primary/20 p-6 text-center">
          <Trophy className="h-12 w-12 mx-auto text-primary mb-3" />
          <h3 className="font-display text-2xl font-bold text-foreground">All Matched!</h3>
          <p className="text-4xl font-bold text-primary mt-2">{score} pts</p>
        </div>
        <CardContent className="p-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">{moves} moves • {timer}s</p>
          <Button onClick={startGame} className="rounded-xl px-8">Play Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/30 overflow-hidden">
      <div className="px-5 py-3 flex items-center justify-between bg-muted/50">
        <Badge variant="secondary">{matches}/6 matched</Badge>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground"><RotateCcw className="h-3 w-3 inline mr-1" />{moves} moves</span>
          <span className="text-muted-foreground"><Timer className="h-3 w-3 inline mr-1" />{timer}s</span>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => {
            const isFlipped = flippedIds.includes(card.uniqueId) || card.matched;
            return (
              <button
                key={card.uniqueId}
                onClick={() => handleCardClick(card.uniqueId)}
                className={`aspect-square rounded-xl border-2 text-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                  card.matched
                    ? "border-mood-great/40 bg-mood-great/10 scale-95"
                    : isFlipped
                    ? "border-primary/40 bg-primary/10 rotate-0"
                    : "border-border/40 bg-muted/30 hover:bg-muted/60 cursor-pointer hover:scale-105"
                }`}
              >
                {isFlipped ? (
                  <>
                    <span className="text-2xl">{card.emoji}</span>
                    <span className="text-[10px] font-medium text-muted-foreground">{card.label}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground/40 text-xl">?</span>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
