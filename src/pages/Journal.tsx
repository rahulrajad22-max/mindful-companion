import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  BookOpen, 
  Calendar, 
  Sparkles, 
  Send, 
  Clock,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JournalEntryData {
  id: string;
  date: string;
  time: string;
  content: string;
  mood: string;
  sentiment: "positive" | "neutral" | "negative";
}

const sampleEntries: JournalEntryData[] = [
  {
    id: "1",
    date: "Today",
    time: "9:30 AM",
    content: "Started the morning with a meditation session. Feeling centered and ready for the day ahead. Had a good conversation with a friend which lifted my spirits.",
    mood: "😊",
    sentiment: "positive",
  },
  {
    id: "2",
    date: "Yesterday",
    time: "8:15 PM",
    content: "Work was challenging today but I managed to complete all my tasks. Feeling a bit tired but accomplished. Need to remember to take more breaks.",
    mood: "🙂",
    sentiment: "neutral",
  },
  {
    id: "3",
    date: "2 days ago",
    time: "7:00 PM",
    content: "Had some anxiety about the upcoming presentation but practiced deep breathing which helped. Went for a walk in the evening which cleared my mind.",
    mood: "😐",
    sentiment: "neutral",
  },
];

const journalPrompts = [
  "What are three things you're grateful for today?",
  "Describe a moment that made you smile recently.",
  "What's one thing you'd like to let go of?",
  "What are you looking forward to?",
  "How did you practice self-care today?",
];

export default function Journal() {
  const [newEntry, setNewEntry] = useState("");
  const [entries, setEntries] = useState(sampleEntries);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const handleSave = () => {
    if (!newEntry.trim()) return;

    const newEntryData: JournalEntryData = {
      id: Date.now().toString(),
      date: "Just now",
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      content: newEntry,
      mood: "🙂",
      sentiment: "neutral",
    };

    setEntries([newEntryData, ...entries]);
    setNewEntry("");
    setSelectedPrompt(null);
  };

  const usePrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setNewEntry(`${prompt}\n\n`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm">Your Private Journal</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Reflect & Express
          </h1>
          <p className="text-muted-foreground mt-2">
            Write freely. Your thoughts are encrypted and private.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Writing Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* New Entry Card */}
            <Card className="gradient-card border-border/30 animate-fade-up">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-5 w-5 text-primary" />
                  New Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="What's on your mind? Write about your feelings, experiences, or anything you want to reflect on..."
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  className="min-h-[200px] resize-none rounded-xl border-border/50 bg-background/50 focus:border-primary/50 focus:ring-primary/20 text-base leading-relaxed"
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {newEntry.length} characters
                  </p>
                  <Button onClick={handleSave} disabled={!newEntry.trim()} className="gap-2">
                    <Send className="h-4 w-4" />
                    Save Entry
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Past Entries */}
            <div className="space-y-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Recent Entries
              </h2>

              {entries.map((entry, index) => (
                <Card 
                  key={entry.id} 
                  className="border-border/30 hover:border-primary/20 transition-all cursor-pointer group"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
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
                        entry.sentiment === "negative" && "bg-mood-low/20 text-mood-low"
                      )}>
                        {entry.sentiment}
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {entry.content}
                    </p>
                    <div className="mt-3 flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Read more <ChevronRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Writing Prompts */}
            <Card className="animate-fade-up" style={{ animationDelay: "100ms" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Writing Prompts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {journalPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left h-auto py-3 px-3",
                      selectedPrompt === prompt && "bg-primary-soft border border-primary/30"
                    )}
                    onClick={() => usePrompt(prompt)}
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {prompt}
                    </p>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Journal Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total entries</span>
                  <span className="font-display text-xl font-bold text-foreground">{entries.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">This week</span>
                  <span className="font-display text-xl font-bold text-primary">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Streak</span>
                  <span className="font-display text-xl font-bold text-mood-great">5 days</span>
                </div>
              </CardContent>
            </Card>

            {/* Tip */}
            <div className="p-4 rounded-2xl bg-primary-soft border border-primary/20 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <p className="text-sm text-primary font-medium mb-1">💡 Journaling Tip</p>
              <p className="text-sm text-muted-foreground">
                Try to write at the same time each day to build a consistent reflection habit.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
