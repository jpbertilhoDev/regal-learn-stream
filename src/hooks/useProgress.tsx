import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UpdateProgressParams {
  lessonId: string;
  progressSeconds: number;
  videoDuration: number;
}

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ lessonId, progressSeconds, videoDuration }: UpdateProgressParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const completed = videoDuration > 0 && (progressSeconds / videoDuration) >= 0.9;

      const { data, error } = await supabase
        .from("progress")
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          progress_seconds: progressSeconds,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          last_watched_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,lesson_id",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lesson", data.lesson_id] });
      queryClient.invalidateQueries({ queryKey: ["continueWatching"] });
      queryClient.invalidateQueries({ queryKey: ["trail"] });
      
      if (data.completed) {
        toast({
          title: "Aula concluída!",
          description: "Parabéns! Você completou esta aula.",
        });
      }
    },
    onError: (error: any) => {
      console.error("Error updating progress:", error);
      toast({
        title: "Erro ao salvar progresso",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useMarkComplete = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("progress")
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
          last_watched_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,lesson_id",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lesson", data.lesson_id] });
      queryClient.invalidateQueries({ queryKey: ["continueWatching"] });
      queryClient.invalidateQueries({ queryKey: ["trail"] });
      
      toast({
        title: "Aula marcada como concluída!",
        description: "Seu progresso foi atualizado.",
      });
    },
    onError: (error: any) => {
      console.error("Error marking lesson complete:", error);
      toast({
        title: "Erro ao marcar aula como concluída",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
