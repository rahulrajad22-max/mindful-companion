import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Wind, Heart, Phone, ExternalLink } from "lucide-react";

type ResourceType = "breathing" | "gratitude" | "crisis" | null;

export function QuickResources() {
  const { t } = useTranslation();
  const [activeResource, setActiveResource] = useState<ResourceType>(null);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathingCount, setBreathingCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);

  const gratitudePrompts = [
    "What made you smile today?", "Who in your life are you grateful for?",
    "What small comfort do you appreciate?", "What ability or skill are you thankful for?",
    "What experience shaped you positively?",
  ];
  const [currentPrompt] = useState(gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)]);

  const startBreathingExercise = () => {
    setIsBreathing(true); setBreathingCount(0); runBreathingCycle(0);
  };

  const runBreathingCycle = (cycle: number) => {
    if (cycle >= 3) { setIsBreathing(false); return; }
    setBreathingPhase("inhale"); setBreathingCount(4);
    let count = 4;
    const inhaleInterval = setInterval(() => {
      count--; setBreathingCount(count);
      if (count <= 0) {
        clearInterval(inhaleInterval); setBreathingPhase("hold"); setBreathingCount(7);
        let holdCount = 7;
        const holdInterval = setInterval(() => {
          holdCount--; setBreathingCount(holdCount);
          if (holdCount <= 0) {
            clearInterval(holdInterval); setBreathingPhase("exhale"); setBreathingCount(8);
            let exhaleCount = 8;
            const exhaleInterval = setInterval(() => {
              exhaleCount--; setBreathingCount(exhaleCount);
              if (exhaleCount <= 0) { clearInterval(exhaleInterval); runBreathingCycle(cycle + 1); }
            }, 1000);
          }
        }, 1000);
      }
    }, 1000);
  };

  const crisisResources = [
    { name: t("resources.crisisResources.r1Name"), number: t("resources.crisisResources.r1Number"), description: t("resources.crisisResources.r1Desc") },
    { name: t("resources.crisisResources.r2Name"), number: t("resources.crisisResources.r2Number"), description: t("resources.crisisResources.r2Desc") },
    { name: t("resources.crisisResources.r3Name"), number: t("resources.crisisResources.r3Number"), description: t("resources.crisisResources.r3Desc") },
  ];

  return (
    <>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-lg">{t("resources.quickResources")}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-left h-auto py-3" onClick={() => setActiveResource("breathing")}>
            <Wind className="h-5 w-5 mr-3 text-primary" />
            <div><p className="font-medium">{t("resources.breathingExercise")}</p><p className="text-xs text-muted-foreground">{t("resources.breathingDesc")}</p></div>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-left h-auto py-3" onClick={() => setActiveResource("gratitude")}>
            <Heart className="h-5 w-5 mr-3 text-accent" />
            <div><p className="font-medium">{t("resources.gratitudePrompt")}</p><p className="text-xs text-muted-foreground">{t("resources.gratitudeDesc")}</p></div>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-left h-auto py-3" onClick={() => setActiveResource("crisis")}>
            <Phone className="h-5 w-5 mr-3 text-destructive" />
            <div><p className="font-medium">{t("resources.crisisHotlines")}</p><p className="text-xs text-muted-foreground">{t("resources.crisisDesc")}</p></div>
          </Button>
        </CardContent>
      </Card>

      <Dialog open={activeResource === "breathing"} onOpenChange={(open) => !open && setActiveResource(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{t("resources.breathingTitle")}</DialogTitle>
            <DialogDescription>{t("resources.breathingSubtitle")}</DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center">
            {!isBreathing ? (
              <div className="space-y-6">
                <div className="space-y-2 text-muted-foreground text-sm">
                  <p>• {t("resources.breatheIn")}</p>
                  <p>• {t("resources.holdBreath")}</p>
                  <p>• {t("resources.exhaleSlowly")}</p>
                </div>
                <Button onClick={startBreathingExercise} size="lg" className="gap-2">
                  <Wind className="h-5 w-5" />{t("resources.startExercise")}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-1000
                  ${breathingPhase === "inhale" ? "scale-125 bg-primary/20" : ""}
                  ${breathingPhase === "hold" ? "scale-125 bg-mood-okay/20" : ""}
                  ${breathingPhase === "exhale" ? "scale-75 bg-secondary/30" : ""}`}>
                  <div className="text-center">
                    <p className="text-4xl font-display font-bold text-foreground">{breathingCount}</p>
                    <p className="text-sm text-muted-foreground capitalize">{breathingPhase}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {breathingPhase === "inhale" && t("resources.inhale")}
                  {breathingPhase === "hold" && t("resources.hold")}
                  {breathingPhase === "exhale" && t("resources.exhale")}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeResource === "gratitude"} onOpenChange={(open) => !open && setActiveResource(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{t("resources.gratitudeTitle")}</DialogTitle>
            <DialogDescription>{t("resources.gratitudeSubtitle")}</DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-soft to-secondary text-center">
              <Heart className="h-8 w-8 mx-auto mb-4 text-accent" />
              <p className="text-xl font-display font-semibold text-foreground">{currentPrompt}</p>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">{t("resources.writeInJournal")}</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeResource === "crisis"} onOpenChange={(open) => !open && setActiveResource(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{t("resources.crisisTitle")}</DialogTitle>
            <DialogDescription>{t("resources.crisisSubtitle")}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {crisisResources.map((resource, index) => (
              <div key={index} className="p-4 rounded-xl border border-border bg-card">
                <h4 className="font-semibold text-foreground">{resource.name}</h4>
                <p className="text-lg font-display font-bold text-primary mt-1">{resource.number}</p>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </div>
            ))}
            <div className="pt-2">
              <a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                {t("resources.findMore")} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
