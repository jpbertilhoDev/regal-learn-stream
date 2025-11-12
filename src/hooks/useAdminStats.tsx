import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const [usersResult, trailsResult, lessonsResult, progressResult] =
        await Promise.all([
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase
            .from("trails")
            .select("id", { count: "exact", head: true })
            .eq("is_published", true),
          supabase
            .from("lessons")
            .select("id", { count: "exact", head: true })
            .eq("is_published", true),
          supabase
            .from("progress")
            .select("id, completed", { count: "exact" })
            .eq("completed", true),
        ]);

      const totalUsers = usersResult.count ?? 0;
      const totalTrails = trailsResult.count ?? 0;
      const totalLessons = lessonsResult.count ?? 0;
      const completedLessons = progressResult.count ?? 0;

      // Calculate completion rate
      const { count: totalProgress } = await supabase
        .from("progress")
        .select("id", { count: "exact", head: true });

      const completionRate =
        totalProgress && totalProgress > 0
          ? Math.round((completedLessons / totalProgress) * 100)
          : 0;

      return {
        totalUsers,
        totalTrails,
        totalLessons,
        completionRate,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
