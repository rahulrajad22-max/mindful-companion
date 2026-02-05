import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, TrendingDown, Minus, Sun, Droplets, Activity, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface WeeklyStats {
  avgSleep: number;
  avgWater: number;
  avgExercise: number;
  sleepTrend: "up" | "down" | "stable";
  waterTrend: "up" | "down" | "stable";
  exerciseTrend: "up" | "down" | "stable";
  daysLogged: number;
  streakWeeks: number;
}

export function WeeklyWellnessSummary() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<WeeklyStats | null>(null);

  useEffect(() => {
    if (user) {
      fetchWeeklyStats();
    }
  }, [user]);

  const fetchWeeklyStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const today = new Date();
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      const twoWeeksAgo = new Date(today);
      twoWeeksAgo.setDate(today.getDate() - 14);

      // Fetch this week's data
      const { data: thisWeek, error: thisWeekError } = await supabase
        .from("wellness_logs")
        .select("sleep_hours, water_glasses, exercise_minutes, log_date")
        .eq("user_id", user.id)
        .gte("log_date", oneWeekAgo.toISOString().split("T")[0])
        .lte("log_date", today.toISOString().split("T")[0]);

      if (thisWeekError) throw thisWeekError;

      // Fetch last week's data for comparison
      const { data: lastWeek, error: lastWeekError } = await supabase
        .from("wellness_logs")
        .select("sleep_hours, water_glasses, exercise_minutes")
        .eq("user_id", user.id)
        .gte("log_date", twoWeeksAgo.toISOString().split("T")[0])
        .lt("log_date", oneWeekAgo.toISOString().split("T")[0]);

      if (lastWeekError) throw lastWeekError;

      // Fetch all logs to calculate streak (weeks with at least 1 log)
      const { data: allLogs, error: allLogsError } = await supabase
        .from("wellness_logs")
        .select("log_date")
        .eq("user_id", user.id)
        .order("log_date", { ascending: false });

      if (allLogsError) throw allLogsError;

      // Calculate streak weeks
      const streakWeeks = calculateStreakWeeks(allLogs || []);

      // Calculate this week's averages
      const thisWeekCount = thisWeek?.length || 0;
      const thisWeekSleep = thisWeek?.reduce((sum, log) => sum + log.sleep_hours, 0) || 0;
      const thisWeekWater = thisWeek?.reduce((sum, log) => sum + log.water_glasses, 0) || 0;
      const thisWeekExercise = thisWeek?.reduce((sum, log) => sum + log.exercise_minutes, 0) || 0;

      const avgSleep = thisWeekCount > 0 ? thisWeekSleep / thisWeekCount : 0;
      const avgWater = thisWeekCount > 0 ? thisWeekWater / thisWeekCount : 0;
      const avgExercise = thisWeekCount > 0 ? thisWeekExercise / thisWeekCount : 0;

      // Calculate last week's averages for trends
      const lastWeekCount = lastWeek?.length || 0;
      const lastWeekSleep = lastWeek?.reduce((sum, log) => sum + log.sleep_hours, 0) || 0;
      const lastWeekWater = lastWeek?.reduce((sum, log) => sum + log.water_glasses, 0) || 0;
      const lastWeekExercise = lastWeek?.reduce((sum, log) => sum + log.exercise_minutes, 0) || 0;

      const lastAvgSleep = lastWeekCount > 0 ? lastWeekSleep / lastWeekCount : 0;
      const lastAvgWater = lastWeekCount > 0 ? lastWeekWater / lastWeekCount : 0;
      const lastAvgExercise = lastWeekCount > 0 ? lastWeekExercise / lastWeekCount : 0;

      // Determine trends (10% threshold for significance)
      const getTrend = (current: number, previous: number): "up" | "down" | "stable" => {
        if (previous === 0) return current > 0 ? "up" : "stable";
        const change = ((current - previous) / previous) * 100;
        if (change > 10) return "up";
        if (change < -10) return "down";
        return "stable";
      };

      setStats({
        avgSleep: Math.round(avgSleep * 10) / 10,
        avgWater: Math.round(avgWater * 10) / 10,
        avgExercise: Math.round(avgExercise),
        sleepTrend: getTrend(avgSleep, lastAvgSleep),
        waterTrend: getTrend(avgWater, lastAvgWater),
        exerciseTrend: getTrend(avgExercise, lastAvgExercise),
        daysLogged: thisWeekCount,
        streakWeeks,
      });
    } catch (error) {
      console.error("Error fetching weekly stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreakWeeks = (logs: { log_date: string }[]): number => {
    if (logs.length === 0) return 0;

    const getWeekStart = (date: Date): string => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
      d.setDate(diff);
      return d.toISOString().split("T")[0];
    };

    // Get unique weeks with logs
    const weeksWithLogs = new Set(
      logs.map(log => getWeekStart(new Date(log.log_date)))
    );

    // Check consecutive weeks starting from current week
    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);

    while (true) {
      const weekStart = getWeekStart(checkDate);
      if (weeksWithLogs.has(weekStart)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 7);
      } else {
        break;
      }
    }

    return streak;
  };

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-mood-great" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-mood-bad" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendLabel = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return "vs last week";
    if (trend === "down") return "vs last week";
    return "stable";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.daysLogged === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No wellness data logged this week yet. Start tracking to see your summary!
          </p>
        </CardContent>
      </Card>
    );
  }

  const summaryItems = [
    {
      icon: Sun,
      label: "Avg Sleep",
      value: `${stats.avgSleep}`,
      unit: "hrs/day",
      trend: stats.sleepTrend,
      color: "text-mood-okay",
    },
    {
      icon: Droplets,
      label: "Avg Water",
      value: `${stats.avgWater}`,
      unit: "glasses/day",
      trend: stats.waterTrend,
      color: "text-primary",
    },
    {
      icon: Activity,
      label: "Avg Exercise",
      value: `${stats.avgExercise}`,
      unit: "min/day",
      trend: stats.exerciseTrend,
      color: "text-mood-great",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg truncate">Weekly Summary</CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            {/* Streak Badge */}
            {stats.streakWeeks > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 border border-accent/30">
                <Flame className="h-4 w-4 text-accent animate-pulse-soft" />
                <span className="text-xs font-bold text-accent">
                  {stats.streakWeeks}w
                </span>
              </div>
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {stats.daysLogged} day{stats.daysLogged !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-3 rounded-xl bg-muted/50 gap-2"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <item.icon className={`h-5 w-5 shrink-0 ${item.color}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.label}</p>
                <p className="text-xs text-muted-foreground truncate">{item.unit}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xl font-display font-bold text-foreground">
                {item.value}
              </span>
              <div className="flex flex-col items-end">
                <TrendIcon trend={item.trend} />
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {getTrendLabel(item.trend)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
