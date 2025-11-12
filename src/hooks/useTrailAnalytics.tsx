import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTrailAnalytics = () => {
  return useQuery({
    queryKey: ["trailAnalytics"],
    queryFn: async () => {
      // Get all trails with their lessons
      const { data: trails, error: trailsError } = await supabase
        .from("trails")
        .select(
          `
          id,
          title,
          lessons:modules(lessons(id))
        `
        )
        .eq("is_published", true);

      if (trailsError) throw trailsError;

      // Get progress for all lessons
      const trailsWithStats = await Promise.all(
        (trails || []).map(async (trail) => {
          const lessonIds = trail.lessons?.flatMap(
            (module: any) => module.lessons?.map((l: any) => l.id) || []
          );

          if (!lessonIds || lessonIds.length === 0) {
            return {
              title: trail.title,
              views: 0,
            };
          }

          const { count } = await supabase
            .from("progress")
            .select("id", { count: "exact", head: true })
            .in("lesson_id", lessonIds);

          return {
            title: trail.title,
            views: count ?? 0,
          };
        })
      );

      // Sort by views and return top 5
      return trailsWithStats
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    },
    refetchInterval: 60000,
  });
};
