import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <Card 
      className="group border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="p-3 rounded-2xl bg-primary-soft group-hover:bg-primary/10 transition-colors duration-300 mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
