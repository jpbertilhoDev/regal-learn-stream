-- Add category and difficulty_level to trails table
CREATE TYPE public.trail_category AS ENUM ('ecossistema', 'financeiro', 'geral');
CREATE TYPE public.difficulty_level AS ENUM ('iniciante', 'intermediario', 'avancado');

ALTER TABLE public.trails 
ADD COLUMN category trail_category DEFAULT 'geral',
ADD COLUMN difficulty_level difficulty_level DEFAULT 'iniciante';

-- Update existing trails with categories
UPDATE public.trails SET category = 'geral' WHERE slug IN ('faith', 'identity', 'finances');