import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { Card, CardContent } from "@/components/ui/card";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { MoodChart } from "@/components/MoodChart";
import { SentimentTrendsChart } from "@/components/SentimentTrendsChart";
import { MoodCalendar } from "@/components/MoodCalendar";
import { MoodHeatmap } from "@/components/MoodHeatmap";
import { WeeklyWellnessSummary } from "@/components/WeeklyWellnessSummary";
import { TimeRange } from "@/components/TimeRangeToggle";
import { BarChart3, TrendingUp, Brain, Calendar, Activity } from "lucide-react";

export default function Analytics() {
  const { t } = useTranslation();
  const [moodTimeRange, setMoodTimeRange] = useState<TimeRange>("weekly");
  const [sentimentTimeRange, setSentimentTimeRange] = useState<TimeRange>("weekly");
  const { weeklyData: weeklyMoodData, monthlyData: monthlyMoodData } = useMoodEntries();
  const { weeklySentimentData, monthlySentimentData } = useJournalEntries();

  const moodData = useMemo(() => (moodTimeRange === "weekly" ? weeklyMoodData : monthlyMoodData), [moodTimeRange, weeklyMoodData, monthlyMoodData]);
  const sentimentData = useMemo(() => (sentimentTimeRange === "weekly" ? weeklySentimentData : monthlySentimentData), [sentimentTimeRange, weeklySentimentData, monthlySentimentData]);

  const avgMood = weeklyMoodData.length > 0
    ? (weeklyMoodData.reduce((sum, d) => sum + d.mood, 0) / weeklyMoodData.length).toFixed(1)
    : "—";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ParallaxBackground variant="page" />
      <main className="container py-8">
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm">{t("analytics.badge")}</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">{t("analytics.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("analytics.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
          {[
            { icon: TrendingUp, label: t("analytics.avgMood"), value: avgMood, color: "text-primary", bg: "bg-primary/10" },
            { icon: Calendar, label: t("analytics.thisWeek"), value: weeklyMoodData.length, color: "text-accent", bg: "bg-accent/10" },
            { icon: Brain, label: t("analytics.journalEntries"), value: weeklySentimentData.length, color: "text-secondary-foreground", bg: "bg-secondary/50" },
            { icon: Activity, label: t("analytics.sentimentPts"), value: sentimentData.length, color: "text-mood-great", bg: "bg-mood-great/10" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/30">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <SentimentTrendsChart data={sentimentData} timeRange={sentimentTimeRange} onTimeRangeChange={setSentimentTimeRange} />
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
              <MoodChart data={moodData} timeRange={moodTimeRange} onTimeRangeChange={setMoodTimeRange} />
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
              <MoodHeatmap />
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "500ms" }}>
              <MoodCalendar />
            </div>
          </div>
          <div className="space-y-6">
            <div className="animate-fade-up" style={{ animationDelay: "250ms" }}>
              <WeeklyWellnessSummary />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
