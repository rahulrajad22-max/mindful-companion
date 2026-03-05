import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, CheckCircle2, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Book } from "@/data/mentalHealthBooks";

interface ReadingProgressData {
  book_id: string;
  current_chapter: number;
  total_chapters: number;
  completed: boolean;
  last_read_at: string;
}

interface BookReaderProps {
  book: Book;
  progress?: ReadingProgressData;
  onUpdateProgress: (bookId: string, chapter: number, totalChapters: number) => Promise<void>;
  onBack: () => void;
}

export function BookReader({ book, progress, onUpdateProgress, onBack }: BookReaderProps) {
  const [currentChapter, setCurrentChapter] = useState(
    progress ? Math.min(progress.current_chapter, book.totalChapters) : 1
  );

  const chapter = book.chapters.find((c) => c.id === currentChapter);
  const progressPercent = Math.round((currentChapter / book.totalChapters) * 100);

  const goToChapter = async (chapterNum: number) => {
    setCurrentChapter(chapterNum);
    await onUpdateProgress(book.id, chapterNum, book.totalChapters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ParallaxBackground variant="page" />
      <main className="container py-8 max-w-3xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 animate-fade-up">
          <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Library
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {currentChapter}/{book.totalChapters}
            </span>
            <Progress value={progressPercent} className="w-24 h-1.5" />
            {progressPercent === 100 && (
              <Badge className="text-[10px] bg-mood-great/20 text-mood-great border-mood-great/30">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Done
              </Badge>
            )}
          </div>
        </div>

        {/* Book header */}
        <div className="text-center mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="text-5xl mb-3">{book.coverEmoji}</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{book.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
        </div>

        {/* Chapter navigation pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 animate-fade-up" style={{ animationDelay: "150ms" }}>
          {book.chapters.map((ch) => (
            <Button
              key={ch.id}
              variant={currentChapter === ch.id ? "default" : "outline"}
              size="sm"
              className="rounded-xl text-xs whitespace-nowrap flex-shrink-0"
              onClick={() => goToChapter(ch.id)}
            >
              {ch.id}. {ch.title}
            </Button>
          ))}
        </div>

        {/* Chapter content */}
        {chapter && (
          <Card className="gradient-card border-border/30 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Badge variant="secondary" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" /> Chapter {chapter.id}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" /> {chapter.readingTime} min read
                </Badge>
              </div>

              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none
                prose-headings:font-display prose-headings:text-foreground
                prose-p:text-foreground/80 prose-p:leading-relaxed
                prose-strong:text-foreground
                prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-blockquote:italic
                prose-li:text-foreground/80
                prose-table:text-sm
                prose-th:text-foreground prose-td:text-foreground/80
                prose-th:border-border prose-td:border-border
                prose-hr:border-border">
                <ReactMarkdown>{chapter.content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom navigation */}
        <div className="flex items-center justify-between mt-6 mb-12 animate-fade-up" style={{ animationDelay: "250ms" }}>
          <Button
            variant="outline"
            className="rounded-xl gap-2"
            disabled={currentChapter <= 1}
            onClick={() => goToChapter(currentChapter - 1)}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>

          {currentChapter < book.totalChapters ? (
            <Button
              className="rounded-xl gap-2"
              onClick={() => goToChapter(currentChapter + 1)}
            >
              Next Chapter <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              className="rounded-xl gap-2 bg-mood-great hover:bg-mood-great/90"
              onClick={() => goToChapter(book.totalChapters)}
            >
              <CheckCircle2 className="h-4 w-4" /> Mark Complete
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
