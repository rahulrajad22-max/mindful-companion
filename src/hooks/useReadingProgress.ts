import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ReadingProgress {
  book_id: string;
  current_chapter: number;
  total_chapters: number;
  completed: boolean;
  last_read_at: string;
}

export function useReadingProgress() {
  const { user } = useAuth();
  const [progressMap, setProgressMap] = useState<Map<string, ReadingProgress>>(new Map());
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("reading_progress")
      .select("book_id, current_chapter, total_chapters, completed, last_read_at")
      .eq("user_id", user.id);

    const map = new Map<string, ReadingProgress>();
    data?.forEach((row: any) => map.set(row.book_id, row));
    setProgressMap(map);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchProgress();
  }, [user, fetchProgress]);

  const updateProgress = useCallback(async (bookId: string, chapter: number, totalChapters: number) => {
    if (!user) return;
    const completed = chapter >= totalChapters;
    const existing = progressMap.get(bookId);

    if (existing) {
      await supabase
        .from("reading_progress")
        .update({ current_chapter: chapter, completed, last_read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("book_id", bookId);
    } else {
      await supabase
        .from("reading_progress")
        .insert({ user_id: user.id, book_id: bookId, current_chapter: chapter, total_chapters: totalChapters, completed });
    }

    setProgressMap((prev) => {
      const next = new Map(prev);
      next.set(bookId, { book_id: bookId, current_chapter: chapter, total_chapters: totalChapters, completed, last_read_at: new Date().toISOString() });
      return next;
    });
  }, [user, progressMap]);

  const getProgress = useCallback((bookId: string) => progressMap.get(bookId), [progressMap]);

  return { loading, progressMap, getProgress, updateProgress, refetch: fetchProgress };
}
