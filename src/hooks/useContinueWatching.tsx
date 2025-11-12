import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useContinueWatching = () => {
  return useQuery({
    queryKey: ["continueWatching"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get the most recent incomplete lesson
      const { data: progressData, error } = await supabase
        .from("progress")
        .select(`
          *,
          lesson:lessons (
            id,
            title,
            video_duration,
            thumbnail_url,
            module:modules (
              trail:trails (
                id,
                title,
                slug
              )
            )
          )
        `)
        .eq("user_id", user.id)
        .eq("completed", false)
        .order("last_watched_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !progressData) return null;

      const lesson = progressData.lesson as any;
      const module = lesson.module as any;
      const trail = module.trail;

      const videoDuration = lesson.video_duration || 0;
      const progressSeconds = progressData.progress_seconds || 0;
      const progressPercentage = videoDuration > 0 
        ? Math.round((progressSeconds / videoDuration) * 100) 
        : 0;

      const remainingSeconds = videoDuration - progressSeconds;
      const remainingMinutes = Math.ceil(remainingSeconds / 60);
      const remainingTime = remainingMinutes > 60
        ? `${Math.floor(remainingMinutes / 60)}h ${remainingMinutes % 60}min`
        : `${remainingMinutes} min`;

      return {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        thumbnail: lesson.thumbnail_url,
        trailTitle: trail.title,
        trailSlug: trail.slug,
        progressPercentage,
        remainingTime,
      };
    },
  });
};
