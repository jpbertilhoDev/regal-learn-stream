-- Add indexes to optimize analytics queries
-- These indexes will significantly improve dashboard performance

-- Index for progress queries by user_id (used in analytics)
CREATE INDEX IF NOT EXISTS idx_progress_user_id
ON public.progress(user_id);

-- Index for progress queries by lesson_id (used in analytics)
CREATE INDEX IF NOT EXISTS idx_progress_lesson_id
ON public.progress(lesson_id);

-- Index for progress queries by completed status
CREATE INDEX IF NOT EXISTS idx_progress_completed
ON public.progress(completed) WHERE completed = true;

-- Index for progress queries by last_watched_at (for recent activity and engagement charts)
CREATE INDEX IF NOT EXISTS idx_progress_last_watched_at
ON public.progress(last_watched_at DESC);

-- Composite index for active users queries (last 7 days)
CREATE INDEX IF NOT EXISTS idx_progress_last_watched_user
ON public.progress(last_watched_at, user_id);

-- Index for profiles queries by created_at (for user growth analytics)
CREATE INDEX IF NOT EXISTS idx_profiles_created_at
ON public.profiles(created_at DESC);

-- Index for lessons by module_id (for trail analytics)
CREATE INDEX IF NOT EXISTS idx_lessons_module_id
ON public.lessons(module_id);

-- Index for modules by trail_id (for trail analytics)
CREATE INDEX IF NOT EXISTS idx_modules_trail_id
ON public.modules(trail_id);

-- Index for published trails (for analytics queries)
CREATE INDEX IF NOT EXISTS idx_trails_published
ON public.trails(is_published) WHERE is_published = true;

-- Index for published lessons (for analytics queries)
CREATE INDEX IF NOT EXISTS idx_lessons_published
ON public.lessons(is_published) WHERE is_published = true;

-- Analyze tables to update statistics for query planner
ANALYZE public.progress;
ANALYZE public.profiles;
ANALYZE public.lessons;
ANALYZE public.modules;
ANALYZE public.trails;
