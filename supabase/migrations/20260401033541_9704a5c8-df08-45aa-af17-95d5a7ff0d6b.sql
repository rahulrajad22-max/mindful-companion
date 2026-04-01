
CREATE TABLE public.game_scores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  game_type text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  played_at timestamp with time zone NOT NULL DEFAULT now(),
  week_start date NOT NULL DEFAULT date_trunc('week', CURRENT_DATE)::date,
  display_name text
);

ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view game scores" ON public.game_scores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own scores" ON public.game_scores FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_game_scores_week ON public.game_scores (week_start, game_type, score DESC);
