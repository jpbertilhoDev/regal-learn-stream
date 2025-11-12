import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useComments = (lessonId: string | undefined) => {
  return useQuery({
    queryKey: ["comments", lessonId],
    queryFn: async () => {
      if (!lessonId) throw new Error("Lesson ID is required");

      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles:user_id (
            name,
            avatar_url
          )
        `)
        .eq("lesson_id", lessonId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!lessonId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ lessonId, content }: { lessonId: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("comments")
        .insert({
          lesson_id: lessonId,
          user_id: user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.lessonId] });
      toast({
        title: "Comentário publicado",
        description: "Seu comentário foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao publicar comentário",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast({
        title: "Comentário excluído",
        description: "O comentário foi removido com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir comentário",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
