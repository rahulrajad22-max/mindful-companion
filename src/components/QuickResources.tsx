import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Wind, Heart, Phone, ExternalLink } from "lucide-react";

type ResourceType = "breathing" | "gratitude" | "crisis" | null;

export function QuickResources() {
  const [activeResource, setActiveResource] = useState<ResourceType>(null);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathingCount, setBreathingCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);

  const gratitudePrompts = [
    "What made you smile today?",
    "Who in your life are you grateful for?",
    "What small comfort do you appreciate?",
    "What ability or skill are you thankful for?",
    "What experience shaped you positively?",
  ];

  const [currentPrompt] = useState(
    gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)]
  );

  const startBreathingExercise = () => {
    setIsBreathing(true);
    setBreathingCount(0);
    runBreathingCycle(0);
  };

  const runBreathingCycle = (cycle: number) => {
    if (cycle >= 3) {
      setIsBreathing(false);
      return;
    }

    setBreathingPhase("inhale");
    setBreathingCount(4);

    // Inhale for 4 seconds
    let count = 4;
    const inhaleInterval = setInterval(() => {
      count--;
      setBreathingCount(count);
      if (count <= 0) {
        clearInterval(inhaleInterval);
        
        // Hold for 7 seconds
        setBreathingPhase("hold");
        setBreathingCount(7);
        let holdCount = 7;
        const holdInterval = setInterval(() => {
          holdCount--;
          setBreathingCount(holdCount);
          if (holdCount <= 0) {
            clearInterval(holdInterval);
            
            // Exhale for 8 seconds
            setBreathingPhase("exhale");
            setBreathingCount(8);
            let exhaleCount = 8;
            const exhaleInterval = setInterval(() => {
              exhaleCount--;
              setBreathingCount(exhaleCount);
              if (exhaleCount <= 0) {
                clearInterval(exhaleInterval);
                runBreathingCycle(cycle + 1);
              }
            }, 1000);
          }
        }, 1000);
      }
    }, 1000);
  };

  const crisisResources = [
    { name: "National Suicide Prevention Lifeline", number: "988", description: "24/7, free, confidential" },
    { name: "Crisis Text Line", number: "Text HOME to 741741", description: "Free, 24/7 support" },
    { name: "SAMHSA National Helpline", number: "1-800-662-4357", description: "Treatment referral service" },
  ];

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Quick Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left h-auto py-3"
            onClick={() => setActiveResource("breathing")}
          >
            <Wind className="h-5 w-5 mr-3 text-primary" />
            <div>
              <p className="font-medium">Breathing Exercise</p>
              <p className="text-xs text-muted-foreground">4-7-8 calming technique</p>
            </div>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left h-auto py-3"
            onClick={() => setActiveResource("gratitude")}
          >
            <Heart className="h-5 w-5 mr-3 text-accent" />
            <div>
              <p className="font-medium">Gratitude Prompt</p>
              <p className="text-xs text-muted-foreground">Quick reflection starter</p>
            </div>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left h-auto py-3"
            onClick={() => setActiveResource("crisis")}
          >
            <Phone className="h-5 w-5 mr-3 text-destructive" />
            <div>
              <p className="font-medium">Crisis Hotlines</p>
              <p className="text-xs text-muted-foreground">24/7 professional support</p>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Breathing Exercise Dialog */}
      <Dialog open={activeResource === "breathing"} onOpenChange={(open) => !open && setActiveResource(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">4-7-8 Breathing Exercise</DialogTitle>
            <DialogDescription>
              This technique helps calm your nervous system
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center">
            {!isBreathing ? (
              <div className="space-y-6">
                <div className="space-y-2 text-muted-foreground text-sm">
                  <p>• Breathe in through your nose for 4 seconds</p>
                  <p>• Hold your breath for 7 seconds</p>
                  <p>• Exhale slowly through your mouth for 8 seconds</p>
                </div>
                <Button onClick={startBreathingExercise} size="lg" className="gap-2">
                  <Wind className="h-5 w-5" />
                  Start Exercise
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div 
                  className={`
                    w-32 h-32 mx-auto rounded-full flex items-center justify-center
                    transition-all duration-1000
                    ${breathingPhase === "inhale" ? "scale-125 bg-primary/20" : ""}
                    ${breathingPhase === "hold" ? "scale-125 bg-mood-okay/20" : ""}
                    ${breathingPhase === "exhale" ? "scale-75 bg-secondary/30" : ""}
                  `}
                >
                  <div className="text-center">
                    <p className="text-4xl font-display font-bold text-foreground">
                      {breathingCount}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {breathingPhase}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {breathingPhase === "inhale" && "Breathe in slowly through your nose..."}
                  {breathingPhase === "hold" && "Hold your breath gently..."}
                  {breathingPhase === "exhale" && "Exhale slowly through your mouth..."}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Gratitude Prompt Dialog */}
      <Dialog open={activeResource === "gratitude"} onOpenChange={(open) => !open && setActiveResource(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Gratitude Reflection</DialogTitle>
            <DialogDescription>
              Take a moment to reflect on this prompt
            </DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-soft to-secondary text-center">
              <Heart className="h-8 w-8 mx-auto mb-4 text-accent" />
              <p className="text-xl font-display font-semibold text-foreground">
                {currentPrompt}
              </p>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Consider writing your thoughts in your journal
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Crisis Resources Dialog */}
      <Dialog open={activeResource === "crisis"} onOpenChange={(open) => !open && setActiveResource(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Crisis Support Resources</DialogTitle>
            <DialogDescription>
              Professional help is available 24/7
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {crisisResources.map((resource, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl border border-border bg-card"
              >
                <h4 className="font-semibold text-foreground">{resource.name}</h4>
                <p className="text-lg font-display font-bold text-primary mt-1">
                  {resource.number}
                </p>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </div>
            ))}
            <div className="pt-2">
              <a 
                href="https://findahelpline.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                Find more resources worldwide
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
