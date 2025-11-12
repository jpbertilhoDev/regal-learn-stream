import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useAdminModules = (trailId?: string) => {
  return useQuery({
    queryKey: ["adminModules", trailId],
    queryFn: async () => {
      let query = supabase
        .from("modules")
        .select(`
          *,
          trail:trails(id, title, slug)
        `)
        .order("order_index", { ascending: true });

      if (trailId) {
        query = query.eq("trail_id", trailId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (module: any) => {
      const { data, error } = await supabase
        .from("modules")
        .insert(module)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminModules"] });
      toast({
        title: "Sucesso",
        description: "Módulo criado com sucesso!",
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

export const useUpdateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...module }: any) => {
      const { data, error } = await supabase
        .from("modules")
        .update(module)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminModules"] });
      toast({
        title: "Sucesso",
        description: "Módulo atualizado com sucesso!",
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

export const useDeleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("modules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminModules"] });
      toast({
        title: "Sucesso",
        description: "Módulo excluído com sucesso!",
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

export const useReorderModules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (modules: Array<{ id: string; order_index: number }>) => {
      const promises = modules.map((module) =>
        supabase
          .from("modules")
          .update({ order_index: module.order_index })
          .eq("id", module.id)
      );

      const results = await Promise.all(promises);
      const error = results.find((r) => r.error)?.error;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminModules"] });
      toast({
        title: "Sucesso",
        description: "Ordem dos módulos atualizada!",
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
