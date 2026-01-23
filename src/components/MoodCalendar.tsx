import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { CalendarDays, Loader2, Smile, Meh, Frown, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type MoodLevel = "great" | "good" | "okay" | "low" | "bad";

interface MoodEntry {
  id: string;
  mood: MoodLevel;
  mood_value: number;
  entry_date: string;
  created_at: string;
}

interface DayMoodData {
  date: Date;
  mood: MoodLevel;
  moodValue: number;
}

const moodConfig: Record<MoodLevel, { color: string; bgColor: string; emoji: string; label: string }> = {
  great: { color: "text-mood-great", bgColor: "bg-mood-great", emoji: "😊", label: "Great" },
  good: { color: "text-mood-good", bgColor: "bg-mood-good", emoji: "🙂", label: "Good" },
  okay: { color: "text-mood-okay", bgColor: "bg-mood-okay", emoji: "😐", label: "Okay" },
  low: { color: "text-mood-low", bgColor: "bg-mood-low", emoji: "😔", label: "Low" },
  bad: { color: "text-mood-bad", bgColor: "bg-mood-bad", emoji: "😢", label: "Bad" },
};

export function MoodCalendar() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [moodData, setMoodData] = useState<Map<string, DayMoodData>>(new Map());
  const [selectedDay, setSelectedDay] = useState<DayMoodData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchMoodData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);

      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("entry_date", format(monthStart, "yyyy-MM-dd"))
        .lte("entry_date", format(monthEnd, "yyyy-MM-dd"));

      if (error) throw error;

      const moodMap = new Map<string, DayMoodData>();
      data?.forEach((entry) => {
        const dateKey = entry.entry_date;
        moodMap.set(dateKey, {
          date: new Date(entry.entry_date + "T00:00:00"),
          mood: entry.mood as MoodLevel,
          moodValue: entry.mood_value,
        });
      });

      setMoodData(moodMap);
    } catch (error) {
      console.error("Error fetching mood data:", error);
    } finally {
      setLoading(false);
    }
  }, [user, currentMonth]);

  useEffect(() => {
    if (user) {
      fetchMoodData();
    }
  }, [user, fetchMoodData]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("mood_calendar_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "mood_entries",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchMoodData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchMoodData]);

  const handleDayClick = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayData = moodData.get(dateKey);
    
    if (dayData) {
      setSelectedDay(dayData);
      setDialogOpen(true);
    }
  };

  const getMoodForDate = (date: Date): DayMoodData | undefined => {
    const dateKey = format(date, "yyyy-MM-dd");
    return moodData.get(dateKey);
  };

  // Calculate month stats
  const monthStats = Array.from(moodData.values());
  const avgMood = monthStats.length > 0 
    ? monthStats.reduce((sum, d) => sum + d.moodValue, 0) / monthStats.length 
    : 0;
  const daysLogged = monthStats.length;
  const bestDays = monthStats.filter(d => d.moodValue >= 4).length;
  const challengingDays = monthStats.filter(d => d.moodValue <= 2).length;

  return (
    <>
      <Card className="animate-fade-up">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5 text-primary" />
            Mood Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Calendar */}
              <Calendar
                mode="single"
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="rounded-md border p-3 pointer-events-auto"
                modifiers={{
                  hasMood: (date) => getMoodForDate(date) !== undefined,
                }}
                components={{
                  Day: ({ date, ...props }) => {
                    const dayMood = getMoodForDate(date);
                    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                    const isToday = isSameDay(date, new Date());
                    
                    return (
                      <button
                        {...props}
                        onClick={() => handleDayClick(date)}
                        className={cn(
                          "h-9 w-9 p-0 font-normal rounded-md transition-all",
                          "hover:bg-muted focus:bg-muted focus:outline-none",
                          !isCurrentMonth && "text-muted-foreground/50",
                          isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                          dayMood && "cursor-pointer"
                        )}
                      >
                        <div className="relative h-full w-full flex items-center justify-center">
                          <span className={cn(
                            "text-sm",
                            dayMood && isCurrentMonth && "font-medium"
                          )}>
                            {date.getDate()}
                          </span>
                          {dayMood && isCurrentMonth && (
                            <div
                              className={cn(
                                "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
                                moodConfig[dayMood.mood].bgColor
                              )}
                            />
                          )}
                        </div>
                      </button>
                    );
                  },
                }}
              />

              {/* Legend */}
              <div className="flex flex-wrap gap-3 justify-center pt-2 border-t">
                {Object.entries(moodConfig).map(([mood, config]) => (
                  <div key={mood} className="flex items-center gap-1.5">
                    <div className={cn("w-2.5 h-2.5 rounded-full", config.bgColor)} />
                    <span className="text-xs text-muted-foreground">{config.label}</span>
                  </div>
                ))}
              </div>

              {/* Month Stats */}
              {daysLogged > 0 && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-muted/50 text-center">
                    <p className="text-2xl font-display font-bold text-foreground">{daysLogged}</p>
                    <p className="text-xs text-muted-foreground">Days logged</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 text-center">
                    <p className="text-2xl font-display font-bold text-foreground">
                      {avgMood.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">Avg mood</p>
                  </div>
                  <div className="p-3 rounded-xl bg-mood-great/10 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="h-4 w-4 text-mood-great" />
                      <p className="text-2xl font-display font-bold text-mood-great">{bestDays}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Great days</p>
                  </div>
                  <div className="p-3 rounded-xl bg-mood-low/10 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingDown className="h-4 w-4 text-mood-low" />
                      <p className="text-2xl font-display font-bold text-mood-low">{challengingDays}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Tough days</p>
                  </div>
                </div>
              )}

              {daysLogged === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    No mood entries this month. Start tracking to see your calendar fill up!
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Day Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              {selectedDay && format(selectedDay.date, "EEEE, MMMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDay && (
            <div className="space-y-6 py-4">
              {/* Mood Display */}
              <div className="flex flex-col items-center gap-3">
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center text-4xl",
                  moodConfig[selectedDay.mood].bgColor + "/20"
                )}>
                  {moodConfig[selectedDay.mood].emoji}
                </div>
                <div className="text-center">
                  <p className={cn(
                    "text-2xl font-display font-bold",
                    moodConfig[selectedDay.mood].color
                  )}>
                    {moodConfig[selectedDay.mood].label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mood level: {selectedDay.moodValue}/5
                  </p>
                </div>
              </div>

              {/* Mood Scale Visual */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>😢</span>
                  <span>😐</span>
                  <span>😊</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      moodConfig[selectedDay.mood].bgColor
                    )}
                    style={{ width: `${(selectedDay.moodValue / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Insight */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border/30">
                <p className="text-sm text-muted-foreground">
                  {selectedDay.moodValue >= 4 
                    ? "This was a positive day! Consider what contributed to your good mood."
                    : selectedDay.moodValue >= 3
                    ? "A balanced day. Reflect on what kept you steady."
                    : "A challenging day. Remember, it's okay to have tough times."}
                </p>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
