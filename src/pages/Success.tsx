import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, loading: subLoading, refetch } = useSubscription();
  const [checking, setChecking] = useState(true);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // If no session_id, redirect to home
    if (!sessionId) {
      navigate("/");
      return;
    }

    // If user not logged in, show login prompt
    if (!user) {
      setChecking(false);
      return;
    }

    // Check for subscription activation
    const checkSubscription = async () => {
      await refetch();
      setChecking(false);
    };

    checkSubscription();
  }, [sessionId, user, navigate, refetch]);

  const handleContinue = () => {
    if (user) {
      navigate("/app");
    } else {
      navigate("/auth");
    }
  };

  if (checking || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando seu pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold">
            Pagamento Confirmado! 🎉
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Seu pagamento foi processado com sucesso. Bem-vindo à{" "}
            <span className="text-primary font-serif italic font-semibold">
              MASTER CLASS
            </span>
            !
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-card border border-border rounded-2xl p-8 text-left space-y-6">
          <h2 className="text-2xl font-display font-bold text-center">
            Próximos Passos
          </h2>

          <div className="space-y-4">
            {user ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Acesso Liberado</h3>
                    <p className="text-muted-foreground text-sm">
                      Seu acesso à plataforma já está ativo!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Explore as Trilhas</h3>
                    <p className="text-muted-foreground text-sm">
                      Acesse agora os 3 pilares: Identidade, Finanças e Vida com Deus
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Recibo por E-mail</h3>
                    <p className="text-muted-foreground text-sm">
                      Enviamos um recibo para {user.email}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Faça Login</h3>
                    <p className="text-muted-foreground text-sm">
                      Entre com o e-mail usado na compra para acessar o conteúdo
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Primeiro Acesso</h3>
                    <p className="text-muted-foreground text-sm">
                      Se é seu primeiro acesso, crie uma senha para sua conta
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Comece sua Jornada</h3>
                    <p className="text-muted-foreground text-sm">
                      Acesse todas as trilhas e comece sua transformação
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Subscription Status */}
        {subscription && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              Status da Assinatura:{" "}
              <span className="font-semibold text-primary">
                {subscription.status === "active" && "Ativa ✓"}
                {subscription.status === "trialing" && "Período de Teste"}
                {subscription.status === "past_due" && "Pagamento Pendente"}
              </span>
            </p>
          </div>
        )}

        {/* CTA */}
        <Button
          size="lg"
          onClick={handleContinue}
          className="bg-gradient-gold hover:shadow-gold-lg shadow-gold transition-all duration-300 text-base px-10 py-7 h-auto font-bold uppercase tracking-wider"
        >
          {user ? "Acessar Plataforma" : "Fazer Login"}
        </Button>

        {/* Support */}
        <p className="text-sm text-muted-foreground">
          Precisa de ajuda?{" "}
          <a href="mailto:suporte@masterclass.com" className="text-primary hover:underline">
            Entre em contato
          </a>
        </p>
      </div>
    </div>
  );
};

export default Success;
