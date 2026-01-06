import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TimeRangeToggle, TimeRange } from "./TimeRangeToggle";

interface SentimentDataPoint {
  date: string;
  sentiment: number; // -1 to 1 scale
  stressLevel: number; // 0-100 scale
  mood: number; // 1-5 scale
}

interface SentimentTrendsChartProps {
  data: SentimentDataPoint[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

const getSentimentLabel = (value: number): string => {
  if (value >= 0.5) return "Very Positive";
  if (value >= 0.2) return "Positive";
  if (value >= -0.2) return "Neutral";
  if (value >= -0.5) return "Negative";
  return "Very Negative";
};

const getStressLabel = (value: number): string => {
  if (value >= 70) return "High";
  if (value >= 40) return "Moderate";
  return "Low";
};

const getTrendIcon = (data: SentimentDataPoint[]) => {
  if (data.length < 2) return <Minus className="h-4 w-4" />;
  const recent = data.slice(-3);
  const avg = recent.reduce((sum, d) => sum + d.sentiment, 0) / recent.length;
  const earlier = data.slice(0, 3);
  const earlierAvg = earlier.reduce((sum, d) => sum + d.sentiment, 0) / earlier.length;
  
  if (avg > earlierAvg + 0.1) return <TrendingUp className="h-4 w-4 text-mood-great" />;
  if (avg < earlierAvg - 0.1) return <TrendingDown className="h-4 w-4 text-mood-bad" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

export function SentimentTrendsChart({ data, timeRange, onTimeRangeChange }: SentimentTrendsChartProps) {
  const averageSentiment = data.length > 0 
    ? data.reduce((sum, d) => sum + d.sentiment, 0) / data.length 
    : 0;
  
  const averageStress = data.length > 0 
    ? data.reduce((sum, d) => sum + d.stressLevel, 0) / data.length 
    : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl bg-card border border-border/50 p-4 shadow-elevated min-w-[180px]">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Sentiment:</span>
              <Badge variant={payload[0]?.value >= 0 ? "default" : "destructive"} className="text-xs">
                {getSentimentLabel(payload[0]?.value || 0)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Stress:</span>
              <span className="text-xs font-medium text-foreground">
                {getStressLabel(payload[1]?.value || 0)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="gradient-card border-border/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            Sentiment Analysis
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {getTrendIcon(data)}
              <span className="text-sm text-muted-foreground">{timeRange === 'weekly' ? '7-day' : '30-day'} trend</span>
            </div>
            <TimeRangeToggle value={timeRange} onChange={onTimeRangeChange} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-xl bg-primary-soft">
            <p className="text-xs text-muted-foreground mb-1">Avg Sentiment</p>
            <p className="text-lg font-display font-bold text-foreground">
              {getSentimentLabel(averageSentiment)}
            </p>
            <div className="h-1.5 w-full bg-muted rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((averageSentiment + 1) / 2) * 100}%` }}
              />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-secondary">
            <p className="text-xs text-muted-foreground mb-1">Avg Stress</p>
            <p className="text-lg font-display font-bold text-foreground">
              {getStressLabel(averageStress)}
            </p>
            <div className="h-1.5 w-full bg-muted rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${averageStress}%`,
                  backgroundColor: averageStress > 70 
                    ? 'hsl(var(--mood-bad))' 
                    : averageStress > 40 
                      ? 'hsl(var(--mood-okay))' 
                      : 'hsl(var(--mood-great))'
                }}
              />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <YAxis
                yAxisId="sentiment"
                domain={[-1, 1]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickFormatter={(value) => value === 1 ? "+" : value === -1 ? "-" : "○"}
              />
              <YAxis
                yAxisId="stress"
                orientation="right"
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="sentiment"
                type="monotone"
                dataKey="sentiment"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#sentimentGradient)"
                name="Sentiment"
              />
              <Area
                yAxisId="stress"
                type="monotone"
                dataKey="stressLevel"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#stressGradient)"
                name="Stress"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Sentiment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 border-t-2 border-dashed border-accent" />
            <span className="text-xs text-muted-foreground">Stress Level</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
