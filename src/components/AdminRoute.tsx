import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();

  console.log("AdminRoute render:", { 
    user: user?.id, 
    authLoading, 
    isAdmin, 
    adminLoading 
  });

  useEffect(() => {
    console.log("AdminRoute useEffect:", { 
      authLoading, 
      user: user?.id, 
      adminLoading, 
      isAdmin 
    });

    if (!authLoading && !user) {
      console.log("AdminRoute: No user, redirecting to /auth");
      navigate("/auth");
      return;
    }
    
    if (!authLoading && !adminLoading && user && !isAdmin) {
      console.log("AdminRoute: User is not admin, redirecting to /app");
      navigate("/app");
      return;
    }
  }, [user, authLoading, isAdmin, adminLoading, navigate]);

  // Show loading only when actually loading
  if (authLoading || (user && adminLoading)) {
    console.log("AdminRoute: Showing loading screen");
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Don't render until we have both user and admin status
  if (!user || !isAdmin) {
    console.log("AdminRoute: Not rendering (no user or not admin)");
    return null;
  }

  console.log("AdminRoute: Rendering children");
  return <>{children}</>;
};
