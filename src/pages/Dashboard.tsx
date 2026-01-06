import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MoodSelector } from "@/components/MoodSelector";
import { MoodChart } from "@/components/MoodChart";
import { SentimentTrendsChart } from "@/components/SentimentTrendsChart";
import { JournalEntry } from "@/components/JournalEntry";
import { InsightCard } from "@/components/InsightCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Sun, Moon, Droplets, Activity } from "lucide-react";

type MoodLevel = "great" | "good" | "okay" | "low" | "bad";

const moodToNumber: Record<MoodLevel, number> = {
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  bad: 1,
};

// Sample data for the mood chart
const sampleMoodData = [
  { date: "Mon", mood: 4, label: "Good" },
  { date: "Tue", mood: 3, label: "Okay" },
  { date: "Wed", mood: 4, label: "Good" },
  { date: "Thu", mood: 5, label: "Great" },
  { date: "Fri", mood: 4, label: "Good" },
  { date: "Sat", mood: 3, label: "Okay" },
  { date: "Sun", mood: 4, label: "Good" },
];

// Sample sentiment data from journal analysis
const sampleSentimentData = [
  { date: "Mon", sentiment: 0.3, stressLevel: 45, mood: 4 },
  { date: "Tue", sentiment: -0.1, stressLevel: 62, mood: 3 },
  { date: "Wed", sentiment: 0.5, stressLevel: 38, mood: 4 },
  { date: "Thu", sentiment: 0.7, stressLevel: 25, mood: 5 },
  { date: "Fri", sentiment: 0.4, stressLevel: 42, mood: 4 },
  { date: "Sat", sentiment: 0.1, stressLevel: 55, mood: 3 },
  { date: "Sun", sentiment: 0.6, stressLevel: 30, mood: 4 },
];

export default function Dashboard() {
  const [selectedMood, setSelectedMood] = useState<MoodLevel>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [moodData, setMoodData] = useState(sampleMoodData);
  const [sentimentData, setSentimentData] = useState(sampleSentimentData);

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
              <SentimentTrendsChart data={sentimentData} />
            </div>

            {/* Mood Chart */}
            <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
              <MoodChart data={moodData} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="animate-fade-up" style={{ animationDelay: "150ms" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Today's Wellness</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Sun className="h-5 w-5 text-mood-okay mx-auto mb-1" />
                  <p className="text-2xl font-display font-bold text-foreground">7</p>
                  <p className="text-xs text-muted-foreground">hrs sleep</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Droplets className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-display font-bold text-foreground">5</p>
                  <p className="text-xs text-muted-foreground">glasses water</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Activity className="h-5 w-5 text-mood-great mx-auto mb-1" />
                  <p className="text-2xl font-display font-bold text-foreground">30</p>
                  <p className="text-xs text-muted-foreground">min exercise</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Moon className="h-5 w-5 text-secondary-foreground mx-auto mb-1" />
                  <p className="text-2xl font-display font-bold text-foreground">2</p>
                  <p className="text-xs text-muted-foreground">journal entries</p>
                </div>
              </CardContent>
            </Card>

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
            <Card className="animate-fade-up" style={{ animationDelay: "350ms" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-left h-auto py-3">
                  <div>
                    <p className="font-medium">Breathing Exercise</p>
                    <p className="text-xs text-muted-foreground">4-7-8 calming technique</p>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left h-auto py-3">
                  <div>
                    <p className="font-medium">Gratitude Prompt</p>
                    <p className="text-xs text-muted-foreground">Quick reflection starter</p>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left h-auto py-3">
                  <div>
                    <p className="font-medium">Crisis Hotlines</p>
                    <p className="text-xs text-muted-foreground">24/7 professional support</p>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
