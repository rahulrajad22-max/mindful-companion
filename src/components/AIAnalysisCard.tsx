import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Heart, 
  Lightbulb, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface JournalAnalysis {
  sentiment: "positive" | "neutral" | "negative" | "mixed";
  sentimentScore: number;
  stressLevel: "low" | "medium" | "high";
  emotionsDetected: string[];
  supportiveResponse: string;
  selfCareRecommendations: string[];
  patterns: string[];
  disclaimer: string;
}

interface AIAnalysisCardProps {
  analysis: JournalAnalysis | null;
  isLoading: boolean;
  error: string | null;
}

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return <TrendingUp className="h-4 w-4 text-mood-great" />;
    case "negative":
      return <TrendingDown className="h-4 w-4 text-mood-low" />;
    default:
      return <Minus className="h-4 w-4 text-primary" />;
  }
};

const getStressColor = (level: string) => {
  switch (level) {
    case "low":
      return "bg-mood-great/20 text-mood-great border-mood-great/30";
    case "medium":
      return "bg-primary/20 text-primary border-primary/30";
    case "high":
      return "bg-mood-low/20 text-mood-low border-mood-low/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function AIAnalysisCard({ analysis, isLoading, error }: AIAnalysisCardProps) {
  if (isLoading) {
    return (
      <Card className="gradient-card border-border/30 animate-pulse-soft">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Analyzing your entry...</p>
          <p className="text-xs text-muted-foreground/60">Our AI is reading and understanding your thoughts</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-mood-low/30 bg-mood-low/5">
        <CardContent className="p-6 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-mood-low flex-shrink-0" />
          <p className="text-sm text-mood-low">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="border-dashed border-border/50 bg-transparent">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[150px] gap-2 text-center">
          <Brain className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-muted-foreground text-sm">
            Write a journal entry to receive AI-powered insights
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Supportive Response */}
      <Card className="gradient-card border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            AI Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{analysis.supportiveResponse}</p>
        </CardContent>
      </Card>

      {/* Analysis Overview */}
      <Card className="border-border/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50">
              {getSentimentIcon(analysis.sentiment)}
              <span className="text-sm font-medium capitalize">{analysis.sentiment}</span>
            </div>
            <div className={cn(
              "px-3 py-2 rounded-xl text-sm font-medium border",
              getStressColor(analysis.stressLevel)
            )}>
              Stress: {analysis.stressLevel}
            </div>
          </div>

          {analysis.emotionsDetected.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Emotions detected</p>
              <div className="flex flex-wrap gap-2">
                {analysis.emotionsDetected.map((emotion, i) => (
                  <Badge key={i} variant="secondary" className="capitalize">
                    {emotion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {analysis.patterns.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Patterns observed</p>
              <ul className="space-y-1">
                {analysis.patterns.map((pattern, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {pattern}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Self-Care Recommendations */}
      <Card className="border-border/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-mood-great" />
            Self-Care Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.selfCareRecommendations.map((rec, i) => (
              <li 
                key={i} 
                className="flex items-start gap-3 p-3 rounded-xl bg-mood-great/5 border border-mood-great/10"
              >
                <span className="text-mood-great font-bold">{i + 1}</span>
                <span className="text-sm text-foreground">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground/70 text-center px-4">
        {analysis.disclaimer}
      </p>
    </div>
  );
}
