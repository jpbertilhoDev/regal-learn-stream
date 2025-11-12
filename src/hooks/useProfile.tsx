import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "./useAuth";

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: { name?: string; avatar_url?: string }) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Senha alterada!",
        description: "Sua senha foi atualizada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao alterar senha",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUserStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      // Get total lessons started
      const { count: totalLessonsStarted } = await supabase
        .from("progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Get completed lessons
      const { count: completedLessons } = await supabase
        .from("progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("completed", true);

      // Get total watch time
      const { data: progressData } = await supabase
        .from("progress")
        .select("progress_seconds")
        .eq("user_id", user.id);

      const totalWatchTimeSeconds = progressData?.reduce(
        (sum, p) => sum + (p.progress_seconds || 0),
        0
      ) || 0;

      // Get trails progress
      const { data: trailsProgress } = await supabase
        .from("progress")
        .select(`
          lesson_id,
          completed,
          lesson:lessons(
            module:modules(
              trail_id
            )
          )
        `)
        .eq("user_id", user.id);

      // Calculate completed trails
      const trailsMap = new Map<string, { total: number; completed: number }>();
      
      trailsProgress?.forEach((progress: any) => {
        const trailId = progress.lesson?.module?.trail_id;
        if (trailId) {
          if (!trailsMap.has(trailId)) {
            trailsMap.set(trailId, { total: 0, completed: 0 });
          }
          const trail = trailsMap.get(trailId)!;
          trail.total++;
          if (progress.completed) {
            trail.completed++;
          }
        }
      });

      const completedTrails = Array.from(trailsMap.values()).filter(
        (trail) => trail.total > 0 && trail.completed === trail.total
      ).length;

      return {
        totalLessonsStarted: totalLessonsStarted || 0,
        completedLessons: completedLessons || 0,
        completedTrails,
        totalWatchTimeSeconds,
      };
    },
    enabled: !!user?.id,
  });
};
