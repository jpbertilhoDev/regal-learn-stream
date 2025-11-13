-- Add difficulty_level column to trails table
ALTER TABLE public.trails
ADD COLUMN IF NOT EXISTS difficulty_level TEXT DEFAULT 'iniciante';

-- Add check constraint for valid difficulty levels
ALTER TABLE public.trails
DROP CONSTRAINT IF EXISTS trails_difficulty_level_check;

ALTER TABLE public.trails
ADD CONSTRAINT trails_difficulty_level_check
CHECK (difficulty_level IN ('iniciante', 'intermediario', 'avancado'));

-- Update existing trails with default difficulty level
UPDATE public.trails
SET difficulty_level = 'iniciante'
WHERE difficulty_level IS NULL;

-- Create index for filtering by difficulty level
CREATE INDEX IF NOT EXISTS idx_trails_difficulty_level
ON public.trails(difficulty_level);
