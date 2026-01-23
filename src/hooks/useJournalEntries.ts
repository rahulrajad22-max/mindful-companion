import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, subDays, differenceInDays, parseISO, isToday, isYesterday } from "date-fns";
import { JournalAnalysis } from "@/components/AIAnalysisCard";

export interface JournalEntryData {
  id: string;
  date: string;
  time: string;
  content: string;
  mood: string;
  sentiment: "positive" | "neutral" | "negative" | "mixed";
  analysis?: JournalAnalysis;
  created_at: string;
}

interface SentimentDataPoint {
  date: string;
  sentiment: number;
  stressLevel: number;
  mood: number;
}

interface JournalStats {
  totalEntries: number;
  thisWeek: number;
  streak: number;
}

const moodEmoji: Record<string, string> = {
  great: "😊",
  good: "🙂",
  okay: "😐",
  low: "😔",
  bad: "😢",
};

const sentimentToMood: Record<string, string> = {
  positive: "great",
  neutral: "okay",
  negative: "low",
  mixed: "okay",
};

export function useJournalEntries() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [weeklySentimentData, setWeeklySentimentData] = useState<SentimentDataPoint[]>([]);
  const [monthlySentimentData, setMonthlySentimentData] = useState<SentimentDataPoint[]>([]);
  const [stats, setStats] = useState<JournalStats>({ totalEntries: 0, thisWeek: 0, streak: 0 });

  const formatRelativeDate = (dateStr: string): string => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    const daysAgo = differenceInDays(new Date(), date);
    if (daysAgo < 7) return `${daysAgo} days ago`;
    return format(date, "MMM d, yyyy");
  };

  const fetchEntries = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch all journal entries
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedEntries: JournalEntryData[] = (data || []).map((entry) => {
        const createdAt = new Date(entry.created_at);
        const aiAnalysis = entry.ai_analysis as unknown as JournalAnalysis | null;
        const sentiment = aiAnalysis?.sentiment || "neutral";
        const moodKey = entry.mood || sentimentToMood[sentiment] || "okay";

        return {
          id: entry.id,
          date: formatRelativeDate(entry.created_at),
          time: format(createdAt, "h:mm a"),
          content: entry.content,
          mood: moodEmoji[moodKey] || "🙂",
          sentiment: sentiment as "positive" | "neutral" | "negative" | "mixed",
          analysis: aiAnalysis || undefined,
          created_at: entry.created_at,
        };
      });

      setEntries(formattedEntries);

      // Calculate stats
      const today = new Date();
      const weekAgo = subDays(today, 7);
      const thisWeekEntries = data?.filter((e) => new Date(e.created_at) >= weekAgo).length || 0;

      // Calculate streak
      let streak = 0;
      if (data && data.length > 0) {
        const sortedDates = [...new Set(data.map((e) => format(new Date(e.created_at), "yyyy-MM-dd")))].sort().reverse();
        
        let expectedDate = format(today, "yyyy-MM-dd");
        for (const dateStr of sortedDates) {
          if (dateStr === expectedDate || dateStr === format(subDays(parseISO(expectedDate), 1), "yyyy-MM-dd")) {
            streak++;
            expectedDate = format(subDays(parseISO(dateStr), 1), "yyyy-MM-dd");
          } else if (dateStr < expectedDate) {
            break;
          }
        }
      }

      setStats({
        totalEntries: data?.length || 0,
        thisWeek: thisWeekEntries,
        streak,
      });

      // Generate sentiment data for charts
      await fetchSentimentData();
    } catch (error) {
      console.error("Error fetching journal entries:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchSentimentData = useCallback(async () => {
    if (!user) return;

    try {
      const today = new Date();
      const weekAgo = subDays(today, 6);
      const monthAgo = subDays(today, 27);

      // Fetch entries for the last month
      const { data } = await supabase
        .from("journal_entries")
        .select("created_at, sentiment, stress_level, mood, ai_analysis")
        .eq("user_id", user.id)
        .gte("created_at", format(monthAgo, "yyyy-MM-dd"))
        .order("created_at", { ascending: true });

      if (!data || data.length === 0) {
        setWeeklySentimentData([]);
        setMonthlySentimentData([]);
        return;
      }

      // Group by day for weekly data
      const dailyData = new Map<string, { sentiments: number[]; stressLevels: number[]; moods: number[] }>();

      data.forEach((entry) => {
        const dateKey = format(new Date(entry.created_at), "yyyy-MM-dd");
        if (!dailyData.has(dateKey)) {
          dailyData.set(dateKey, { sentiments: [], stressLevels: [], moods: [] });
        }
        const dayData = dailyData.get(dateKey)!;

        // Convert sentiment string to number
        const sentimentMap: Record<string, number> = { positive: 0.7, neutral: 0.1, negative: -0.5, mixed: 0.0 };
        const sentimentValue = sentimentMap[(entry.ai_analysis as any)?.sentiment || "neutral"] || 0;
        dayData.sentiments.push(sentimentValue);

        if (entry.stress_level) {
          dayData.stressLevels.push(entry.stress_level);
        }

        // Convert mood to number
        const moodMap: Record<string, number> = { great: 5, good: 4, okay: 3, low: 2, bad: 1 };
        const moodValue = moodMap[entry.mood || "okay"] || 3;
        dayData.moods.push(moodValue);
      });

      // Generate weekly data points
      const weeklyPoints: SentimentDataPoint[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = format(date, "yyyy-MM-dd");
        const dayName = format(date, "EEE");
        const dayData = dailyData.get(dateStr);

        if (dayData && dayData.sentiments.length > 0) {
          const avgSentiment = dayData.sentiments.reduce((a, b) => a + b, 0) / dayData.sentiments.length;
          const avgStress = dayData.stressLevels.length > 0
            ? dayData.stressLevels.reduce((a, b) => a + b, 0) / dayData.stressLevels.length
            : 50;
          const avgMood = dayData.moods.reduce((a, b) => a + b, 0) / dayData.moods.length;

          weeklyPoints.push({
            date: dayName,
            sentiment: Math.round(avgSentiment * 100) / 100,
            stressLevel: Math.round(avgStress),
            mood: Math.round(avgMood),
          });
        }
      }
      setWeeklySentimentData(weeklyPoints);

      // Generate monthly data (grouped by week)
      const weeklyAverages: { week: number; sentiments: number[]; stressLevels: number[]; moods: number[] }[] = [
        { week: 1, sentiments: [], stressLevels: [], moods: [] },
        { week: 2, sentiments: [], stressLevels: [], moods: [] },
        { week: 3, sentiments: [], stressLevels: [], moods: [] },
        { week: 4, sentiments: [], stressLevels: [], moods: [] },
      ];

      data.forEach((entry) => {
        const entryDate = new Date(entry.created_at);
        const daysAgo = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
        const weekIndex = Math.min(3, Math.floor(daysAgo / 7));
        const reverseIndex = 3 - weekIndex;

        const sentimentMap: Record<string, number> = { positive: 0.7, neutral: 0.1, negative: -0.5, mixed: 0.0 };
        weeklyAverages[reverseIndex].sentiments.push(sentimentMap[(entry.ai_analysis as any)?.sentiment || "neutral"] || 0);
        
        if (entry.stress_level) {
          weeklyAverages[reverseIndex].stressLevels.push(entry.stress_level);
        }

        const moodMap: Record<string, number> = { great: 5, good: 4, okay: 3, low: 2, bad: 1 };
        weeklyAverages[reverseIndex].moods.push(moodMap[entry.mood || "okay"] || 3);
      });

      const monthlyPoints: SentimentDataPoint[] = weeklyAverages
        .map((week, index) => {
          if (week.sentiments.length === 0) return null;
          return {
            date: `Week ${index + 1}`,
            sentiment: Math.round((week.sentiments.reduce((a, b) => a + b, 0) / week.sentiments.length) * 100) / 100,
            stressLevel: week.stressLevels.length > 0
              ? Math.round(week.stressLevels.reduce((a, b) => a + b, 0) / week.stressLevels.length)
              : 50,
            mood: Math.round(week.moods.reduce((a, b) => a + b, 0) / week.moods.length),
          };
        })
        .filter((point): point is SentimentDataPoint => point !== null);

      setMonthlySentimentData(monthlyPoints);
    } catch (error) {
      console.error("Error fetching sentiment data:", error);
    }
  }, [user]);

  const saveEntry = useCallback(async (
    content: string,
    analysis?: JournalAnalysis
  ): Promise<JournalEntryData | null> => {
    if (!user) return null;

    try {
      const mood = analysis?.sentiment ? sentimentToMood[analysis.sentiment] : "okay";
      // Map stress level string to number
      const stressLevelMap: Record<string, number> = { low: 25, medium: 50, high: 75 };
      const stressLevel = analysis?.stressLevel ? stressLevelMap[analysis.stressLevel] || 50 : null;

      const { data, error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: user.id,
          content,
          mood,
          sentiment: analysis?.sentiment ? 
            (analysis.sentiment === "positive" ? 0.7 : analysis.sentiment === "negative" ? -0.5 : 0) : 0,
          stress_level: stressLevel,
          ai_analysis: analysis ? JSON.parse(JSON.stringify(analysis)) : null,
        })
        .select()
        .single();

      if (error) throw error;

      const newEntry: JournalEntryData = {
        id: data.id,
        date: "Just now",
        time: format(new Date(), "h:mm a"),
        content: data.content,
        mood: moodEmoji[mood] || "🙂",
        sentiment: (analysis?.sentiment || "neutral") as "positive" | "neutral" | "negative" | "mixed",
        analysis,
        created_at: data.created_at,
      };

      // Refetch to update stats
      await fetchEntries();

      return newEntry;
    } catch (error) {
      console.error("Error saving journal entry:", error);
      throw error;
    }
  }, [user, fetchEntries]);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user, fetchEntries]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("journal_entries_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "journal_entries",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchEntries]);

  return {
    loading,
    entries,
    stats,
    weeklySentimentData,
    monthlySentimentData,
    saveEntry,
    refetch: fetchEntries,
  };
}
