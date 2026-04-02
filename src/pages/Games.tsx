import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { MoodTrivia } from "@/components/games/MoodTrivia";
import { MindfulMemory } from "@/components/games/MindfulMemory";
import { GratitudeWordPuzzle } from "@/components/games/GratitudeWordPuzzle";
import { PositivityBingo } from "@/components/games/PositivityBingo";
import { DailyChallenge } from "@/components/games/DailyChallenge";
import { Leaderboard } from "@/components/games/Leaderboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Sparkles, BookOpen, Grid3X3, Sunrise, Gamepad2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}

export default function Games() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("trivia");

  const saveScore = async (gameType: string, score: number) => {
    if (!user) return;
    
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .single();

    const { error } = await supabase.from("game_scores").insert({
      user_id: user.id,
      game_type: gameType,
      score,
      week_start: getWeekStart(),
      display_name: profile?.display_name || user.email?.split("@")[0] || "Player",
    });

    if (error) {
      toast.error(t("games.scoreError"));
    } else {
      toast.success(t("games.scoreSaved", { score }));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navbar />
      <ParallaxBackground variant="page" />
      <main className="container py-8">
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-2 mb-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">{t("games.badge")}</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {t("games.pageTitle")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("games.pageSubtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-5 mb-6">
                <TabsTrigger value="trivia" className="gap-1 text-xs sm:text-sm">
                  <Brain className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{t("games.trivia")}</span>
                </TabsTrigger>
                <TabsTrigger value="memory" className="gap-1 text-xs sm:text-sm">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{t("games.memory")}</span>
                </TabsTrigger>
                <TabsTrigger value="puzzle" className="gap-1 text-xs sm:text-sm">
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{t("games.wordPuzzle")}</span>
                </TabsTrigger>
                <TabsTrigger value="bingo" className="gap-1 text-xs sm:text-sm">
                  <Grid3X3 className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{t("games.bingo")}</span>
                </TabsTrigger>
                <TabsTrigger value="challenge" className="gap-1 text-xs sm:text-sm">
                  <Sunrise className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{t("games.challenge")}</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="trivia">
                <MoodTrivia onGameEnd={(s) => saveScore("trivia", s)} />
              </TabsContent>
              <TabsContent value="memory">
                <MindfulMemory onGameEnd={(s) => saveScore("memory", s)} />
              </TabsContent>
              <TabsContent value="puzzle">
                <GratitudeWordPuzzle onGameEnd={(s) => saveScore("puzzle", s)} />
              </TabsContent>
              <TabsContent value="bingo">
                <PositivityBingo onGameEnd={(s) => saveScore("bingo", s)} />
              </TabsContent>
              <TabsContent value="challenge">
                <DailyChallenge onGameEnd={(s) => saveScore("challenge", s)} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Leaderboard />
          </div>
        </div>
      </main>
    </div>
  );
}
