-- Create badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on badges
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- Everyone can view badges
CREATE POLICY "Everyone can view badges"
  ON public.badges FOR SELECT
  USING (true);

-- Admins can manage badges
CREATE POLICY "Admins can manage badges"
  ON public.badges FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create user_badges table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, badge_id)
);

-- Enable RLS on user_badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Everyone can view user badges
CREATE POLICY "Everyone can view user badges"
  ON public.user_badges FOR SELECT
  USING (true);

-- Users can't manually insert badges (only via functions)
CREATE POLICY "System can insert badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (false);

-- Admins can manage all badges
CREATE POLICY "Admins can manage all badges"
  ON public.user_badges FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert initial badges
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, points) VALUES
('Primeiro Passo', 'Complete sua primeira aula', 'Footprints', 'progress', 'lessons_completed', 1, 10),
('Aprendiz', 'Complete 5 aulas', 'GraduationCap', 'progress', 'lessons_completed', 5, 25),
('Estudioso', 'Complete 10 aulas', 'BookOpen', 'progress', 'lessons_completed', 10, 50),
('Mestre', 'Complete 25 aulas', 'Award', 'progress', 'lessons_completed', 25, 100),
('Especialista', 'Complete 50 aulas', 'Crown', 'progress', 'lessons_completed', 50, 250),

('Trilheiro Iniciante', 'Complete sua primeira trilha', 'MapPin', 'trails', 'trails_completed', 1, 50),
('Explorador', 'Complete 3 trilhas', 'Compass', 'trails', 'trails_completed', 3, 150),
('Navegador', 'Complete todas as trilhas', 'Map', 'trails', 'trails_completed', 10, 500),

('Voz Ativa', 'Faça seu primeiro comentário', 'MessageCircle', 'community', 'comments_created', 1, 5),
('Comunicador', 'Faça 10 comentários', 'MessageSquare', 'community', 'comments_created', 10, 25),
('Influenciador', 'Faça 50 comentários', 'Megaphone', 'community', 'comments_created', 50, 100),

('Crítico', 'Avalie sua primeira trilha', 'Star', 'community', 'reviews_created', 1, 10),
('Avaliador', 'Avalie 5 trilhas', 'Stars', 'community', 'reviews_created', 5, 50),

('Madrugador', 'Acesse a plataforma antes das 6h', 'Sunrise', 'special', 'early_access', 1, 20),
('Noturno', 'Acesse a plataforma depois das 22h', 'Moon', 'special', 'late_access', 1, 20),
('Dedicado', 'Acesse a plataforma 7 dias seguidos', 'Zap', 'special', 'streak_days', 7, 100),
('Persistente', 'Acesse a plataforma 30 dias seguidos', 'Flame', 'special', 'streak_days', 30, 500);

-- Function to award badge
CREATE OR REPLACE FUNCTION public.award_badge(_user_id UUID, _badge_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _badge_id UUID;
BEGIN
  -- Get badge ID
  SELECT id INTO _badge_id
  FROM public.badges
  WHERE name = _badge_name;

  -- Insert badge if not already earned
  INSERT INTO public.user_badges (user_id, badge_id)
  VALUES (_user_id, _badge_id)
  ON CONFLICT (user_id, badge_id) DO NOTHING;
END;
$$;

-- Function to check and award progress badges
CREATE OR REPLACE FUNCTION public.check_progress_badges(_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _lessons_completed INTEGER;
  _trails_completed INTEGER;
  _comments_count INTEGER;
  _reviews_count INTEGER;
BEGIN
  -- Count completed lessons
  SELECT COUNT(*)
  INTO _lessons_completed
  FROM public.progress
  WHERE user_id = _user_id AND completed = true;

  -- Count completed trails (user completed all lessons in trail)
  SELECT COUNT(DISTINCT t.id)
  INTO _trails_completed
  FROM public.trails t
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.lessons l
    LEFT JOIN public.progress p ON l.id = p.lesson_id AND p.user_id = _user_id
    WHERE l.module_id IN (
      SELECT id FROM public.modules WHERE trail_id = t.id
    )
    AND (p.completed IS NULL OR p.completed = false)
  );

  -- Count comments
  SELECT COUNT(*)
  INTO _comments_count
  FROM public.comments
  WHERE user_id = _user_id;

  -- Count reviews
  SELECT COUNT(*)
  INTO _reviews_count
  FROM public.reviews
  WHERE user_id = _user_id;

  -- Award lesson badges
  IF _lessons_completed >= 1 THEN
    PERFORM award_badge(_user_id, 'Primeiro Passo');
  END IF;
  IF _lessons_completed >= 5 THEN
    PERFORM award_badge(_user_id, 'Aprendiz');
  END IF;
  IF _lessons_completed >= 10 THEN
    PERFORM award_badge(_user_id, 'Estudioso');
  END IF;
  IF _lessons_completed >= 25 THEN
    PERFORM award_badge(_user_id, 'Mestre');
  END IF;
  IF _lessons_completed >= 50 THEN
    PERFORM award_badge(_user_id, 'Especialista');
  END IF;

  -- Award trail badges
  IF _trails_completed >= 1 THEN
    PERFORM award_badge(_user_id, 'Trilheiro Iniciante');
  END IF;
  IF _trails_completed >= 3 THEN
    PERFORM award_badge(_user_id, 'Explorador');
  END IF;
  IF _trails_completed >= 10 THEN
    PERFORM award_badge(_user_id, 'Navegador');
  END IF;

  -- Award comment badges
  IF _comments_count >= 1 THEN
    PERFORM award_badge(_user_id, 'Voz Ativa');
  END IF;
  IF _comments_count >= 10 THEN
    PERFORM award_badge(_user_id, 'Comunicador');
  END IF;
  IF _comments_count >= 50 THEN
    PERFORM award_badge(_user_id, 'Influenciador');
  END IF;

  -- Award review badges
  IF _reviews_count >= 1 THEN
    PERFORM award_badge(_user_id, 'Crítico');
  END IF;
  IF _reviews_count >= 5 THEN
    PERFORM award_badge(_user_id, 'Avaliador');
  END IF;
END;
$$;

-- Trigger to check badges on progress update
CREATE OR REPLACE FUNCTION public.trigger_check_badges_on_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM check_progress_badges(NEW.user_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_badges_on_progress_update
AFTER INSERT OR UPDATE ON public.progress
FOR EACH ROW
EXECUTE FUNCTION trigger_check_badges_on_progress();

-- Trigger to check badges on comment
CREATE OR REPLACE FUNCTION public.trigger_check_badges_on_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM check_progress_badges(NEW.user_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_badges_on_comment
AFTER INSERT ON public.comments
FOR EACH ROW
EXECUTE FUNCTION trigger_check_badges_on_comment();

-- Trigger to check badges on review
CREATE OR REPLACE FUNCTION public.trigger_check_badges_on_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM check_progress_badges(NEW.user_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_badges_on_review
AFTER INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_check_badges_on_review();