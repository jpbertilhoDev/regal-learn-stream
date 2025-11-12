import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLesson = (lessonId: string | undefined) => {
  return useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      if (!lessonId) throw new Error("Lesson ID is required");

      // Get lesson with module and trail info
      const { data: lesson, error: lessonError } = await supabase
        .from("lessons")
        .select(`
          *,
          module:modules (
            *,
            trail:trails (*)
          )
        `)
        .eq("id", lessonId)
        .eq("is_published", true)
        .single();

      if (lessonError) throw lessonError;

      // Get user progress if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      let progress = null;

      if (user) {
        const { data: progressData } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId)
          .maybeSingle();
        
        progress = progressData;
      }

      // Get all lessons in this module for navigation
      const { data: allLessons } = await supabase
        .from("lessons")
        .select("id, title, order_index")
        .eq("module_id", (lesson.module as any).id)
        .eq("is_published", true)
        .order("order_index");

      return {
        lesson,
        progress,
        allLessons: allLessons || [],
      };
    },
    enabled: !!lessonId,
  });
};
