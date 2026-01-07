import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { MoodSelector } from "@/components/MoodSelector";
import { MoodChart } from "@/components/MoodChart";
import { SentimentTrendsChart } from "@/components/SentimentTrendsChart";
import { JournalEntry } from "@/components/JournalEntry";
import { InsightCard } from "@/components/InsightCard";
import { WellnessTracker } from "@/components/WellnessTracker";
import { QuickResources } from "@/components/QuickResources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { TimeRange } from "@/components/TimeRangeToggle";

type MoodLevel = "great" | "good" | "okay" | "low" | "bad";

const moodToNumber: Record<MoodLevel, number> = {
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  bad: 1,
};

// Sample weekly data for the mood chart
const weeklyMoodData = [
  { date: "Mon", mood: 4, label: "Good" },
  { date: "Tue", mood: 3, label: "Okay" },
  { date: "Wed", mood: 4, label: "Good" },
  { date: "Thu", mood: 5, label: "Great" },
  { date: "Fri", mood: 4, label: "Good" },
  { date: "Sat", mood: 3, label: "Okay" },
  { date: "Sun", mood: 4, label: "Good" },
];

// Sample monthly data for the mood chart
const monthlyMoodData = [
  { date: "Week 1", mood: 3, label: "Okay" },
  { date: "Week 2", mood: 4, label: "Good" },
  { date: "Week 3", mood: 3, label: "Okay" },
  { date: "Week 4", mood: 5, label: "Great" },
];

// Sample weekly sentiment data from journal analysis
const weeklySentimentData = [
  { date: "Mon", sentiment: 0.3, stressLevel: 45, mood: 4 },
  { date: "Tue", sentiment: -0.1, stressLevel: 62, mood: 3 },
  { date: "Wed", sentiment: 0.5, stressLevel: 38, mood: 4 },
  { date: "Thu", sentiment: 0.7, stressLevel: 25, mood: 5 },
  { date: "Fri", sentiment: 0.4, stressLevel: 42, mood: 4 },
  { date: "Sat", sentiment: 0.1, stressLevel: 55, mood: 3 },
  { date: "Sun", sentiment: 0.6, stressLevel: 30, mood: 4 },
];

// Sample monthly sentiment data
const monthlySentimentData = [
  { date: "Week 1", sentiment: 0.2, stressLevel: 52, mood: 3 },
  { date: "Week 2", sentiment: 0.4, stressLevel: 40, mood: 4 },
  { date: "Week 3", sentiment: 0.1, stressLevel: 58, mood: 3 },
  { date: "Week 4", sentiment: 0.6, stressLevel: 32, mood: 5 },
];

export default function Dashboard() {
  const [selectedMood, setSelectedMood] = useState<MoodLevel>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [moodTimeRange, setMoodTimeRange] = useState<TimeRange>("weekly");
  const [sentimentTimeRange, setSentimentTimeRange] = useState<TimeRange>("weekly");
  const [wellnessData, setWellnessData] = useState({
    sleep: 7,
    water: 5,
    exercise: 30,
    journalEntries: 2,
  });

  const moodData = useMemo(() => 
    moodTimeRange === "weekly" ? weeklyMoodData : monthlyMoodData, 
    [moodTimeRange]
  );

  const sentimentData = useMemo(() => 
    sentimentTimeRange === "weekly" ? weeklySentimentData : monthlySentimentData, 
    [sentimentTimeRange]
  );

  const handleMoodSelect = (mood: MoodLevel) => {
    setSelectedMood(mood);
    // In a real app, this would save to the database
  };

  const handleJournalSave = (entry: string) => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
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
                <MoodSelector 
                  selectedMood={selectedMood}
                  onMoodSelect={handleMoodSelect}
                />
                {selectedMood && (
                  <div className="mt-4 p-4 rounded-xl bg-primary-soft text-center animate-scale-in">
                    <p className="text-sm text-primary">
                      Thanks for sharing! Your mood has been logged.
                    </p>
                  </div>
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

            {/* Mood Chart */}
            <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
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
              <WellnessTracker data={wellnessData} onUpdate={setWellnessData} />
            </div>

            {/* AI Insights */}
            <div className="space-y-4 animate-fade-up" style={{ animationDelay: "250ms" }}>
              <h3 className="font-display text-lg font-semibold text-foreground">AI Insights</h3>
              
              <InsightCard
                type="sentiment"
                title="Positive Trend"
                description="Your journal entries show an upward trend in positivity this week. Keep it up!"
                level="positive"
              />
              
              <InsightCard
                type="suggestion"
                title="Self-Care Tip"
                description="Try a 5-minute breathing exercise today. It can help maintain your positive momentum."
                level="neutral"
              />
              
              <InsightCard
                type="pattern"
                title="Pattern Detected"
                description="You tend to feel better on days when you exercise. Consider morning walks."
                level="neutral"
              />
            </div>

            {/* Resources */}
            <div className="animate-fade-up" style={{ animationDelay: "350ms" }}>
              <QuickResources />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
