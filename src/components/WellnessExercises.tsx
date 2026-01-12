import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Wind, 
  Eye, 
  Heart, 
  Brain, 
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Check,
  Timer
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  icon: React.ElementType;
  color: string;
  bgColor: string;
  instructions: string[];
}

const exercises: Exercise[] = [
  {
    id: "box-breathing",
    name: "Box Breathing",
    description: "Calm your nervous system with 4-4-4-4 breathing",
    duration: 240,
    icon: Wind,
    color: "text-primary",
    bgColor: "bg-primary/10",
    instructions: [
      "Breathe in slowly for 4 seconds",
      "Hold your breath for 4 seconds",
      "Exhale slowly for 4 seconds",
      "Hold empty for 4 seconds",
      "Repeat the cycle",
    ],
  },
  {
    id: "5-4-3-2-1-grounding",
    name: "5-4-3-2-1 Grounding",
    description: "Ground yourself using your 5 senses",
    duration: 300,
    icon: Eye,
    color: "text-mood-great",
    bgColor: "bg-mood-great/10",
    instructions: [
      "Name 5 things you can SEE",
      "Name 4 things you can TOUCH",
      "Name 3 things you can HEAR",
      "Name 2 things you can SMELL",
      "Name 1 thing you can TASTE",
    ],
  },
  {
    id: "body-scan",
    name: "Body Scan",
    description: "Release tension by scanning your body",
    duration: 300,
    icon: Heart,
    color: "text-mood-bad",
    bgColor: "bg-mood-bad/10",
    instructions: [
      "Close your eyes and relax",
      "Focus on your feet and legs",
      "Move attention to your torso",
      "Notice your arms and hands",
      "Finally, relax your face and head",
    ],
  },
  {
    id: "mindful-meditation",
    name: "Mindful Meditation",
    description: "Focus on the present moment",
    duration: 300,
    icon: Brain,
    color: "text-mood-okay",
    bgColor: "bg-mood-okay/10",
    instructions: [
      "Sit comfortably and close your eyes",
      "Focus on your natural breathing",
      "When thoughts arise, acknowledge them",
      "Gently return focus to your breath",
      "Continue with gentle awareness",
    ],
  },
  {
    id: "gratitude-practice",
    name: "Gratitude Practice",
    description: "Cultivate positivity through gratitude",
    duration: 180,
    icon: Sparkles,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    instructions: [
      "Think of 3 things you're grateful for",
      "Visualize each one clearly",
      "Feel the gratitude in your heart",
      "Smile and appreciate the moment",
      "Carry this feeling with you",
    ],
  },
];

export function WellnessExercises() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            toast.success("Exercise completed! Great job! 🎉");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (selectedExercise && timeRemaining > 0) {
      const totalDuration = selectedExercise.duration;
      const stepDuration = totalDuration / selectedExercise.instructions.length;
      const elapsed = totalDuration - timeRemaining;
      const step = Math.min(
        Math.floor(elapsed / stepDuration),
        selectedExercise.instructions.length - 1
      );
      setCurrentStep(step);
    }
  }, [timeRemaining, selectedExercise]);

  const openExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setTimeRemaining(exercise.duration);
    setIsRunning(false);
    setCurrentStep(0);
  };

  const closeExercise = () => {
    setSelectedExercise(null);
    setIsRunning(false);
    setTimeRemaining(0);
    setCurrentStep(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    if (selectedExercise) {
      setTimeRemaining(selectedExercise.duration);
      setIsRunning(false);
      setCurrentStep(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    if (!selectedExercise) return 0;
    return ((selectedExercise.duration - timeRemaining) / selectedExercise.duration) * 100;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          Wellness Exercises
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => openExercise(exercise)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all hover:scale-[1.02] text-left group"
          >
            <div className={`p-2 rounded-lg ${exercise.bgColor}`}>
              <exercise.icon className={`h-5 w-5 ${exercise.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                {exercise.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {exercise.description}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {Math.floor(exercise.duration / 60)}min
            </span>
          </button>
        ))}
      </CardContent>

      <Dialog open={!!selectedExercise} onOpenChange={(open) => !open && closeExercise()}>
        <DialogContent className="sm:max-w-[400px]">
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${selectedExercise.bgColor}`}>
                    <selectedExercise.icon className={`h-5 w-5 ${selectedExercise.color}`} />
                  </div>
                  {selectedExercise.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Timer Display */}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-muted flex items-center justify-center">
                      <span className="text-4xl font-display font-bold text-foreground">
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  </div>
                  <Progress value={getProgress()} className="mt-4 h-2" />
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Instructions:</p>
                  <div className="space-y-2">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-2 p-2 rounded-lg transition-all ${
                          index === currentStep && isRunning
                            ? "bg-primary/10 scale-[1.02]"
                            : index < currentStep || timeRemaining === 0
                            ? "opacity-50"
                            : ""
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                            index < currentStep || timeRemaining === 0
                              ? "bg-mood-great text-white"
                              : index === currentStep && isRunning
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index < currentStep || timeRemaining === 0 ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className="text-sm text-foreground flex-1">
                          {instruction}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={resetTimer}
                    className="h-12 w-12 rounded-full"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={toggleTimer}
                    size="lg"
                    className="h-14 w-14 rounded-full"
                    disabled={timeRemaining === 0}
                  >
                    {isRunning ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-0.5" />
                    )}
                  </Button>
                </div>

                {timeRemaining === 0 && (
                  <div className="text-center animate-scale-in">
                    <p className="text-mood-great font-medium">
                      🎉 Exercise Complete! Great job taking care of yourself.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
