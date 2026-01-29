// @refresh reset
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Timer,
  Flame,
  Trophy,
  History,
  Star,
  Plus,
  Minus,
  PlusCircle,
  Trash2,
  Edit3,
  Leaf,
  Sun,
  Moon,
  Zap,
  Music,
  Smile
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { VoiceAssistantControls } from "@/components/VoiceAssistantControls";

interface Exercise {
  id: string;
  name: string;
  description: string;
  suggestedDuration: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  instructions: string[];
  isCustom?: boolean;
}

interface CustomExerciseData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  steps: string[];
  default_duration: number;
}

interface ExerciseCompletion {
  id: string;
  exercise_id: string;
  exercise_name: string;
  completed_at: string;
}

interface Stats {
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  todayCount: number;
  weekCount: number;
}

const ICON_OPTIONS = [
  { name: "Sparkles", icon: Sparkles },
  { name: "Heart", icon: Heart },
  { name: "Brain", icon: Brain },
  { name: "Wind", icon: Wind },
  { name: "Eye", icon: Eye },
  { name: "Leaf", icon: Leaf },
  { name: "Sun", icon: Sun },
  { name: "Moon", icon: Moon },
  { name: "Zap", icon: Zap },
  { name: "Music", icon: Music },
  { name: "Smile", icon: Smile },
  { name: "Star", icon: Star },
];

const COLOR_OPTIONS = [
  { name: "Purple", value: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Blue", value: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Green", value: "text-green-500", bg: "bg-green-500/10" },
  { name: "Orange", value: "text-orange-500", bg: "bg-orange-500/10" },
  { name: "Pink", value: "text-pink-500", bg: "bg-pink-500/10" },
  { name: "Teal", value: "text-teal-500", bg: "bg-teal-500/10" },
  { name: "Red", value: "text-red-500", bg: "bg-red-500/10" },
  { name: "Yellow", value: "text-yellow-500", bg: "bg-yellow-500/10" },
];

const getIconByName = (name: string) => {
  return ICON_OPTIONS.find(i => i.name === name)?.icon || Sparkles;
};

const getColorByValue = (value: string) => {
  return COLOR_OPTIONS.find(c => c.value === value) || COLOR_OPTIONS[0];
};

