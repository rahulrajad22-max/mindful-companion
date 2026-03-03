import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  streakDays: number;
}

export function WeeklyWellnessSummary() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<WeeklyStats | null>(null);

  useEffect(() => { if (user) fetchWeeklyStats(); }, [user]);

  const fetchWeeklyStats = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const today = new Date();
      const oneWeekAgo = new Date(today); oneWeekAgo.setDate(today.getDate() - 7);
      const twoWeeksAgo = new Date(today); twoWeeksAgo.setDate(today.getDate() - 14);

      const { data: thisWeek, error: thisWeekError } = await supabase.from("wellness_logs").select("sleep_hours, water_glasses, exercise_minutes, log_date").eq("user_id", user.id).gte("log_date", oneWeekAgo.toISOString().split("T")[0]).lte("log_date", today.toISOString().split("T")[0]);
      if (thisWeekError) throw thisWeekError;

      const { data: lastWeek, error: lastWeekError } = await supabase.from("wellness_logs").select("sleep_hours, water_glasses, exercise_minutes").eq("user_id", user.id).gte("log_date", twoWeeksAgo.toISOString().split("T")[0]).lt("log_date", oneWeekAgo.toISOString().split("T")[0]);
      if (lastWeekError) throw lastWeekError;

      const { data: allLogs, error: allLogsError } = await supabase.from("wellness_logs").select("log_date").eq("user_id", user.id).order("log_date", { ascending: false });
      if (allLogsError) throw allLogsError;

      const streakWeeks = calculateStreakWeeks(allLogs || []);
      const thisWeekCount = thisWeek?.length || 0;
      const thisWeekSleep = thisWeek?.reduce((sum, log) => sum + log.sleep_hours, 0) || 0;
      const thisWeekWater = thisWeek?.reduce((sum, log) => sum + log.water_glasses, 0) || 0;
      const thisWeekExercise = thisWeek?.reduce((sum, log) => sum + log.exercise_minutes, 0) || 0;

      const avgSleep = thisWeekCount > 0 ? thisWeekSleep / thisWeekCount : 0;
      const avgWater = thisWeekCount > 0 ? thisWeekWater / thisWeekCount : 0;
      const avgExercise = thisWeekCount > 0 ? thisWeekExercise / thisWeekCount : 0;

      const lastWeekCount = lastWeek?.length || 0;
      const lastAvgSleep = lastWeekCount > 0 ? (lastWeek?.reduce((s, l) => s + l.sleep_hours, 0) || 0) / lastWeekCount : 0;
      const lastAvgWater = lastWeekCount > 0 ? (lastWeek?.reduce((s, l) => s + l.water_glasses, 0) || 0) / lastWeekCount : 0;
      const lastAvgExercise = lastWeekCount > 0 ? (lastWeek?.reduce((s, l) => s + l.exercise_minutes, 0) || 0) / lastWeekCount : 0;

      const getTrend = (current: number, previous: number): "up" | "down" | "stable" => {
        if (previous === 0) return current > 0 ? "up" : "stable";
        const change = ((current - previous) / previous) * 100;
        if (change > 10) return "up"; if (change < -10) return "down"; return "stable";
      };

      const streakDays = calculateStreakDays(allLogs || []);

      setStats({
        avgSleep: Math.round(avgSleep * 10) / 10, avgWater: Math.round(avgWater * 10) / 10, avgExercise: Math.round(avgExercise),
        sleepTrend: getTrend(avgSleep, lastAvgSleep), waterTrend: getTrend(avgWater, lastAvgWater), exerciseTrend: getTrend(avgExercise, lastAvgExercise),
        daysLogged: thisWeekCount, streakWeeks, streakDays,
      });
    } catch (error) { console.error("Error fetching weekly stats:", error); }
    finally { setLoading(false); }
  };

  const calculateStreakWeeks = (logs: { log_date: string }[]): number => {
    if (logs.length === 0) return 0;
    const getWeekStart = (date: Date): string => { const d = new Date(date); const day = d.getDay(); const diff = d.getDate() - day + (day === 0 ? -6 : 1); d.setDate(diff); return d.toISOString().split("T")[0]; };
    const weeksWithLogs = new Set(logs.map(log => getWeekStart(new Date(log.log_date))));
    let streak = 0; const today = new Date(); let checkDate = new Date(today);
    while (true) { const weekStart = getWeekStart(checkDate); if (weeksWithLogs.has(weekStart)) { streak++; checkDate.setDate(checkDate.getDate() - 7); } else break; }
    return streak;
  };

  const calculateStreakDays = (logs: { log_date: string }[]): number => {
    if (logs.length === 0) return 0;
    const uniqueDates = [...new Set(logs.map(l => l.log_date))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); const yesterdayStr = yesterday.toISOString().split("T")[0];
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterdayStr) return 0;
    let streak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]); const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) streak++; else break;
    }
    return streak;
  };

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-mood-great" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-mood-bad" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendLabel = (trend: "up" | "down" | "stable") => trend === "stable" ? t("wellness.stable") : t("wellness.vsLastWeek");

  if (loading) return (
    <Card><CardHeader className="pb-2"><CardTitle className="text-lg">{t("wellness.weeklySummary")}</CardTitle></CardHeader>
      <CardContent className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></CardContent></Card>
  );

  if (!stats || stats.daysLogged === 0) return (
    <Card><CardHeader className="pb-2"><CardTitle className="text-lg">{t("wellness.weeklySummary")}</CardTitle></CardHeader>
      <CardContent><p className="text-sm text-muted-foreground text-center py-4">{t("wellness.noDataYet")}</p></CardContent></Card>
  );

  const summaryItems = [
    { icon: Sun, label: t("wellness.avgSleep"), value: `${stats.avgSleep}`, unit: t("wellness.hrsDay"), trend: stats.sleepTrend, color: "text-mood-okay" },
    { icon: Droplets, label: t("wellness.avgWater"), value: `${stats.avgWater}`, unit: t("wellness.glassesDay"), trend: stats.waterTrend, color: "text-primary" },
    { icon: Activity, label: t("wellness.avgExercise"), value: `${stats.avgExercise}`, unit: t("wellness.minDay"), trend: stats.exerciseTrend, color: "text-mood-great" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg truncate">{t("wellness.weeklySummary")}</CardTitle>
          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
            {stats.daysLogged} {stats.daysLogged !== 1 ? t("wellness.daysLoggedPlural") : t("wellness.daysLogged")}
          </span>
        </div>
        {(stats.streakDays > 0 || stats.streakWeeks > 0) && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {stats.streakDays > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 border border-accent/30">
                <Flame className="h-4 w-4 text-accent animate-pulse-soft" />
                <span className="text-xs font-bold text-accent">{stats.streakDays}d</span>
                <span className="text-[10px] text-muted-foreground">{t("common.streak")}</span>
              </div>
            )}
            {stats.streakWeeks > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 border border-primary/30">
                <Flame className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-primary">{stats.streakWeeks}w</span>
                <span className="text-[10px] text-muted-foreground">{t("common.streak")}</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {summaryItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 gap-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <item.icon className={`h-5 w-5 shrink-0 ${item.color}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.label}</p>
                <p className="text-xs text-muted-foreground truncate">{item.unit}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xl font-display font-bold text-foreground">{item.value}</span>
              <div className="flex flex-col items-end">
                <TrendIcon trend={item.trend} />
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{getTrendLabel(item.trend)}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
