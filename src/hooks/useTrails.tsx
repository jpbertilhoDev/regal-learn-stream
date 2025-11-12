import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTrails = () => {
  return useQuery({
    queryKey: ["trails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trails")
        .select("*")
        .eq("is_published", true)
        .order("order_index");

      if (error) throw error;
      return data;
    },
  });
};
