import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export const useBadges = () => {
  return useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("badges")
        .select("*")
        .order("points", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useUserBadges = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: ["userBadges", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      const { data, error } = await supabase
        .from("user_badges")
        .select(`
          *,
          badge:badge_id (
            id,
            name,
            description,
            icon,
            category,
            points
          )
        `)
        .eq("user_id", userId)
        .order("earned_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Listen for new badges in real-time
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("user_badges_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_badges",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          // Fetch the badge details
          const { data: badge } = await supabase
            .from("badges")
            .select("*")
            .eq("id", payload.new.badge_id)
            .single();

          if (badge) {
            // Show toast notification
            toast({
              title: "🎉 Nova Badge Desbloqueada!",
              description: (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <p className="font-bold">{badge.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {badge.description}
                    </p>
                    <p className="text-xs text-primary font-semibold mt-1">
                      +{badge.points} pontos
                    </p>
                  </div>
                </div>
              ),
              duration: 8000,
            });

            // Refetch badges
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

export const useUserBadgeStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["userBadgeStats", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      // Get all badges
      const { data: allBadges, error: badgesError } = await supabase
        .from("badges")
        .select("*");

      if (badgesError) throw badgesError;

      // Get user badges
      const { data: userBadges, error: userBadgesError } = await supabase
        .from("user_badges")
        .select(`
          *,
          badge:badge_id (
            points
          )
        `)
        .eq("user_id", userId);

      if (userBadgesError) throw userBadgesError;

      const totalBadges = allBadges?.length || 0;
      const earnedBadges = userBadges?.length || 0;
      const totalPoints = userBadges?.reduce(
        (sum, ub: any) => sum + (ub.badge?.points || 0),
        0
      ) || 0;

      return {
        totalBadges,
        earnedBadges,
        totalPoints,
        progress: totalBadges > 0 ? (earnedBadges / totalBadges) * 100 : 0,
      };
    },
    enabled: !!userId,
  });
};
