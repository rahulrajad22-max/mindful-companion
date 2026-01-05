import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Sun, Moon, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

type InsightType = "sentiment" | "suggestion" | "pattern" | "wellness";

interface InsightCardProps {
  type: InsightType;
  title: string;
  description: string;
  level?: "positive" | "neutral" | "attention";
}

const iconMap: Record<InsightType, React.ElementType> = {
  sentiment: Brain,
  suggestion: Heart,
  pattern: Activity,
  wellness: Sun,
};

const levelStyles: Record<string, string> = {
  positive: "border-mood-great/30 bg-mood-great/5",
  neutral: "border-primary/30 bg-primary-soft",
  attention: "border-mood-low/30 bg-mood-low/5",
};

export function InsightCard({ type, title, description, level = "neutral" }: InsightCardProps) {
  const Icon = iconMap[type];

  return (
    <Card className={cn("border transition-all hover:shadow-elevated", levelStyles[level])}>
      <CardContent className="p-4 flex gap-4 items-start">
        <div className={cn(
          "p-2 rounded-xl",
          level === "positive" && "bg-mood-great/20",
          level === "neutral" && "bg-primary/10",
          level === "attention" && "bg-mood-low/20"
        )}>
          <Icon className={cn(
            "h-5 w-5",
            level === "positive" && "text-mood-great",
            level === "neutral" && "text-primary",
            level === "attention" && "text-mood-low"
          )} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
