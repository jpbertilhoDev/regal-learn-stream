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

    // Wait for both auth and admin loading to complete
    if (authLoading || adminLoading) {
      console.log("AdminRoute: Still loading, waiting...");
      return;
    }

    if (!user) {
      console.log("AdminRoute: No user, redirecting to /auth");
      navigate("/auth");
      return;
    }
    
    if (!isAdmin) {
      console.log("AdminRoute: User is not admin, redirecting to /app");
      navigate("/app");
      return;
    }

    console.log("AdminRoute: User is admin, staying on page");
  }, [user, authLoading, isAdmin, adminLoading, navigate]);

  // Show loading while checking permissions
  if (authLoading || adminLoading) {
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

  // Don't render until we confirm user is admin
  if (!user || !isAdmin) {
    console.log("AdminRoute: Not rendering (no user or not admin)");
    return null;
  }

  console.log("AdminRoute: Rendering children");
  return <>{children}</>;
};
