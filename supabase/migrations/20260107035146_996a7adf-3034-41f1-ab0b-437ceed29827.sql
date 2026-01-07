-- Create wellness_logs table for daily tracking
CREATE TABLE public.wellness_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sleep_hours INTEGER NOT NULL DEFAULT 0,
  water_glasses INTEGER NOT NULL DEFAULT 0,
  exercise_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, log_date)
);

-- Enable Row Level Security
ALTER TABLE public.wellness_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own wellness logs" 
ON public.wellness_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wellness logs" 
ON public.wellness_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wellness logs" 
ON public.wellness_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_wellness_logs_updated_at
BEFORE UPDATE ON public.wellness_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();