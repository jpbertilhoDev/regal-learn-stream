import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTrailDetails = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["trail", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Slug is required");

      // Get trail
      const { data: trail, error: trailError } = await supabase
        .from("trails")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (trailError) throw trailError;

      // Get modules with lessons
      const { data: modules, error: modulesError } = await supabase
        .from("modules")
        .select(`
          *,
          lessons (*)
        `)
        .eq("trail_id", trail.id)
        .order("order_index");

      if (modulesError) throw modulesError;

      // Get user progress if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      let progress = [];

      if (user) {
        const { data: progressData } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id);
        
        progress = progressData || [];
      }

      return {
        trail,
        modules: modules.map(module => ({
          ...module,
          lessons: (module.lessons as any[])
            .sort((a, b) => a.order_index - b.order_index)
            .map(lesson => {
              const lessonProgress = progress.find(p => p.lesson_id === lesson.id);
              return {
                ...lesson,
                completed: lessonProgress?.completed || false,
                progress_seconds: lessonProgress?.progress_seconds || 0,
              };
            }),
        })),
      };
    },
    enabled: !!slug,
  });
};
