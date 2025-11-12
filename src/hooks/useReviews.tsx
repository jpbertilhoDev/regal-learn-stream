import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useReviews = (trailId: string | undefined) => {
  return useQuery({
    queryKey: ["reviews", trailId],
    queryFn: async () => {
      if (!trailId) throw new Error("Trail ID is required");

      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles:user_id (
            name,
            avatar_url
          )
        `)
        .eq("trail_id", trailId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!trailId,
  });
};

export const useUserReview = (trailId: string | undefined) => {
  return useQuery({
    queryKey: ["userReview", trailId],
    queryFn: async () => {
      if (!trailId) throw new Error("Trail ID is required");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("trail_id", trailId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!trailId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      trailId, 
      rating, 
      reviewText 
    }: { 
      trailId: string; 
      rating: number; 
      reviewText?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("reviews")
        .upsert({
          trail_id: trailId,
          user_id: user.id,
          rating,
          review_text: reviewText,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.trailId] });
      queryClient.invalidateQueries({ queryKey: ["userReview", variables.trailId] });
      toast({
        title: "Avaliação publicada",
        description: "Sua avaliação foi adicionada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao publicar avaliação",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
