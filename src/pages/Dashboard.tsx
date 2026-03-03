import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { MoodSelector } from "@/components/MoodSelector";
import { JournalEntry } from "@/components/JournalEntry";
import { InsightCard } from "@/components/InsightCard";
import { WellnessTracker } from "@/components/WellnessTracker";
import { WeeklyWellnessSummary } from "@/components/WeeklyWellnessSummary";
import { WellnessExercises } from "@/components/WellnessExercises";
import { QuickResources } from "@/components/QuickResources";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Loader2 } from "lucide-react";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type MoodLevel = "great" | "good" | "okay" | "low" | "bad";

export default function Dashboard() {
  const { t } = useTranslation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { 
    loading: moodLoading, 
    todaysMood, 
    weeklyData: weeklyMoodData, 
    saveMood 
  } = useMoodEntries();
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMoodSelect = async (mood: MoodLevel) => {
    try {
      await saveMood(mood);
      toast({ title: t("dashboard.moodLogged"), description: t("dashboard.moodLoggedDesc") });
    } catch (error) {
      toast({ title: t("common.error"), description: t("dashboard.moodLoggedError"), variant: "destructive" });
    }
  };

  const handleJournalSave = (entry: string) => {
    setIsAnalyzing(true);
    toast({ title: t("dashboard.journalSaved"), description: t("dashboard.journalSavedDesc") });
    setTimeout(() => setIsAnalyzing(false), 1000);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ParallaxBackground variant="page" />
      <main className="container py-8">
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{today}</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {t("dashboard.welcome")}
          </h1>
          <p className="text-muted-foreground mt-2">{t("dashboard.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="gradient-card border-border/30 animate-fade-up" style={{ animationDelay: "100ms" }}>
              <CardContent className="p-6">
                {moodLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <MoodSelector selectedMood={todaysMood} onMoodSelect={handleMoodSelect} />
                    {todaysMood && (
                      <div className="mt-4 p-4 rounded-xl bg-primary-soft text-center animate-scale-in">
                        <p className="text-sm text-primary">{t("dashboard.thanksSharing")}</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
            <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <JournalEntry onSave={handleJournalSave} isAnalyzing={isAnalyzing} />
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
              <WellnessExercises />
            </div>
          </div>

          <div className="space-y-6">
            <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
              <WellnessTracker />
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <WeeklyWellnessSummary />
            </div>
            <div className="space-y-4 animate-fade-up" style={{ animationDelay: "250ms" }}>
              <h3 className="font-display text-lg font-semibold text-foreground">{t("dashboard.aiInsights")}</h3>
              {weeklyMoodData.length > 0 ? (
                <>
                  <InsightCard type="sentiment" title={t("dashboard.moodTrackingActive")} description={t("dashboard.moodTrackingDesc", { count: weeklyMoodData.length })} level="positive" />
                  <InsightCard type="suggestion" title={t("dashboard.selfCareTip")} description={t("dashboard.selfCareTipDesc")} level="neutral" />
                </>
              ) : (
                <>
                  <InsightCard type="suggestion" title={t("dashboard.startTracking")} description={t("dashboard.startTrackingDesc")} level="neutral" />
                  <InsightCard type="pattern" title={t("dashboard.buildHabit")} description={t("dashboard.buildHabitDesc")} level="neutral" />
                </>
              )}
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "350ms" }}>
              <QuickResources />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
