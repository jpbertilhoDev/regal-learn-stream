import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useAdminTrails = () => {
  return useQuery({
    queryKey: ["adminTrails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trails")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTrail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trail: any) => {
      const { data, error } = await supabase
        .from("trails")
        .insert(trail)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTrails"] });
      queryClient.invalidateQueries({ queryKey: ["trails"] });
      toast({
        title: "Sucesso",
        description: "Trilha criada com sucesso!",
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

export const useUpdateTrail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...trail }: any) => {
      console.log("useUpdateTrail - Updating trail:", { id, trail });

      // Remove lessons_count from update if it exists (it's calculated automatically)
      const { lessons_count, ...updateData } = trail;

      const { data, error } = await supabase
        .from("trails")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      console.log("useUpdateTrail - Result:", { data, error });

      if (error) {
        console.error("useUpdateTrail - Error details:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTrails"] });
      queryClient.invalidateQueries({ queryKey: ["trails"] });
      toast({
        title: "Sucesso",
        description: "Trilha atualizada com sucesso!",
      });
    },
    onError: (error: Error) => {
      console.error("useUpdateTrail - onError:", error);
      toast({
        title: "Erro ao atualizar trilha",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTrail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("trails").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTrails"] });
      queryClient.invalidateQueries({ queryKey: ["trails"] });
      toast({
        title: "Sucesso",
        description: "Trilha excluída com sucesso!",
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
