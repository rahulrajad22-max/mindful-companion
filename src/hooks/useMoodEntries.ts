import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

type MoodLevel = "great" | "good" | "okay" | "low" | "bad";

interface MoodEntry {
  id: string;
  mood: MoodLevel;
  mood_value: number;
  created_at: string;
  entry_date: string;
}

interface MoodDataPoint {
  date: string;
  mood: number;
  label: string;
}

const moodToNumber: Record<MoodLevel, number> = {
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  bad: 1,
};

const numberToMood: Record<number, MoodLevel> = {
  5: "great",
  4: "good",
  3: "okay",
  2: "low",
  1: "bad",
};

const moodLabels: Record<number, string> = {
  1: "Bad",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Great",
};

export function useMoodEntries() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [todaysMood, setTodaysMood] = useState<MoodLevel | undefined>();
  const [weeklyData, setWeeklyData] = useState<MoodDataPoint[]>([]);
  const [monthlyData, setMonthlyData] = useState<MoodDataPoint[]>([]);

  const fetchMoodEntries = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const today = new Date();
      const todayStr = format(today, "yyyy-MM-dd");

      // Fetch today's mood
      const { data: todayData } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("entry_date", todayStr)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (todayData) {
        setTodaysMood(todayData.mood as MoodLevel);
      }

      // Fetch last 7 days for weekly chart
      const weekAgo = subDays(today, 6);
      const { data: weekData } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("entry_date", format(weekAgo, "yyyy-MM-dd"))
        .lte("entry_date", todayStr)
        .order("entry_date", { ascending: true });

      // Create a map of dates to mood values
      const moodByDate = new Map<string, number>();
      weekData?.forEach((entry) => {
        moodByDate.set(entry.entry_date, entry.mood_value);
      });

      // Generate weekly data points for the last 7 days
      const weeklyPoints: MoodDataPoint[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = format(date, "yyyy-MM-dd");
        const dayName = format(date, "EEE");
        const moodValue = moodByDate.get(dateStr);
        
        if (moodValue) {
          weeklyPoints.push({
            date: dayName,
            mood: moodValue,
            label: moodLabels[moodValue] || "Unknown",
          });
        }
      }
      setWeeklyData(weeklyPoints);

      // Fetch last 4 weeks for monthly chart
      const monthAgo = subDays(today, 27);
      const { data: monthData } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("entry_date", format(monthAgo, "yyyy-MM-dd"))
        .lte("entry_date", todayStr)
        .order("entry_date", { ascending: true });

      // Group by week and calculate averages
      const weeklyAverages: { week: number; total: number; count: number }[] = [
        { week: 1, total: 0, count: 0 },
        { week: 2, total: 0, count: 0 },
        { week: 3, total: 0, count: 0 },
        { week: 4, total: 0, count: 0 },
      ];

      monthData?.forEach((entry) => {
        const entryDate = new Date(entry.entry_date);
        const daysAgo = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
        const weekIndex = Math.min(3, Math.floor(daysAgo / 7));
        const reverseIndex = 3 - weekIndex;
        weeklyAverages[reverseIndex].total += entry.mood_value;
        weeklyAverages[reverseIndex].count++;
      });

      const monthlyPoints: MoodDataPoint[] = weeklyAverages
        .map((week, index) => {
          if (week.count === 0) return null;
          const avgMood = Math.round(week.total / week.count);
          return {
            date: `Week ${index + 1}`,
            mood: avgMood,
            label: moodLabels[avgMood] || "Unknown",
          };
        })
        .filter((point): point is MoodDataPoint => point !== null);

      setMonthlyData(monthlyPoints);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveMood = useCallback(async (mood: MoodLevel) => {
    if (!user) return;

    const today = format(new Date(), "yyyy-MM-dd");
    const moodValue = moodToNumber[mood];

    try {
      // Check if there's already an entry for today
      const { data: existing } = await supabase
        .from("mood_entries")
        .select("id")
        .eq("user_id", user.id)
        .eq("entry_date", today)
        .maybeSingle();

      if (existing) {
        // Update existing entry
        await supabase
          .from("mood_entries")
          .update({ mood, mood_value: moodValue })
          .eq("id", existing.id);
      } else {
        // Insert new entry
        await supabase
          .from("mood_entries")
          .insert({
            user_id: user.id,
            mood,
            mood_value: moodValue,
            entry_date: today,
          });
      }

      setTodaysMood(mood);
      // Refetch to update charts
      await fetchMoodEntries();
    } catch (error) {
      console.error("Error saving mood:", error);
      throw error;
    }
  }, [user, fetchMoodEntries]);

  useEffect(() => {
    if (user) {
      fetchMoodEntries();
    }
  }, [user, fetchMoodEntries]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("mood_entries_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "mood_entries",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchMoodEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchMoodEntries]);

  return {
    loading,
    todaysMood,
    weeklyData,
    monthlyData,
    saveMood,
    refetch: fetchMoodEntries,
  };
}
