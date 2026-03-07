import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, CheckCircle2, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ChapterQuiz } from "@/components/chapter/ChapterQuiz";
import { ChapterReflection } from "@/components/chapter/ChapterReflection";
import { ChapterCheckpoint } from "@/components/chapter/ChapterCheckpoint";
import type { Book, InteractiveElement } from "@/data/mentalHealthBooks";

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

function renderInteractive(el: InteractiveElement, i: number) {
  switch (el.type) {
    case "quiz":
      return <ChapterQuiz key={`quiz-${i}`} quiz={el} index={i} />;
    case "reflection":
      return <ChapterReflection key={`ref-${i}`} prompt={el.prompt} placeholder={el.placeholder} index={i} />;
    case "checkpoint":
      return <ChapterCheckpoint key={`cp-${i}`} title={el.title} checklist={el.checklist} index={i} />;
  }
}

export function BookReader({ book, progress, onUpdateProgress, onBack }: BookReaderProps) {
  const [currentChapter, setCurrentChapter] = useState(
    progress ? Math.min(progress.current_chapter, book.totalChapters) : 1
  );
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipState, setFlipState] = useState<"idle" | "flipping-forward" | "flipping-back">("idle");

  const chapter = book.chapters.find((c) => c.id === currentChapter);
  const progressPercent = Math.round((currentChapter / book.totalChapters) * 100);

  const goToChapter = useCallback(
    async (chapterNum: number, direction: "forward" | "back") => {
      if (isFlipping || chapterNum < 1 || chapterNum > book.totalChapters) return;
      setIsFlipping(true);
      setFlipState(direction === "forward" ? "flipping-forward" : "flipping-back");

      setTimeout(async () => {
        setCurrentChapter(chapterNum);
        await onUpdateProgress(book.id, chapterNum, book.totalChapters);
        setFlipState("idle");
        setIsFlipping(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 600);
    },
    [isFlipping, book.id, book.totalChapters, onUpdateProgress]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ParallaxBackground variant="subtle" />
      <main className="container py-6 max-w-4xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4 animate-fade-up">
          <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl gap-2">
            <ArrowLeft className="h-4 w-4" /> Library
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Ch. {currentChapter}/{book.totalChapters}
            </span>
            <Progress value={progressPercent} className="w-20 h-1.5" />
            {progressPercent === 100 && (
              <Badge className="text-[10px] bg-mood-great/20 text-mood-great border-mood-great/30">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Done
              </Badge>
            )}
          </div>
        </div>

        {/* Book */}
        <div
          className="animate-fade-up mx-auto"
          style={{ perspective: "2200px", animationDelay: "100ms" }}
        >
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute -left-1 top-2 bottom-2 w-4 rounded-l-md z-20 pointer-events-none"
              style={{ background: "linear-gradient(to right, hsl(var(--foreground)/0.10), transparent)" }}
            />
            <div className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-r-md rounded-l-sm bg-muted/50 border border-border/20" />
            <div className="absolute inset-0 translate-x-[6px] translate-y-[6px] rounded-r-md rounded-l-sm bg-muted/30 border border-border/10" />

            <div
              className={`relative z-10 transition-transform duration-[600ms] ease-in-out origin-left
                ${flipState === "flipping-forward" ? "[transform:rotateY(-90deg)]" : ""}
                ${flipState === "flipping-back" ? "[transform:rotateY(90deg)]" : ""}
                ${flipState === "idle" ? "[transform:rotateY(0deg)]" : ""}
              `}
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            >
              <div
                className="rounded-r-md rounded-l-sm border border-border/40 overflow-hidden"
                style={{
                  background: "var(--gradient-card)",
                  boxShadow: "inset -4px 0 12px hsl(var(--foreground)/0.04), 6px 4px 24px hsl(var(--foreground)/0.08)",
                }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-3 pointer-events-none z-10"
                  style={{
                    background: "repeating-linear-gradient(to right, transparent, transparent 1px, hsl(var(--border)) 1px, hsl(var(--border)) 1.5px)",
                    opacity: 0.35,
                  }}
                />

                {chapter && (
                  <div className="relative p-6 sm:p-8 md:p-12 min-h-[55vh]">
                    <span className="absolute top-4 right-6 text-[11px] text-muted-foreground/30 font-display select-none">
                      {currentChapter} / {book.totalChapters}
                    </span>

                    <div className="mb-8 pb-4 border-b border-border/40">
                      <div className="text-4xl mb-3 text-center">{book.coverEmoji}</div>
                      <h2 className="font-display text-xl md:text-2xl font-bold text-foreground text-center leading-snug">
                        {chapter.title}
                      </h2>
                      <p className="text-xs text-muted-foreground text-center mt-2">{book.title}</p>
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <Badge variant="secondary" className="text-[10px]">
                          <BookOpen className="h-3 w-3 mr-1" /> Chapter {chapter.id}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          <Clock className="h-3 w-3 mr-1" /> {chapter.readingTime} min
                        </Badge>
                      </div>
                    </div>

                    {/* Markdown body */}
                    <div
                      className="prose prose-sm md:prose-base dark:prose-invert max-w-none
                        prose-headings:font-display prose-headings:text-foreground
                        prose-p:text-foreground/80 prose-p:leading-[1.85]
                        prose-strong:text-foreground
                        prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-blockquote:italic prose-blockquote:pl-4
                        prose-li:text-foreground/80
                        prose-table:text-sm prose-th:text-foreground prose-td:text-foreground/80
                        prose-th:border-border prose-td:border-border
                        prose-hr:border-border"
                    >
                      <ReactMarkdown>{chapter.content}</ReactMarkdown>
                    </div>

                    {/* Interactive elements */}
                    {chapter.interactives && chapter.interactives.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-border/30 space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-4">
                          📝 Interactive Activities
                        </p>
                        {chapter.interactives.map((el, i) => renderInteractive(el, i))}
                      </div>
                    )}

                    <div className="absolute bottom-0 right-0 w-14 h-14 pointer-events-none overflow-hidden">
                      <div
                        className="absolute bottom-0 right-0 w-20 h-20 rounded-tl-2xl"
                        style={{ background: "linear-gradient(135deg, transparent 50%, hsl(var(--muted)/0.5) 50%)" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between mt-8 mb-12 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <Button
            variant="outline"
            className="rounded-xl gap-2 shadow-soft"
            disabled={currentChapter <= 1 || isFlipping}
            onClick={() => goToChapter(currentChapter - 1, "back")}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>

          <div className="flex gap-1.5 items-center">
            {book.chapters.map((ch) => (
              <button
                key={ch.id}
                disabled={isFlipping}
                onClick={() => {
                  if (ch.id !== currentChapter)
                    goToChapter(ch.id, ch.id > currentChapter ? "forward" : "back");
                }}
                className={`rounded-full transition-all duration-300 cursor-pointer
                  ${ch.id === currentChapter
                    ? "w-6 h-2 bg-primary"
                    : ch.id < currentChapter
                    ? "w-2 h-2 bg-primary/40 hover:bg-primary/60"
                    : "w-2 h-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                  }`}
              />
            ))}
          </div>

          {currentChapter < book.totalChapters ? (
            <Button
              className="rounded-xl gap-2 shadow-soft"
              disabled={isFlipping}
              onClick={() => goToChapter(currentChapter + 1, "forward")}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              className="rounded-xl gap-2 bg-mood-great hover:bg-mood-great/90 shadow-soft"
              disabled={isFlipping}
              onClick={() => goToChapter(book.totalChapters, "forward")}
            >
              <CheckCircle2 className="h-4 w-4" /> Complete
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
