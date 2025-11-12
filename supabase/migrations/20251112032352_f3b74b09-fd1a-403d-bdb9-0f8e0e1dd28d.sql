-- Create challenges table
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  challenge_type TEXT NOT NULL,
  target_value INTEGER NOT NULL,
  reward_points INTEGER NOT NULL DEFAULT 0,
  reward_badge_id UUID REFERENCES public.badges(id),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on challenges
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Everyone can view active challenges
CREATE POLICY "Everyone can view active challenges"
  ON public.challenges FOR SELECT
  USING (is_active = true);

-- Admins can manage challenges
CREATE POLICY "Admins can manage challenges"
  ON public.challenges FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create user_challenges table to track progress
CREATE TABLE public.user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  current_progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS on user_challenges
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;

-- Users can view their own challenges
CREATE POLICY "Users can view their own challenges"
  ON public.user_challenges FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert challenge progress
CREATE POLICY "System can insert challenge progress"
  ON public.user_challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- System can update challenge progress
CREATE POLICY "System can update challenge progress"
  ON public.user_challenges FOR UPDATE
  USING (auth.uid() = user_id);

-- Create challenge_rewards table for claimed rewards
CREATE TABLE public.challenge_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  reward_points INTEGER NOT NULL,
  reward_badge_id UUID REFERENCES public.badges(id),
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS on challenge_rewards
ALTER TABLE public.challenge_rewards ENABLE ROW LEVEL SECURITY;

-- Users can view their own rewards
CREATE POLICY "Users can view their own rewards"
  ON public.challenge_rewards FOR SELECT
  USING (auth.uid() = user_id);

-- Insert special challenge badges
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, points) VALUES
('Desafiador Semanal', 'Complete um desafio semanal', 'Target', 'challenges', 'weekly_challenges', 1, 50),
('Mestre dos Desafios', 'Complete 5 desafios semanais', 'Trophy', 'challenges', 'weekly_challenges', 5, 200),
('Lenda', 'Complete 10 desafios semanais', 'Crown', 'challenges', 'weekly_challenges', 10, 500)
ON CONFLICT (name) DO NOTHING;

-- Function to update challenge progress
CREATE OR REPLACE FUNCTION public.update_challenge_progress(
  _user_id UUID,
  _challenge_type TEXT,
  _increment INTEGER DEFAULT 1
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _challenge RECORD;
BEGIN
  -- Find active challenges of this type
  FOR _challenge IN 
    SELECT * FROM public.challenges 
    WHERE challenge_type = _challenge_type 
      AND is_active = true 
      AND now() BETWEEN start_date AND end_date
  LOOP
    -- Insert or update user progress
    INSERT INTO public.user_challenges (user_id, challenge_id, current_progress)
    VALUES (_user_id, _challenge.id, _increment)
    ON CONFLICT (user_id, challenge_id)
    DO UPDATE SET 
      current_progress = user_challenges.current_progress + _increment;

    -- Check if challenge is completed
    UPDATE public.user_challenges
    SET 
      completed = true,
      completed_at = now()
    WHERE user_id = _user_id
      AND challenge_id = _challenge.id
      AND current_progress >= _challenge.target_value
      AND completed = false;

    -- Award rewards if just completed
    IF (SELECT completed FROM public.user_challenges 
        WHERE user_id = _user_id AND challenge_id = _challenge.id) = true 
       AND NOT EXISTS (
         SELECT 1 FROM public.challenge_rewards 
         WHERE user_id = _user_id AND challenge_id = _challenge.id
       ) THEN
      
      -- Insert reward record
      INSERT INTO public.challenge_rewards (user_id, challenge_id, reward_points, reward_badge_id)
      VALUES (_user_id, _challenge.id, _challenge.reward_points, _challenge.reward_badge_id);

      -- Award badge if exists
      IF _challenge.reward_badge_id IS NOT NULL THEN
        INSERT INTO public.user_badges (user_id, badge_id)
        VALUES (_user_id, _challenge.reward_badge_id)
        ON CONFLICT (user_id, badge_id) DO NOTHING;
      END IF;

      -- Check for meta-challenge badges
      DECLARE
        _completed_count INTEGER;
      BEGIN
        SELECT COUNT(*) INTO _completed_count
        FROM public.user_challenges
        WHERE user_id = _user_id AND completed = true;

        IF _completed_count >= 1 THEN
          PERFORM award_badge(_user_id, 'Desafiador Semanal');
        END IF;
        IF _completed_count >= 5 THEN
          PERFORM award_badge(_user_id, 'Mestre dos Desafios');
        END IF;
        IF _completed_count >= 10 THEN
          PERFORM award_badge(_user_id, 'Lenda');
        END IF;
      END;
    END IF;
  END LOOP;
END;
$$;

-- Trigger to update challenges on lesson completion
CREATE OR REPLACE FUNCTION public.trigger_update_challenges_on_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    PERFORM update_challenge_progress(NEW.user_id, 'lessons_completed', 1);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_challenges_on_progress
AFTER INSERT OR UPDATE ON public.progress
FOR EACH ROW
EXECUTE FUNCTION trigger_update_challenges_on_progress();

-- Trigger to update challenges on comment
CREATE OR REPLACE FUNCTION public.trigger_update_challenges_on_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM update_challenge_progress(NEW.user_id, 'comments_created', 1);
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_challenges_on_comment
AFTER INSERT ON public.comments
FOR EACH ROW
EXECUTE FUNCTION trigger_update_challenges_on_comment();

-- Trigger to update challenges on review
CREATE OR REPLACE FUNCTION public.trigger_update_challenges_on_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM update_challenge_progress(NEW.user_id, 'reviews_created', 1);
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_challenges_on_review
AFTER INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION trigger_update_challenges_on_review();

-- Create initial weekly challenges
INSERT INTO public.challenges (title, description, icon, challenge_type, target_value, reward_points, start_date, end_date, difficulty) VALUES
(
  'Maratona Semanal',
  'Complete 5 aulas esta semana',
  'Zap',
  'lessons_completed',
  5,
  100,
  date_trunc('week', now()),
  date_trunc('week', now() + interval '1 week'),
  'easy'
),
(
  'Explorador Ativo',
  'Complete 10 aulas esta semana',
  'Rocket',
  'lessons_completed',
  10,
  250,
  date_trunc('week', now()),
  date_trunc('week', now() + interval '1 week'),
  'medium'
),
(
  'Voz da Comunidade',
  'Faça 5 comentários esta semana',
  'MessageSquare',
  'comments_created',
  5,
  75,
  date_trunc('week', now()),
  date_trunc('week', now() + interval '1 week'),
  'easy'
),
(
  'Crítico da Semana',
  'Avalie 3 trilhas esta semana',
  'Star',
  'reviews_created',
  3,
  150,
  date_trunc('week', now()),
  date_trunc('week', now() + interval '1 week'),
  'medium'
);