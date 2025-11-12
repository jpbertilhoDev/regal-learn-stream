import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      // Total users
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

      // Total trails
      const { count: totalTrails } = await supabase
        .from("trails")
        .select("id", { count: "exact", head: true });

      // Total lessons
      const { count: totalLessons } = await supabase
        .from("lessons")
        .select("id", { count: "exact", head: true });

      // Active users (users with progress in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: activeUsers } = await supabase
        .from("progress")
        .select("user_id")
        .gte("last_watched_at", sevenDaysAgo.toISOString());

      const uniqueActiveUsers = new Set(activeUsers?.map(p => p.user_id)).size;

      // Total watch time
      const { data: progressData } = await supabase
        .from("progress")
        .select("progress_seconds");

      const totalWatchTime = progressData?.reduce(
        (sum, p) => sum + (p.progress_seconds || 0),
        0
      ) || 0;

      // Completion rate
      const { count: totalProgress } = await supabase
        .from("progress")
        .select("id", { count: "exact", head: true });

      const { count: completedLessons } = await supabase
        .from("progress")
        .select("id", { count: "exact", head: true })
        .eq("completed", true);

      const completionRate = totalProgress 
        ? Math.round((completedLessons! / totalProgress) * 100)
        : 0;

      // Most popular lessons
      const { data: popularLessons } = await supabase
        .from("progress")
        .select(`
          lesson_id,
          lesson:lessons(title)
        `)
        .limit(1000);

      const lessonCounts = popularLessons?.reduce((acc, p) => {
        const lessonId = p.lesson_id;
        acc[lessonId] = (acc[lessonId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topLessons = Object.entries(lessonCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([lessonId, count]) => {
          const lesson = popularLessons?.find(p => p.lesson_id === lessonId);
          return {
            title: (lesson?.lesson as any)?.title || "Desconhecido",
            views: count,
          };
        });

      // User growth over last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentUsers } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo.toISOString());

      const userGrowth = recentUsers?.length || 0;

      return {
        totalUsers: totalUsers || 0,
        totalTrails: totalTrails || 0,
        totalLessons: totalLessons || 0,
        activeUsers: uniqueActiveUsers,
        totalWatchTime,
        completionRate,
        topLessons,
        userGrowth,
      };
    },
  });
};

export const useEngagementChart = () => {
  return useQuery({
    queryKey: ["engagementChart"],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data } = await supabase
        .from("progress")
        .select("last_watched_at")
        .gte("last_watched_at", thirtyDaysAgo.toISOString());

      // Group by day
      const dailyEngagement: Record<string, number> = {};
      
      data?.forEach((p) => {
        const date = new Date(p.last_watched_at!).toISOString().split("T")[0];
        dailyEngagement[date] = (dailyEngagement[date] || 0) + 1;
      });

      // Fill in missing days with 0
      const chartData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        chartData.push({
          date: dateStr,
          views: dailyEngagement[dateStr] || 0,
        });
      }

      return chartData;
    },
  });
};
