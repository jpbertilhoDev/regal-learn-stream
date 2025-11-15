import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "./useSubscription";
import { useToast } from "./use-toast";

/**
 * Hook para proteger rotas que requerem assinatura ativa
 * Redireciona para home se usuário não tiver assinatura ativa
 */
export const useRequireSubscription = () => {
  const { subscription, loading, isActive, isPastDue } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (loading) return;

    // Se não tem subscription, redireciona
    if (!subscription) {
      toast({
        title: "Assinatura necessária",
        description: "Você precisa de uma assinatura ativa para acessar este conteúdo.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    // Se assinatura não está ativa
    if (!isActive) {
      if (isPastDue) {
        toast({
          title: "Pagamento pendente",
          description: "Seu pagamento está atrasado. Atualize seu método de pagamento.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Assinatura inativa",
          description: "Sua assinatura não está ativa. Entre em contato com o suporte.",
          variant: "destructive",
        });
      }
      navigate("/");
    }
  }, [subscription, loading, isActive, isPastDue, navigate, toast]);

  return { 
    subscription, 
    loading, 
    isActive,
    isPastDue,
    hasAccess: isActive 
  };
};


