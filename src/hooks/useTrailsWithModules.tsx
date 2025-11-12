import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTrailsWithModules = () => {
  return useQuery({
    queryKey: ["trailsWithModules"],
    queryFn: async () => {
      // Buscar trilhas publicadas
      const { data: trails, error: trailsError } = await supabase
        .from("trails")
        .select("*")
        .eq("is_published", true)
        .order("order_index");

      if (trailsError) throw trailsError;

      // Para cada trilha, buscar seus módulos
      const trailsWithModules = await Promise.all(
        (trails || []).map(async (trail) => {
          const { data: modules, error: modulesError } = await supabase
            .from("modules")
            .select(`
              *,
              lessons:lessons(count)
            `)
            .eq("trail_id", trail.id)
            .order("order_index");

          if (modulesError) throw modulesError;

          return {
            ...trail,
            modules: modules || [],
          };
        })
      );

      return trailsWithModules;
    },
  });
};
