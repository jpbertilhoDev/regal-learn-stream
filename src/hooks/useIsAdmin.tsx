import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useIsAdmin = () => {
  const { user } = useAuth();

  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log("useIsAdmin: No user ID");
        return false;
      }

      console.log("useIsAdmin: Checking admin status for user:", user.id);

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle(); // Changed from .single() to .maybeSingle()

      console.log("useIsAdmin: Query result:", { data, error });

      if (error) {
        console.error("useIsAdmin: Error checking admin status:", error);
        return false;
      }
      
      const result = !!data;
      console.log("useIsAdmin: Is admin?", result);
      return result;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
  });

  console.log("useIsAdmin hook result:", { isAdmin, isLoading, userId: user?.id });

  return { isAdmin: isAdmin ?? false, isLoading };
};
