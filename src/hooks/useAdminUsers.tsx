import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useAdminUsers = (roleFilter?: string) => {
  return useQuery({
    queryKey: ["adminUsers", roleFilter],
    queryFn: async () => {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;
      if (!profiles) return [];

      // Get all user roles
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("user_id, role");

      // Get all subscriptions
      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("user_id, status, plan_type");

      // Merge data
      const enrichedProfiles = profiles.map((profile) => ({
        ...profile,
        user_roles: userRoles?.filter((ur) => ur.user_id === profile.id) || [],
        subscriptions: subscriptions?.filter((s) => s.user_id === profile.id) || [],
      }));

      // Filter by role if specified
      if (roleFilter && roleFilter !== "all") {
        return enrichedProfiles.filter((profile) =>
          profile.user_roles.some((ur) => ur.role === roleFilter)
        );
      }

      return enrichedProfiles;
    },
  });
};

export const useUserDetails = (userId: string) => {
  return useQuery({
    queryKey: ["userDetails", userId],
    queryFn: async () => {
      // Get profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      // Get user roles
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      // Get subscriptions
      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId);

      return {
        ...profile,
        user_roles: userRoles || [],
        subscriptions: subscriptions || [],
      };
    },
    enabled: !!userId,
  });
};

export const useUserProgress = (userId: string) => {
  return useQuery({
    queryKey: ["userProgress", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("progress")
        .select(`
          *,
          lesson:lessons(
            title,
            video_duration,
            module:modules(
              title,
              trail:trails(title, slug)
            )
          )
        `)
        .eq("user_id", userId)
        .order("last_watched_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useUserStats = (userId: string) => {
  return useQuery({
    queryKey: ["userStats", userId],
    queryFn: async () => {
      // Get total progress entries
      const { count: totalLessonsStarted } = await supabase
        .from("progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

      // Get completed lessons
      const { count: completedLessons } = await supabase
        .from("progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("completed", true);

      // Get total watch time
      const { data: progressData } = await supabase
        .from("progress")
        .select("progress_seconds")
        .eq("user_id", userId);

      const totalWatchTime = progressData?.reduce(
        (sum, p) => sum + (p.progress_seconds || 0),
        0
      ) || 0;

      return {
        totalLessonsStarted: totalLessonsStarted || 0,
        completedLessons: completedLessons || 0,
        totalWatchTime,
      };
    },
    enabled: !!userId,
  });
};

export const useAddAdminRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      toast({
        title: "Sucesso",
        description: "Permissão de admin concedida!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useRemoveAdminRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      toast({
        title: "Sucesso",
        description: "Permissão de admin removida!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
