import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { JournalAnalysis } from "@/components/AIAnalysisCard";

export function useJournalAnalysis() {
  const [analysis, setAnalysis] = useState<JournalAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeEntry = async (journalEntry: string, mood?: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-journal', {
        body: { journalEntry, mood }
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to analyze entry');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.analysis) {
        setAnalysis(data.analysis);
        return data.analysis;
      } else {
        throw new Error('No analysis received');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      console.error('Journal analysis error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
    setError(null);
  };

  return {
    analysis,
    isLoading,
    error,
    analyzeEntry,
    clearAnalysis
  };
}
