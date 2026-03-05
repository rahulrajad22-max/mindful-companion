import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Clock, CheckCircle2, ArrowRight, Library as LibraryIcon } from "lucide-react";
import { mentalHealthBooks, BOOK_CATEGORIES } from "@/data/mentalHealthBooks";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { BookReader } from "@/components/BookReader";

export default function Library() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const { getProgress, updateProgress, loading } = useReadingProgress();

  const filteredBooks = useMemo(() => {
    return mentalHealthBooks.filter((book) => {
      const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeBook = activeBookId ? mentalHealthBooks.find((b) => b.id === activeBookId) : null;

  if (activeBook) {
    return (
      <BookReader
        book={activeBook}
        progress={getProgress(activeBook.id)}
        onUpdateProgress={updateProgress}
        onBack={() => setActiveBookId(null)}
      />
    );
  }

  const totalBooks = mentalHealthBooks.length;
  const completedBooks = mentalHealthBooks.filter((b) => getProgress(b.id)?.completed).length;
  const inProgressBooks = mentalHealthBooks.filter((b) => {
    const p = getProgress(b.id);
    return p && !p.completed;
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ParallaxBackground variant="page" />
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <LibraryIcon className="h-4 w-4" />
            <span className="text-sm">Mental Health Library</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Self-Help Library
          </h1>
          <p className="text-muted-foreground mt-2">
            Read research-backed guides on mental health topics. Track your progress as you learn.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <Card className="border-border/30">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{totalBooks}</p>
                <p className="text-xs text-muted-foreground">Total Books</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/30">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{inProgressBooks}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/30">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-mood-great/10">
                <CheckCircle2 className="h-5 w-5 text-mood-great" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{completedBooks}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-up" style={{ animationDelay: "150ms" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {BOOK_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                className="rounded-xl text-xs"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map((book, i) => {
            const progress = getProgress(book.id);
            const progressPercent = progress
              ? Math.round((progress.current_chapter / progress.total_chapters) * 100)
              : 0;

            return (
              <Card
                key={book.id}
                className="gradient-card border-border/30 hover:shadow-elevated transition-all duration-300 cursor-pointer group animate-fade-up"
                style={{ animationDelay: `${200 + i * 50}ms` }}
                onClick={() => setActiveBookId(book.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl p-3 rounded-2xl bg-primary-soft group-hover:scale-110 transition-transform duration-300">
                      {book.coverEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{book.author}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {book.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <Badge variant="secondary" className="text-[10px]">{book.category}</Badge>
                    <Badge variant="outline" className="text-[10px]">{book.totalChapters} chapters</Badge>
                    {progress?.completed && (
                      <Badge className="text-[10px] bg-mood-great/20 text-mood-great border-mood-great/30">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                      </Badge>
                    )}
                  </div>

                  {progress && !progress.completed ? (
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Chapter {progress.current_chapter}/{progress.total_chapters}</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-1.5" />
                    </div>
                  ) : !progress ? (
                    <Button variant="ghost" size="sm" className="w-full rounded-xl text-primary group-hover:bg-primary/10">
                      Start Reading <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No books found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}
