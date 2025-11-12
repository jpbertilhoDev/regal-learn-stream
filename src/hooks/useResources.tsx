import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useResources = (lessonId: string | undefined) => {
  return useQuery({
    queryKey: ["resources", lessonId],
    queryFn: async () => {
      if (!lessonId) throw new Error("Lesson ID is required");

      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!lessonId,
  });
};

export const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return "0 KB";
  
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};
