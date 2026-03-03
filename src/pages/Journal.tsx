import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AIAnalysisCard, JournalAnalysis } from "@/components/AIAnalysisCard";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { useJournalAnalysis } from "@/hooks/useJournalAnalysis";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, Sparkles, Send, Clock, ChevronRight, Brain, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Journal() {
  const { t } = useTranslation();
  const [newEntry, setNewEntry] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const { analysis, isLoading: isAnalyzing, error, analyzeEntry, clearAnalysis } = useJournalAnalysis();
  const { loading, entries, stats, saveEntry, refetch } = useJournalEntries();
  const { toast } = useToast();

  const journalPrompts = [
    t("journal.prompts.p1"), t("journal.prompts.p2"), t("journal.prompts.p3"),
    t("journal.prompts.p4"), t("journal.prompts.p5"),
  ];

  const handleSave = async () => {
    if (!newEntry.trim()) return;
    const result = await analyzeEntry(newEntry);
    try {
      await saveEntry(newEntry, result || undefined);
      toast({
        title: t("journal.entrySaved"),
        description: result ? t("journal.entrySavedDesc") : t("journal.entrySavedNoAnalysis"),
      });
      setNewEntry("");
      setSelectedPrompt(null);
    } catch (error) {
      toast({ title: t("common.error"), description: t("journal.entryError"), variant: "destructive" });
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setNewEntry((prev) => prev + (prev ? " " : "") + text);
    if (analysis) clearAnalysis();
  };

  const usePrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setNewEntry(`${prompt}\n\n`);
    clearAnalysis();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ParallaxBackground variant="subtle" />
      <main className="container py-8">
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm">{t("journal.badge")}</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">{t("journal.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("journal.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="gradient-card border-border/30 animate-fade-up">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {t("journal.newEntry")}
                  {isAnalyzing && (
                    <span className="text-xs text-muted-foreground font-normal ml-auto flex items-center gap-1">
                      <Brain className="h-3 w-3 animate-pulse" />
                      {t("journal.aiAnalyzing")}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={t("journal.placeholder")}
                  value={newEntry}
                  onChange={(e) => { setNewEntry(e.target.value); if (analysis) clearAnalysis(); }}
                  className="min-h-[200px] resize-none rounded-xl border-border/50 bg-background/50 focus:border-primary/50 focus:ring-primary/20 text-base leading-relaxed"
                  disabled={isAnalyzing}
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <VoiceRecorder onTranscript={handleVoiceTranscript} disabled={isAnalyzing} />
                    <p className="text-xs text-muted-foreground">
                      {newEntry.length} {t("journal.characters")} • {t("journal.aiWillAnalyze")}
                    </p>
                  </div>
                  <Button onClick={handleSave} disabled={!newEntry.trim() || isAnalyzing} className="gap-2">
                    {isAnalyzing ? (
                      <><Brain className="h-4 w-4 animate-pulse" />{t("journal.analyzing")}</>
                    ) : (
                      <><Send className="h-4 w-4" />{t("journal.saveAnalyze")}</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
              <AIAnalysisCard analysis={analysis} isLoading={isAnalyzing} error={error} />
            </div>

            <div className="space-y-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                {t("journal.recentEntries")}
              </h2>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : entries.length === 0 ? (
                <Card className="border-border/30">
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">{t("journal.noEntries")}</p>
                  </CardContent>
                </Card>
              ) : (
                entries.map((entry, index) => (
                  <Card key={entry.id} className="border-border/30 hover:border-primary/20 transition-all cursor-pointer group" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{entry.mood}</span>
                          <div>
                            <p className="font-medium text-foreground">{entry.date}</p>
                            <p className="text-xs text-muted-foreground">{entry.time}</p>
                          </div>
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          entry.sentiment === "positive" && "bg-mood-great/20 text-mood-great",
                          entry.sentiment === "neutral" && "bg-primary/10 text-primary",
                          entry.sentiment === "negative" && "bg-mood-low/20 text-mood-low",
                          entry.sentiment === "mixed" && "bg-secondary/50 text-secondary-foreground"
                        )}>
                          {entry.sentiment}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed line-clamp-3">{entry.content}</p>
                      <div className="mt-3 flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        {t("journal.readMore")} <ChevronRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="animate-fade-up" style={{ animationDelay: "100ms" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {t("journal.writingPrompts")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {journalPrompts.map((prompt, index) => (
                  <Button key={index} variant="ghost" className={cn("w-full justify-start text-left h-auto py-3 px-3 whitespace-normal", selectedPrompt === prompt && "bg-primary-soft border border-primary/30")} onClick={() => usePrompt(prompt)} disabled={isAnalyzing}>
                    <p className="text-sm text-muted-foreground leading-relaxed break-words overflow-hidden">{prompt}</p>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t("journal.stats")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("journal.totalEntries")}</span>
                  <span className="font-display text-xl font-bold text-foreground">{stats.totalEntries}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("journal.thisWeek")}</span>
                  <span className="font-display text-xl font-bold text-primary">{stats.thisWeek}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("journal.streak")}</span>
                  <span className="font-display text-xl font-bold text-mood-great">{stats.streak} {stats.streak !== 1 ? t("common.days") : t("common.day")}</span>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 rounded-2xl bg-primary-soft border border-primary/20 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <p className="text-sm text-primary font-medium mb-1 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                {t("journal.aiInsightsInfo")}
              </p>
              <p className="text-sm text-muted-foreground">{t("journal.aiInsightsDesc")}</p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/50 border border-border/30 animate-fade-up" style={{ animationDelay: "400ms" }}>
              <p className="text-sm text-foreground font-medium mb-1">{t("journal.journalingTip")}</p>
              <p className="text-sm text-muted-foreground">{t("journal.journalingTipDesc")}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
