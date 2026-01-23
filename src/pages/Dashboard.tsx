import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { MoodSelector } from "@/components/MoodSelector";
import { MoodChart } from "@/components/MoodChart";
import { MoodCalendar } from "@/components/MoodCalendar";
import { SentimentTrendsChart } from "@/components/SentimentTrendsChart";
import { JournalEntry } from "@/components/JournalEntry";
import { InsightCard } from "@/components/InsightCard";
import { WellnessTracker } from "@/components/WellnessTracker";
import { WeeklyWellnessSummary } from "@/components/WeeklyWellnessSummary";
import { WellnessExercises } from "@/components/WellnessExercises";
import { QuickResources } from "@/components/QuickResources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Loader2 } from "lucide-react";
import { TimeRange } from "@/components/TimeRangeToggle";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type MoodLevel = "great" | "good" | "okay" | "low" | "bad";

export default function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [moodTimeRange, setMoodTimeRange] = useState<TimeRange>("weekly");
  const [sentimentTimeRange, setSentimentTimeRange] = useState<TimeRange>("weekly");
  
  const { 
    loading: moodLoading, 
    todaysMood, 
    weeklyData: weeklyMoodData, 
    monthlyData: monthlyMoodData, 
    saveMood 
  } = useMoodEntries();
  
  const { 
    weeklySentimentData, 
    monthlySentimentData 
  } = useJournalEntries();
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const moodData = useMemo(() => 
    moodTimeRange === "weekly" ? weeklyMoodData : monthlyMoodData, 
    [moodTimeRange, weeklyMoodData, monthlyMoodData]
  );

  const sentimentData = useMemo(() => 
    sentimentTimeRange === "weekly" ? weeklySentimentData : monthlySentimentData, 
    [sentimentTimeRange, weeklySentimentData, monthlySentimentData]
  );

  const handleMoodSelect = async (mood: MoodLevel) => {
    try {
      await saveMood(mood);
      toast({
        title: "Mood logged",
        description: "Your mood has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save mood. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleJournalSave = (entry: string) => {
    setIsAnalyzing(true);
    // Navigate to journal page for full experience
    navigate("/journal");
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{today}</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Welcome back 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            How are you feeling today? Let's check in together.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Selector Card */}
            <Card className="gradient-card border-border/30 animate-fade-up" style={{ animationDelay: "100ms" }}>
              <CardContent className="p-6">
                {moodLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <MoodSelector 
                      selectedMood={todaysMood}
                      onMoodSelect={handleMoodSelect}
                    />
                    {todaysMood && (
                      <div className="mt-4 p-4 rounded-xl bg-primary-soft text-center animate-scale-in">
                        <p className="text-sm text-primary">
                          Thanks for sharing! Your mood has been logged.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Journal Entry */}
            <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <JournalEntry onSave={handleJournalSave} isAnalyzing={isAnalyzing} />
            </div>

            {/* Sentiment Trends Chart */}
            <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
              <SentimentTrendsChart 
                data={sentimentData} 
                timeRange={sentimentTimeRange}
                onTimeRangeChange={setSentimentTimeRange}
              />
            </div>

            {/* Mood Calendar */}
            <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
              <MoodCalendar />
            </div>

            {/* Mood Chart */}
            <div className="animate-fade-up" style={{ animationDelay: "500ms" }}>
              <MoodChart 
                data={moodData} 
                timeRange={moodTimeRange}
                onTimeRangeChange={setMoodTimeRange}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
              <WellnessTracker />
            </div>

            {/* Weekly Summary */}
            <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <WeeklyWellnessSummary />
            </div>

            {/* AI Insights */}
            <div className="space-y-4 animate-fade-up" style={{ animationDelay: "250ms" }}>
              <h3 className="font-display text-lg font-semibold text-foreground">AI Insights</h3>
              
              {moodData.length > 0 ? (
                <>
                  <InsightCard
                    type="sentiment"
                    title="Mood Tracking Active"
                    description={`You've logged ${moodData.length} mood entries recently. Keep tracking to see patterns!`}
                    level="positive"
                  />
                  
                  <InsightCard
                    type="suggestion"
                    title="Self-Care Tip"
                    description="Try a 5-minute breathing exercise today. It can help maintain your positive momentum."
                    level="neutral"
                  />
                </>
              ) : (
                <>
                  <InsightCard
                    type="suggestion"
                    title="Start Tracking"
                    description="Log your first mood to start seeing personalized insights and patterns."
                    level="neutral"
                  />
                  
                  <InsightCard
                    type="pattern"
                    title="Build Your Habit"
                    description="Regular mood tracking helps identify patterns in your emotional well-being."
                    level="neutral"
                  />
                </>
              )}
            </div>

            {/* Wellness Exercises */}
            <div className="animate-fade-up" style={{ animationDelay: "350ms" }}>
              <WellnessExercises />
            </div>

            {/* Resources */}
            <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
              <QuickResources />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
