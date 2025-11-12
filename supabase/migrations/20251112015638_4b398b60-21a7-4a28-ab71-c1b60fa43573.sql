-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trails table
CREATE TABLE public.trails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER NOT NULL, -- in minutes
  lessons_count INTEGER NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on trails
ALTER TABLE public.trails ENABLE ROW LEVEL SECURITY;

-- RLS policies for trails
CREATE POLICY "Everyone can view published trails"
  ON public.trails
  FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admins can do everything on trails"
  ON public.trails
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create modules table
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trail_id UUID REFERENCES public.trails(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on modules
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- RLS policies for modules
CREATE POLICY "Everyone can view modules of published trails"
  ON public.modules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trails
      WHERE trails.id = modules.trail_id
      AND trails.is_published = TRUE
    )
  );

CREATE POLICY "Admins can do everything on modules"
  ON public.modules
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  video_duration INTEGER, -- in seconds
  thumbnail_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  requires_subscription BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on lessons
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- RLS policies for lessons
CREATE POLICY "Everyone can view published lessons"
  ON public.lessons
  FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admins can do everything on lessons"
  ON public.lessons
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create progress table
CREATE TABLE public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  progress_seconds INTEGER NOT NULL DEFAULT 0,
  last_watched_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS on progress
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for progress
CREATE POLICY "Users can view their own progress"
  ON public.progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.progress
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
  ON public.progress
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive', -- inactive, active, past_due, canceled
  plan_type TEXT, -- monthly, annual
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscriptions
CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON public.subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON public.subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all subscriptions"
  ON public.subscriptions
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_trails_updated_at
  BEFORE UPDATE ON public.trails
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_progress_updated_at
  BEFORE UPDATE ON public.progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed data for trails
INSERT INTO public.trails (slug, title, description, thumbnail_url, duration, lessons_count, order_index)
VALUES
  ('faith', 'Trail of Faith', 'Strengthen your faith journey with biblical teachings and practical applications for daily life.', '/src/assets/trail-faith.jpg', 180, 6, 1),
  ('identity', 'Trail of Identity', 'Discover your true identity in Christ and learn to live confidently in who God created you to be.', '/src/assets/trail-identity.jpg', 150, 6, 2),
  ('finances', 'Trail of Finances', 'Learn biblical principles for managing your finances with wisdom and stewardship.', '/src/assets/trail-finances.jpg', 165, 6, 3);

-- Insert seed data for modules (2 per trail)
INSERT INTO public.modules (trail_id, title, description, order_index)
SELECT 
  t.id,
  'Foundation Module',
  'Build a strong foundation for your journey',
  1
FROM public.trails t;

INSERT INTO public.modules (trail_id, title, description, order_index)
SELECT 
  t.id,
  'Advanced Practice',
  'Deepen your understanding with advanced concepts',
  2
FROM public.trails t;

-- Insert seed data for lessons (3 per module = 18 total)
INSERT INTO public.lessons (module_id, title, description, video_duration, order_index)
SELECT 
  m.id,
  'Lesson ' || generate_series || ': Introduction',
  'Introduction to the core concepts',
  1800, -- 30 minutes
  generate_series
FROM public.modules m
CROSS JOIN generate_series(1, 3);

-- Add more detailed lesson titles
UPDATE public.lessons l
SET title = CASE 
  WHEN l.order_index = 1 THEN 'Getting Started: The Foundation'
  WHEN l.order_index = 2 THEN 'Understanding the Core Principles'
  WHEN l.order_index = 3 THEN 'Practical Application'
END,
description = CASE 
  WHEN l.order_index = 1 THEN 'Learn the fundamental concepts and prepare for your journey ahead.'
  WHEN l.order_index = 2 THEN 'Dive deeper into the teachings and understand how they apply to your life.'
  WHEN l.order_index = 3 THEN 'Put what you''ve learned into practice with actionable steps and exercises.'
END;