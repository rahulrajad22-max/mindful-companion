import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Timer, Lightbulb } from "lucide-react";

const WORD_SETS = [
  { word: "GRATITUDE", hint: "Being thankful for what you have", scrambled: "" },
  { word: "MINDFUL", hint: "Being present in the moment", scrambled: "" },
  { word: "RESILIENCE", hint: "Ability to bounce back from adversity", scrambled: "" },
  { word: "COMPASSION", hint: "Deep sympathy and concern for others", scrambled: "" },
  { word: "SERENITY", hint: "State of being calm and peaceful", scrambled: "" },
  { word: "EMPATHY", hint: "Understanding others' feelings", scrambled: "" },
  { word: "WELLNESS", hint: "State of being in good health", scrambled: "" },
  { word: "COURAGE", hint: "Strength to face difficulty or fear", scrambled: "" },
  { word: "HARMONY", hint: "A state of balance and agreement", scrambled: "" },
  { word: "PATIENCE", hint: "Capacity to accept delays calmly", scrambled: "" },
];

function scramble(word: string): string {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join("");
  return result === word ? scramble(word) : result;
}

interface GratitudeWordPuzzleProps {
  onGameEnd: (score: number) => void;
}

export function GratitudeWordPuzzle({ onGameEnd }: GratitudeWordPuzzleProps) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [words, setWords] = useState<typeof WORD_SETS>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [letters, setLetters] = useState<{ char: string; used: boolean }[]>([]);
  const [guess, setGuess] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [solved, setSolved] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const startGame = () => {
    const selected = [...WORD_SETS].sort(() => Math.random() - 0.5).slice(0, 5);
    setWords(selected);
    setCurrentIdx(0);
    setScore(0);
    setTimer(0);
    setSolved(0);
    setGameState("playing");
    setupWord(selected[0].word);
  };

  const setupWord = (word: string) => {
    const scrambled = scramble(word);
    setLetters(scrambled.split("").map((c) => ({ char: c, used: false })));
    setGuess([]);
    setHintUsed(false);
    setShowResult(false);
  };

  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const addLetter = (idx: number) => {
    if (letters[idx].used || showResult) return;
    setLetters((prev) => prev.map((l, i) => i === idx ? { ...l, used: true } : l));
    const newGuess = [...guess, letters[idx].char];
    setGuess(newGuess);

    if (newGuess.length === words[currentIdx].word.length) {
      const correct = newGuess.join("") === words[currentIdx].word;
      setShowResult(true);
      if (correct) {
        const pts = hintUsed ? 10 : 20;
        setScore((s) => s + pts);
        setSolved((s) => s + 1);
      }
      setTimeout(() => {
        if (currentIdx + 1 >= words.length) {
          const finalScore = score + (correct ? (hintUsed ? 10 : 20) : 0);
          setGameState("finished");
          onGameEnd(finalScore);
        } else {
          setCurrentIdx((c) => c + 1);
          setupWord(words[currentIdx + 1].word);
        }
      }, 1500);
      const correct2 = newGuess.join("") === words[currentIdx].word;
      void correct2; // already handled
    }
  };

  const removeLast = () => {
    if (guess.length === 0 || showResult) return;
    const lastChar = guess[guess.length - 1];
    const idx = letters.findIndex((l) => l.char === lastChar && l.used);
    if (idx !== -1) {
      setLetters((prev) => prev.map((l, i) => i === idx ? { ...l, used: false } : l));
    }
    setGuess((prev) => prev.slice(0, -1));
  };

  const useHint = () => {
    if (hintUsed || showResult) return;
    setHintUsed(true);
    // Reveal first unrevealed letter
    const word = words[currentIdx].word;
    const nextIdx = guess.length;
    if (nextIdx < word.length) {
      const neededChar = word[nextIdx];
      const letterIdx = letters.findIndex((l) => l.char === neededChar && !l.used);
      if (letterIdx !== -1) addLetter(letterIdx);
    }
  };

  if (gameState === "idle") {
    return (
      <Card className="border-border/30 overflow-hidden">
        <div className="bg-gradient-to-r from-accent/20 to-secondary/30 p-6 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-accent mb-3" />
          <h3 className="font-display text-xl font-bold text-foreground">Gratitude Word Puzzle</h3>
          <p className="text-sm text-muted-foreground mt-2">Unscramble positive psychology words! Use hints wisely — they cost points.</p>
        </div>
        <CardContent className="p-6 text-center">
          <div className="flex gap-4 justify-center mb-6 text-sm text-muted-foreground">
            <span>5 words</span>
            <span className="flex items-center gap-1"><Lightbulb className="h-4 w-4" /> 1 hint per word</span>
          </div>
          <Button onClick={startGame} className="rounded-xl px-8">Start Puzzle</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === "finished") {
    return (
      <Card className="border-border/30 overflow-hidden">
        <div className="bg-gradient-to-r from-accent/20 to-secondary/30 p-6 text-center">
          <Trophy className="h-12 w-12 mx-auto text-primary mb-3" />
          <h3 className="font-display text-2xl font-bold text-foreground">Puzzle Complete!</h3>
          <p className="text-4xl font-bold text-primary mt-2">{score} pts</p>
        </div>
        <CardContent className="p-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">{solved}/5 solved • {timer}s</p>
          <Button onClick={startGame} className="rounded-xl px-8">Play Again</Button>
        </CardContent>
      </Card>
    );
  }

  const currentWord = words[currentIdx];
  const isCorrect = showResult && guess.join("") === currentWord.word;
  const isWrong = showResult && guess.join("") !== currentWord.word;

  return (
    <Card className="border-border/30 overflow-hidden">
      <div className="px-5 py-3 flex items-center justify-between bg-muted/50">
        <Badge variant="secondary">Word {currentIdx + 1}/{words.length}</Badge>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold text-foreground">{score} pts</span>
          <span className="text-muted-foreground"><Timer className="h-3 w-3 inline mr-1" />{timer}s</span>
        </div>
      </div>
      <CardContent className="p-5 space-y-4">
        <p className="text-center text-sm text-muted-foreground italic">"{currentWord.hint}"</p>

        {/* Guess slots */}
        <div className="flex justify-center gap-1.5">
          {currentWord.word.split("").map((_, i) => (
            <div
              key={i}
              className={`w-9 h-11 rounded-lg border-2 flex items-center justify-center text-lg font-bold transition-all ${
                isCorrect ? "border-mood-great bg-mood-great/10 text-mood-great" :
                isWrong ? "border-destructive bg-destructive/10 text-destructive" :
                guess[i] ? "border-primary bg-primary/10 text-foreground" :
                "border-border/40 bg-muted/30"
              }`}
            >
              {guess[i] || ""}
            </div>
          ))}
        </div>

        {/* Letter tiles */}
        <div className="flex flex-wrap justify-center gap-2">
          {letters.map((l, i) => (
            <button
              key={i}
              onClick={() => addLetter(i)}
              disabled={l.used || showResult}
              className={`w-10 h-10 rounded-xl border text-sm font-bold transition-all ${
                l.used ? "opacity-30 scale-90" : "border-border/40 bg-background hover:bg-primary/10 hover:border-primary/30 cursor-pointer"
              }`}
            >
              {l.char}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={removeLast} disabled={guess.length === 0 || showResult}>
            ← Undo
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={useHint} disabled={hintUsed || showResult}>
            <Lightbulb className="h-3 w-3 mr-1" /> Hint
          </Button>
        </div>

        {showResult && (
          <div className={`text-center text-sm p-2 rounded-xl ${isCorrect ? "bg-mood-great/10 text-mood-great" : "bg-destructive/10 text-destructive"}`}>
            {isCorrect ? "✨ Correct!" : `The word was: ${currentWord.word}`}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
