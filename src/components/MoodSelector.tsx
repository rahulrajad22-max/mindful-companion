import { useState } from "react";
import { cn } from "@/lib/utils";

type MoodLevel = "great" | "good" | "okay" | "low" | "bad";

interface MoodOption {
  level: MoodLevel;
  emoji: string;
  label: string;
}

const moods: MoodOption[] = [
  { level: "great", emoji: "😊", label: "Great" },
  { level: "good", emoji: "🙂", label: "Good" },
  { level: "okay", emoji: "😐", label: "Okay" },
  { level: "low", emoji: "😔", label: "Low" },
  { level: "bad", emoji: "😢", label: "Struggling" },
];

interface MoodSelectorProps {
  selectedMood?: MoodLevel;
  onMoodSelect: (mood: MoodLevel) => void;
}

export function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="font-display text-xl text-foreground">How are you feeling today?</h3>
      <div className="flex gap-3 flex-wrap justify-center">
        {moods.map((mood) => (
          <button
            key={mood.level}
            onClick={() => onMoodSelect(mood.level)}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300",
              "hover:scale-105 hover:shadow-elevated",
              selectedMood === mood.level
                ? "border-primary bg-primary-soft shadow-glow"
                : "border-border/50 bg-card hover:border-primary/30"
            )}
          >
            <span className="text-4xl">{mood.emoji}</span>
            <span className={cn(
              "text-sm font-medium",
              selectedMood === mood.level ? "text-primary" : "text-muted-foreground"
            )}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
