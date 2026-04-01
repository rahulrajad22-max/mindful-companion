import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Crown, Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface LeaderboardEntry {
  display_name: string | null;
  total_score: number;
  games_played: number;
  user_id: string;
}

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}

export function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Record<string, LeaderboardEntry[]>>({
    all: [],
    trivia: [],
    memory: [],
    puzzle: [],
  });
  const weekStart = getWeekStart();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const gameTypes = ["all", "trivia", "memory", "puzzle"];
    const results: Record<string, LeaderboardEntry[]> = { all: [], trivia: [], memory: [], puzzle: [] };

    for (const type of gameTypes) {
      let query = supabase
        .from("game_scores")
        .select("user_id, display_name, score, game_type")
        .eq("week_start", weekStart);

      if (type !== "all") {
        query = query.eq("game_type", type);
      }

      const { data: scores } = await query;
      if (scores) {
        const grouped: Record<string, { total: number; count: number; name: string | null }> = {};
        scores.forEach((s) => {
          if (!grouped[s.user_id]) grouped[s.user_id] = { total: 0, count: 0, name: s.display_name };
          grouped[s.user_id].total += s.score;
          grouped[s.user_id].count += 1;
        });
        results[type] = Object.entries(grouped)
          .map(([uid, v]) => ({ user_id: uid, display_name: v.name, total_score: v.total, games_played: v.count }))
          .sort((a, b) => b.total_score - a.total_score)
          .slice(0, 10);
      }
    }
    setData(results);
    setLoading(false);
  };

  const rankIcon = (i: number) => {
    if (i === 0) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (i === 1) return <Medal className="h-4 w-4 text-gray-400" />;
    if (i === 2) return <Medal className="h-4 w-4 text-amber-600" />;
    return <span className="text-xs font-bold text-muted-foreground w-4 text-center">{i + 1}</span>;
  };

  const renderList = (entries: LeaderboardEntry[]) => {
    if (loading) return Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />);
    if (entries.length === 0) return <p className="text-sm text-muted-foreground text-center py-6">No scores this week yet. Be the first!</p>;

    return entries.map((entry, i) => (
      <div key={entry.user_id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${i === 0 ? "bg-primary/10 border border-primary/20" : "bg-muted/30"}`}>
        {rankIcon(i)}
        <span className="flex-1 text-sm font-medium text-foreground truncate">{entry.display_name || "Anonymous Player"}</span>
        <span className="text-xs text-muted-foreground">{entry.games_played} games</span>
        <Badge variant={i === 0 ? "default" : "secondary"} className="font-bold">{entry.total_score} pts</Badge>
      </div>
    ));
  };

  return (
    <Card className="border-border/30">
      <div className="px-5 py-4 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-bold text-foreground">Weekly Leaderboard</h3>
        </div>
        <Badge variant="outline" className="text-xs"><Timer className="h-3 w-3 mr-1" />Resets Monday</Badge>
      </div>
      <CardContent className="p-4">
        <Tabs defaultValue="all">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="trivia">Trivia</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="puzzle">Puzzle</TabsTrigger>
          </TabsList>
          {["all", "trivia", "memory", "puzzle"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-2">
              {renderList(data[tab])}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
