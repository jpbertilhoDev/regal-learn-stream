import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { PRODUCTS } from "@/lib/stripe";

interface StripeCheckoutButtonProps {
  priceType?: "monthly" | "oneTime";
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const StripeCheckoutButton = ({
  priceType = "monthly",
  children,
  className,
  size = "lg",
  variant = "default",
}: StripeCheckoutButtonProps) => {
  const { user } = useAuth();
  const { createCheckoutSession } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    // If user not logged in, redirect to auth first
    if (!user) {
      toast({
        title: "Faça login primeiro",
        description: "Você precisa estar logado para assinar.",
      });
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);

      // Get the price ID based on selection
      const priceId = PRODUCTS.MASTER_CLASS[priceType].priceId;

      // Create checkout session
      const { url } = await createCheckoutSession(priceId);

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Erro ao processar",
        description: "Não foi possível iniciar o checkout. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Processando...
        </>
      ) : (
        children
      )}
    </Button>
  );
};
