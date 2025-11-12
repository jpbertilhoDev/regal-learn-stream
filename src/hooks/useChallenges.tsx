import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export const useChallenges = () => {
  return useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("is_active", true)
        .gte("end_date", new Date().toISOString())
        .order("difficulty", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useUserChallenges = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["userChallenges", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      // Get active challenges
      const { data: challenges, error: challengesError } = await supabase
        .from("challenges")
        .select("*")
        .eq("is_active", true)
        .gte("end_date", new Date().toISOString());

      if (challengesError) throw challengesError;

      // Get user progress for these challenges
      const { data: userProgress, error: progressError } = await supabase
        .from("user_challenges")
        .select("*")
        .eq("user_id", userId);

      if (progressError) throw progressError;

      // Combine challenges with user progress
      const challengesWithProgress = challenges?.map((challenge) => {
        const progress = userProgress?.find((p) => p.challenge_id === challenge.id);
        return {
          ...challenge,
          currentProgress: progress?.current_progress || 0,
          completed: progress?.completed || false,
          completedAt: progress?.completed_at,
          progressPercentage: Math.min(
            ((progress?.current_progress || 0) / challenge.target_value) * 100,
            100
          ),
        };
      }) || [];

      return challengesWithProgress;
    },
    enabled: !!userId,
  });

  // Listen for challenge completions in real-time
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("user_challenges_updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_challenges",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          // Check if challenge was just completed
          if (payload.new.completed && !payload.old.completed) {
            // Fetch challenge details
            const { data: challenge } = await supabase
              .from("challenges")
              .select("*")
              .eq("id", payload.new.challenge_id)
              .single();

            if (challenge) {
              toast({
                title: "🎉 Desafio Completo!",
                description: (
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <div>
                      <p className="font-bold">{challenge.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {challenge.description}
                      </p>
                      <p className="text-xs text-primary font-semibold mt-1">
                        +{challenge.reward_points} pontos
                      </p>
                    </div>
                  </div>
                ),
                duration: 8000,
              });
            }

            // Refetch challenges
            query.refetch();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, query]);

  return query;
};

export const useChallengeStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["challengeStats", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      // Get total completed challenges
      const { count: completedCount } = await supabase
        .from("user_challenges")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("completed", true);

      // Get total reward points earned
      const { data: rewards } = await supabase
        .from("challenge_rewards")
        .select("reward_points")
        .eq("user_id", userId);

      const totalPoints = rewards?.reduce((sum, r) => sum + r.reward_points, 0) || 0;

      // Get this week's completions
      const weekStart = new Date();
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      const { count: weeklyCount } = await supabase
        .from("user_challenges")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("completed", true)
        .gte("completed_at", weekStart.toISOString());

      return {
        totalCompleted: completedCount || 0,
        totalPoints,
        weeklyCompleted: weeklyCount || 0,
      };
    },
    enabled: !!userId,
  });
};
