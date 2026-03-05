import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, subDays, startOfWeek, eachDayOfInterval, getDay } from "date-fns";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DayData {
  date: string;
  moodValue: number | null;
  moodLabel: string;
}

const MOOD_COLORS: Record<number, string> = {
  0: "bg-muted/40",
  1: "bg-mood-bad",
  2: "bg-mood-low",
  3: "bg-mood-okay",
  4: "bg-mood-good",
  5: "bg-mood-great",
};

const MOOD_LABELS: Record<number, string> = {
  1: "Bad",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Great",
};

const WEEKS_TO_SHOW = 20;

export function MoodHeatmap() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [moodMap, setMoodMap] = useState<Map<string, number>>(new Map());
  const [offset, setOffset] = useState(0); // weeks offset for navigation
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      setLoading(true);
      const endDate = new Date();
      const startDate = subDays(endDate, (WEEKS_TO_SHOW + offset) * 7 + 30);
      const { data } = await supabase
        .from("mood_entries")
        .select("entry_date, mood_value")
        .eq("user_id", user.id)
        .gte("entry_date", format(startDate, "yyyy-MM-dd"))
        .order("entry_date", { ascending: true });

      const map = new Map<string, number>();
      data?.forEach((e) => map.set(e.entry_date, e.mood_value));
      setMoodMap(map);
      setLoading(false);
    };
    fetchAll();
  }, [user, offset]);

  const { weeks, monthLabels, totalLogged, currentStreak, longestStreak } = useMemo(() => {
    const today = new Date();
    const shiftedEnd = subDays(today, offset * 7);
    // Start from the beginning of the week, WEEKS_TO_SHOW weeks back
    const startDate = startOfWeek(subDays(shiftedEnd, (WEEKS_TO_SHOW - 1) * 7), { weekStartsOn: 0 });
    const endDate = shiftedEnd;

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Build weeks grid (columns = weeks, rows = days of week)
    const weeksGrid: DayData[][] = [];
    let currentWeek: DayData[] = [];

    // Pad the first week if it doesn't start on Sunday
    const firstDayOfWeek = getDay(allDays[0]);
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: "", moodValue: null, moodLabel: "" });
    }

    allDays.forEach((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const mood = moodMap.get(dateStr) ?? null;
      currentWeek.push({
        date: dateStr,
        moodValue: mood,
        moodLabel: mood ? MOOD_LABELS[mood] || "" : "",
      });
      if (currentWeek.length === 7) {
        weeksGrid.push(currentWeek);
        currentWeek = [];
      }
    });
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: "", moodValue: null, moodLabel: "" });
      }
      weeksGrid.push(currentWeek);
    }

    // Month labels
    const labels: { label: string; colIndex: number }[] = [];
    let lastMonth = "";
    weeksGrid.forEach((week, i) => {
      const firstValidDay = week.find((d) => d.date);
      if (firstValidDay?.date) {
        const month = format(new Date(firstValidDay.date + "T00:00:00"), "MMM");
        if (month !== lastMonth) {
          labels.push({ label: month, colIndex: i });
          lastMonth = month;
        }
      }
    });

    // Stats
    let logged = 0;
    let streak = 0;
    let maxStreak = 0;
    // Calculate from today backwards
    const todayStr = format(today, "yyyy-MM-dd");
    for (let i = 0; i < 365; i++) {
      const d = format(subDays(today, i), "yyyy-MM-dd");
      if (moodMap.has(d)) {
        if (i === 0 || streak > 0) streak++;
        logged++;
      } else if (i === 0) {
        // today not logged yet, check yesterday
        continue;
      } else {
        if (streak > maxStreak) maxStreak = streak;
        streak = 0;
      }
    }
    if (streak > maxStreak) maxStreak = streak;

    // Recalculate current streak properly
    let curStreak = 0;
    for (let i = 0; i < 365; i++) {
      const d = format(subDays(today, i), "yyyy-MM-dd");
      if (moodMap.has(d)) {
        curStreak++;
      } else if (i === 0) {
        continue; // today might not be logged yet
      } else {
        break;
      }
    }

    return {
      weeks: weeksGrid,
      monthLabels: labels,
      totalLogged: logged,
      currentStreak: curStreak,
      longestStreak: maxStreak,
    };
  }, [moodMap, offset]);

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <Card className="gradient-card border-border/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flame className="h-5 w-5 text-accent" />
            Mood Heatmap
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setOffset((o) => o + WEEKS_TO_SHOW)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={offset === 0}
              onClick={() => setOffset((o) => Math.max(0, o - WEEKS_TO_SHOW))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats row */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-soft">
            <Flame className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-foreground">{currentStreak} day streak</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-secondary">
            <span className="text-sm text-muted-foreground">Longest: <span className="font-medium text-foreground">{longestStreak} days</span></span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-muted">
            <span className="text-sm text-muted-foreground">Total: <span className="font-medium text-foreground">{totalLogged} entries</span></span>
          </div>
        </div>

        {/* Heatmap grid */}
        <div className="overflow-x-auto">
          <div className="inline-flex gap-0">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-2 pt-5">
              {dayLabels.map((label, i) => (
                <div key={i} className="h-[14px] flex items-center">
                  <span className="text-[10px] text-muted-foreground leading-none">{label}</span>
                </div>
              ))}
            </div>

            {/* Grid */}
            <div>
              {/* Month labels */}
              <div className="flex mb-1 h-4">
                {weeks.map((_, i) => {
                  const monthLabel = monthLabels.find((m) => m.colIndex === i);
                  return (
                    <div key={i} className="w-[14px] mx-[1.5px]">
                      {monthLabel && (
                        <span className="text-[10px] text-muted-foreground leading-none">
                          {monthLabel.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Cells - render row by row (day of week) */}
              <TooltipProvider delayDuration={100}>
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <div key={dayIndex} className="flex gap-[3px] mb-[3px]">
                    {weeks.map((week, weekIndex) => {
                      const day = week[dayIndex];
                      if (!day || !day.date) {
                        return <div key={weekIndex} className="w-[14px] h-[14px]" />;
                      }
                      const colorClass = day.moodValue
                        ? MOOD_COLORS[day.moodValue]
                        : MOOD_COLORS[0];

                      return (
                        <Tooltip key={weekIndex}>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-[14px] h-[14px] rounded-[3px] ${colorClass} transition-colors cursor-default hover:ring-1 hover:ring-foreground/20`}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            <p className="font-medium">
                              {format(new Date(day.date + "T00:00:00"), "MMM d, yyyy")}
                            </p>
                            <p className="text-muted-foreground">
                              {day.moodValue
                                ? `Mood: ${day.moodLabel} (${day.moodValue}/5)`
                                : "No entry"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 justify-end">
          <span className="text-[10px] text-muted-foreground">Less</span>
          {[0, 1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`w-[14px] h-[14px] rounded-[3px] ${MOOD_COLORS[level]}`}
            />
          ))}
          <span className="text-[10px] text-muted-foreground">More</span>
        </div>
      </CardContent>
    </Card>
  );
}