const defaultExercises: Exercise[] = [
  {
    id: "box-breathing",
    name: "Box Breathing",
    description: "Calm your nervous system with 4-4-4-4 breathing",
    suggestedDuration: 240,
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
    suggestedDuration: 300,
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
    suggestedDuration: 300,
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
    suggestedDuration: 300,
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
    suggestedDuration: 180,
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

const achievements = [
  { id: "first-step", name: "First Step", description: "Complete your first exercise", requirement: 1, icon: Star },
  { id: "week-warrior", name: "Week Warrior", description: "Complete 7 exercises", requirement: 7, icon: Trophy },
  { id: "zen-master", name: "Zen Master", description: "Complete 30 exercises", requirement: 30, icon: Brain },
  { id: "streak-starter", name: "Streak Starter", description: "3-day streak", streakRequirement: 3, icon: Flame },
  { id: "streak-champion", name: "Streak Champion", description: "7-day streak", streakRequirement: 7, icon: Flame },
];

const DURATION_PRESETS = [
  { label: "1 min", seconds: 60 },
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
];

export function WellnessExercises() {
  const { user } = useAuth();
  const voiceAssistant = useVoiceAssistant();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [customDuration, setCustomDuration] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [showTimerSetup, setShowTimerSetup] = useState(true);
  const [completions, setCompletions] = useState<ExerciseCompletion[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCompletions: 0,
    currentStreak: 0,
    longestStreak: 0,
    todayCount: 0,
    weekCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Custom exercise state
  const [customExercises, setCustomExercises] = useState<CustomExerciseData[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingExercise, setEditingExercise] = useState<CustomExerciseData | null>(null);
  const [newExercise, setNewExercise] = useState({
    name: "",
    description: "",
    icon: "Sparkles",
    color: "text-purple-500",
    steps: [""],
    default_duration: 180,
  });
  const [savingExercise, setSavingExercise] = useState(false);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchCustomExercises();
    }
  }, [user]);

  const fetchCustomExercises = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("custom_exercises" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomExercises((data || []) as unknown as CustomExerciseData[]);
    } catch (error) {
      console.error("Error fetching custom exercises:", error);
    }
  };

  const fetchStats = async () => {
    if (!user) return;
    setLoadingStats(true);

    try {
      const { data, error } = await supabase
        .from("exercise_completions")
        .select("id, exercise_id, exercise_name, completed_at")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (error) throw error;

      setCompletions(data || []);

      const today = new Date().toISOString().split("T")[0];
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const todayCount = data?.filter(
        (c) => c.completed_at.split("T")[0] === today
      ).length || 0;

      const weekCount = data?.filter(
        (c) => new Date(c.completed_at) >= oneWeekAgo
      ).length || 0;

      const { currentStreak, longestStreak } = calculateStreak(data || []);

      setStats({
        totalCompletions: data?.length || 0,
        currentStreak,
        longestStreak,
        todayCount,
        weekCount,
      });
    } catch (error) {
      console.error("Error fetching exercise stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const calculateStreak = (completions: ExerciseCompletion[]) => {
    if (completions.length === 0) return { currentStreak: 0, longestStreak: 0 };

    const uniqueDates = [...new Set(
      completions.map((c) => c.completed_at.split("T")[0])
    )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (uniqueDates[0] === today || uniqueDates[0] === yesterdayStr) {
      currentStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currDate = new Date(uniqueDates[i]);
        const diffDays = Math.floor(
          (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.floor(
        (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    return { currentStreak, longestStreak };
  };

  const saveCompletion = async (exercise: Exercise, duration: number) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("exercise_completions").insert({
        user_id: user.id,
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        duration_seconds: duration,
      });

      if (error) throw error;

      await fetchStats();
    } catch (error) {
      console.error("Error saving exercise completion:", error);
    }
  };

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (selectedExercise) {
              saveCompletion(selectedExercise, customDuration);
            }
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
  }, [isRunning, selectedExercise, customDuration]);

  // Track current step changes
  const prevStepRef = useRef<number>(-1);
  
  useEffect(() => {
    if (selectedExercise && customDuration > 0 && timeRemaining > 0) {
      const stepDuration = customDuration / selectedExercise.instructions.length;
      const elapsed = customDuration - timeRemaining;
      const step = Math.min(
        Math.floor(elapsed / stepDuration),
        selectedExercise.instructions.length - 1
      );
      setCurrentStep(step);
    }
  }, [timeRemaining, selectedExercise, customDuration]);

  // Voice announcement effect - speaks when step changes
  useEffect(() => {
    if (
      isRunning && 
      selectedExercise && 
      voiceAssistant.isEnabled &&
      currentStep !== prevStepRef.current
    ) {
      const instruction = selectedExercise.instructions[currentStep];
      if (instruction) {
        voiceAssistant.speak(instruction);
      }
      prevStepRef.current = currentStep;
    }
    
    // Announce completion
    if (timeRemaining === 0 && prevStepRef.current !== -2) {
      if (voiceAssistant.isEnabled) {
        voiceAssistant.speak("Exercise complete! Great job taking care of yourself.");
      }
      prevStepRef.current = -2; // Mark as announced
    }
  }, [currentStep, isRunning, selectedExercise, timeRemaining, voiceAssistant]);

  // Reset step tracking when exercise changes
  useEffect(() => {
    prevStepRef.current = -1;
  }, [selectedExercise]);

  const openExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCustomDuration(exercise.suggestedDuration);
    setTimeRemaining(exercise.suggestedDuration);
    setIsRunning(false);
    setCurrentStep(0);
    setShowTimerSetup(true);
  };

  const closeExercise = () => {
    setSelectedExercise(null);
    setIsRunning(false);
    setTimeRemaining(0);
    setCustomDuration(0);
    setCurrentStep(0);
    setShowTimerSetup(true);
    voiceAssistant.stop(); // Stop voice when closing
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const startExercise = () => {
    if (customDuration < 30) {
      toast.error("Minimum duration is 30 seconds");
      return;
    }
    setTimeRemaining(customDuration);
    setShowTimerSetup(false);
    setIsRunning(true);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeRemaining(customDuration);
    setIsRunning(false);
    setCurrentStep(0);
  };

  const adjustDuration = (delta: number) => {
    setCustomDuration((prev) => Math.max(30, Math.min(3600, prev + delta)));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    if (!customDuration) return 0;
    return ((customDuration - timeRemaining) / customDuration) * 100;
  };

  const getUnlockedAchievements = () => {
    return achievements.filter((a) => {
      if (a.requirement) return stats.totalCompletions >= a.requirement;
      if (a.streakRequirement) return stats.longestStreak >= a.streakRequirement;
      return false;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Custom exercise handlers
  const openCreateDialog = () => {
    setEditingExercise(null);
    setNewExercise({
      name: "",
      description: "",
      icon: "Sparkles",
      color: "text-purple-500",
      steps: [""],
      default_duration: 180,
    });
    setShowCreateDialog(true);
  };

  const openEditDialog = (exercise: CustomExerciseData) => {
    setEditingExercise(exercise);
    setNewExercise({
      name: exercise.name,
      description: exercise.description,
      icon: exercise.icon,
      color: exercise.color,
      steps: exercise.steps.length > 0 ? exercise.steps : [""],
      default_duration: exercise.default_duration,
    });
    setShowCreateDialog(true);
  };

  const closeCreateDialog = () => {
    setShowCreateDialog(false);
    setEditingExercise(null);
    setNewExercise({
      name: "",
      description: "",
      icon: "Sparkles",
      color: "text-purple-500",
      steps: [""],
      default_duration: 180,
    });
  };

  const addStep = () => {
    setNewExercise(prev => ({
      ...prev,
      steps: [...prev.steps, ""]
    }));
  };

  const removeStep = (index: number) => {
    if (newExercise.steps.length > 1) {
      setNewExercise(prev => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index)
      }));
    }
  };

  const updateStep = (index: number, value: string) => {
    setNewExercise(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  const saveCustomExercise = async () => {
    if (!user) return;

    const trimmedName = newExercise.name.trim();
    const trimmedDescription = newExercise.description.trim();
    const filteredSteps = newExercise.steps.filter(s => s.trim() !== "");

    if (!trimmedName) {
      toast.error("Please enter an exercise name");
      return;
    }
    if (!trimmedDescription) {
      toast.error("Please enter a description");
      return;
    }
    if (filteredSteps.length === 0) {
      toast.error("Please add at least one instruction step");
      return;
    }

    setSavingExercise(true);

    try {
      if (editingExercise) {
        const { error } = await supabase
          .from("custom_exercises" as any)
          .update({
            name: trimmedName,
            description: trimmedDescription,
            icon: newExercise.icon,
            color: newExercise.color,
            steps: filteredSteps,
            default_duration: newExercise.default_duration,
          })
          .eq("id", editingExercise.id);

        if (error) throw error;
        toast.success("Exercise updated!");
      } else {
        const { error } = await supabase
          .from("custom_exercises" as any)
          .insert({
            user_id: user.id,
            name: trimmedName,
            description: trimmedDescription,
            icon: newExercise.icon,
            color: newExercise.color,
            steps: filteredSteps,
            default_duration: newExercise.default_duration,
          });

        if (error) throw error;
        toast.success("Custom exercise created!");
      }

      await fetchCustomExercises();
      closeCreateDialog();
    } catch (error) {
      console.error("Error saving custom exercise:", error);
      toast.error("Failed to save exercise");
    } finally {
      setSavingExercise(false);
    }
  };

  const deleteCustomExercise = async (exerciseId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("custom_exercises" as any)
        .delete()
        .eq("id", exerciseId);

      if (error) throw error;
      toast.success("Exercise deleted");
      await fetchCustomExercises();
    } catch (error) {
      console.error("Error deleting custom exercise:", error);
      toast.error("Failed to delete exercise");
    }
  };

  // Convert custom exercises to Exercise format
  const allExercises: Exercise[] = [
    ...defaultExercises,
    ...customExercises.map((ce): Exercise => ({
      id: ce.id,
      name: ce.name,
      description: ce.description,
      suggestedDuration: ce.default_duration,
      icon: getIconByName(ce.icon),
      color: ce.color,
      bgColor: getColorByValue(ce.color).bg,
      instructions: ce.steps,
      isCustom: true,
    })),
  ];

  const unlockedAchievements = getUnlockedAchievements();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            Wellness Exercises
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={openCreateDialog}
              className="text-xs"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Create
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(true)}
              className="text-xs"
            >
              <History className="h-4 w-4 mr-1" />
              History
            </Button>
          </div>
        </div>
        
        {!loadingStats && user && (
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-xs">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-medium">{stats.currentStreak}</span>
              <span className="text-muted-foreground">day streak</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{stats.totalCompletions}</span>
              <span className="text-muted-foreground">total</span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {allExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="relative group"
          >
            <button
              onClick={() => openExercise(exercise)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all hover:scale-[1.02] text-left"
            >
              <div className={`p-2 rounded-lg ${exercise.bgColor}`}>
                <exercise.icon className={`h-5 w-5 ${exercise.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {exercise.name}
                  </p>
                  {exercise.isCustom && (
                    <Badge variant="outline" className="text-[10px] px-1 py-0">
                      Custom
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {exercise.description}
                </p>
              </div>
            </button>
            {exercise.isCustom && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    const customEx = customExercises.find(c => c.id === exercise.id);
                    if (customEx) openEditDialog(customEx);
                  }}
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCustomExercise(exercise.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ))}

        {unlockedAchievements.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Achievements</p>
            <div className="flex flex-wrap gap-1">
              {unlockedAchievements.map((achievement) => (
                <Badge
                  key={achievement.id}
                  variant="secondary"
                  className="text-xs"
                >
                  <achievement.icon className="h-3 w-3 mr-1" />
                  {achievement.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Create/Edit Custom Exercise Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => !open && closeCreateDialog()}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              {editingExercise ? "Edit Exercise" : "Create Custom Exercise"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Exercise Name</Label>
              <Input
                id="name"
                placeholder="My Custom Exercise"
                value={newExercise.name}
                onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="A brief description of your exercise..."
                value={newExercise.description}
                onChange={(e) => setNewExercise(prev => ({ ...prev, description: e.target.value }))}
                maxLength={100}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => setNewExercise(prev => ({ ...prev, icon: option.name }))}
                    className={`p-2 rounded-lg transition-all ${
                      newExercise.icon === option.name
                        ? "bg-primary text-primary-foreground scale-110"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <option.icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setNewExercise(prev => ({ ...prev, color: option.value }))}
                    className={`w-8 h-8 rounded-full transition-all ${option.bg} ${
                      newExercise.color === option.value
                        ? "ring-2 ring-primary ring-offset-2 scale-110"
                        : ""
                    }`}
                  >
                    <span className={`block w-full h-full rounded-full ${option.value.replace('text-', 'bg-').replace('-500', '-500')}`} 
                      style={{ backgroundColor: option.value.includes('purple') ? '#a855f7' : 
                        option.value.includes('blue') ? '#3b82f6' :
                        option.value.includes('green') ? '#22c55e' :
                        option.value.includes('orange') ? '#f97316' :
                        option.value.includes('pink') ? '#ec4899' :
                        option.value.includes('teal') ? '#14b8a6' :
                        option.value.includes('red') ? '#ef4444' :
                        option.value.includes('yellow') ? '#eab308' : '#a855f7'
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Default Duration</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => setNewExercise(prev => ({ 
                    ...prev, 
                    default_duration: Math.max(30, prev.default_duration - 30) 
                  }))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-medium w-20 text-center">
                  {formatTime(newExercise.default_duration)}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => setNewExercise(prev => ({ 
                    ...prev, 
                    default_duration: Math.min(3600, prev.default_duration + 30) 
                  }))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                {DURATION_PRESETS.map((preset) => (
                  <Button
                    key={preset.seconds}
                    variant={newExercise.default_duration === preset.seconds ? "default" : "outline"}
                    size="sm"
                    type="button"
                    onClick={() => setNewExercise(prev => ({ ...prev, default_duration: preset.seconds }))}
                    className="text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Instruction Steps</Label>
              <div className="space-y-2">
                {newExercise.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-6 h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
                      {index + 1}.
                    </div>
                    <Input
                      placeholder={`Step ${index + 1}...`}
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      maxLength={100}
                    />
                    {newExercise.steps.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => removeStep(index)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {newExercise.steps.length < 10 && (
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={addStep}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Step
                </Button>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={closeCreateDialog}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={saveCustomExercise}
                disabled={savingExercise}
                className="flex-1"
              >
                {savingExercise ? "Saving..." : (editingExercise ? "Update" : "Create")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exercise Dialog */}
      <Dialog open={!!selectedExercise} onOpenChange={(open) => !open && closeExercise()}>
        <DialogContent className="sm:max-w-[400px]">
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedExercise.bgColor}`}>
                      <selectedExercise.icon className={`h-5 w-5 ${selectedExercise.color}`} />
                    </div>
                    {selectedExercise.name}
                  </div>
                </DialogTitle>
                {/* Voice Assistant Controls */}
                <div className="flex items-center justify-end pt-2">
                  <VoiceAssistantControls
                    isEnabled={voiceAssistant.isEnabled}
                    isSpeaking={voiceAssistant.isSpeaking}
                    isLoading={voiceAssistant.isLoading}
                    selectedLanguage={voiceAssistant.selectedLanguage}
                    onToggle={voiceAssistant.toggleVoiceAssistant}
                    onLanguageChange={voiceAssistant.setSelectedLanguage}
                    onTestVoice={voiceAssistant.testVoice}
                  />
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {showTimerSetup ? (
                  <>
                    {/* Duration Setup */}
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-center text-foreground">
                        Set your timer duration
                      </p>
                      
                      {/* Custom Duration Input */}
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => adjustDuration(-30)}
                          className="h-10 w-10 rounded-full"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="text-center">
                          <span className="text-4xl font-display font-bold text-foreground">
                            {formatTime(customDuration)}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => adjustDuration(30)}
                          className="h-10 w-10 rounded-full"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap justify-center gap-2">
                        {DURATION_PRESETS.map((preset) => (
                          <Button
                            key={preset.seconds}
                            variant={customDuration === preset.seconds ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCustomDuration(preset.seconds)}
                            className="text-xs"
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>

                      {/* Instructions Preview */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Instructions:</p>
                        <div className="space-y-1">
                          {selectedExercise.instructions.map((instruction, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 p-2 rounded-lg bg-muted/50"
                            >
                              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium bg-muted text-muted-foreground">
                                {index + 1}
                              </div>
                              <span className="text-sm text-foreground flex-1">
                                {instruction}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button onClick={startExercise} className="w-full" size="lg">
                        <Play className="h-5 w-5 mr-2" />
                        Start Exercise
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Exercise History
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <Flame className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                <p className="text-2xl font-bold">{stats.currentStreak}</p>
                <p className="text-xs text-muted-foreground">Current Streak</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <Trophy className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                <p className="text-2xl font-bold">{stats.longestStreak}</p>
                <p className="text-xs text-muted-foreground">Best Streak</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <Star className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold">{stats.weekCount}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Achievements</p>
              <div className="space-y-2">
                {achievements.map((achievement) => {
                  const isUnlocked = achievement.requirement
                    ? stats.totalCompletions >= achievement.requirement
                    : stats.longestStreak >= (achievement.streakRequirement || 0);
                  const progress = achievement.requirement
                    ? Math.min(stats.totalCompletions / achievement.requirement, 1) * 100
                    : Math.min(stats.longestStreak / (achievement.streakRequirement || 1), 1) * 100;

                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        isUnlocked ? "bg-primary/10" : "bg-muted/50"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isUnlocked ? "bg-primary/20" : "bg-muted"
                        }`}
                      >
                        <achievement.icon
                          className={`h-4 w-4 ${
                            isUnlocked ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${!isUnlocked && "text-muted-foreground"}`}>
                          {achievement.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {achievement.description}
                        </p>
                        {!isUnlocked && (
                          <Progress value={progress} className="h-1 mt-1" />
                        )}
                      </div>
                      {isUnlocked && (
                        <Check className="h-4 w-4 text-mood-great" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Recent Activity</p>
              {completions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No exercises completed yet. Start your wellness journey!
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {completions.slice(0, 10).map((completion) => (
                    <div
                      key={completion.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <span className="text-sm font-medium">
                        {completion.exercise_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(completion.completed_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
