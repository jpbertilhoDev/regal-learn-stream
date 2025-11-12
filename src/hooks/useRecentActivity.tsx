import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ["recentActivity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("progress")
        .select(
          `
          id,
          last_watched_at,
          progress_seconds,
          completed,
          lesson:lessons(title, module:modules(title, trail:trails(title))),
          user:profiles(name)
        `
        )
        .order("last_watched_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });
};
