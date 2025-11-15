import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { user, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevenir múltiplos cliques
    if (isLoading || emailSent) return;
    
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/create-password`,
      });

      if (error) {
        // Tratar erro de rate limit de forma amigável
        if (error.message.includes("429") || error.message.includes("rate limit")) {
          throw new Error("Muitas tentativas. Aguarde 10 minutos e tente novamente.");
        }
        throw error;
      }

      // Marcar email como enviado
      setEmailSent(true);

      toast({
        title: "✅ Email enviado com sucesso!",
        description: "Verifique sua caixa de entrada (e SPAM) nos próximos minutos.",
      });
      
      // Resetar após 60 segundos (permitir reenvio)
      setTimeout(() => {
        setEmailSent(false);
      }, 60000);
      
    } catch (error: any) {
      toast({
        title: "❌ Erro ao enviar email",
        description: error.message || "Tente novamente em alguns minutos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>

        {/* Auth Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-gold">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-primary mb-2">
              MASTER CLASS
            </h1>
            <p className="text-muted-foreground">
              {isForgotPassword ? "Ativar/Recuperar Senha" : "Acesse sua conta"}
            </p>
          </div>

          {isForgotPassword ? (
            // Forgot Password Form
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-foreground mb-1 font-semibold">
                      {emailSent ? "Email enviado!" : "Digite o email usado no pagamento"}
                    </p>
                    <p className="text-muted-foreground">
                      {emailSent 
                        ? "Verifique sua caixa de entrada e SPAM nos próximos minutos."
                        : "Enviaremos um link para você criar ou redefinir sua senha."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@usado-no-pagamento.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary border-border focus:border-primary transition-colors"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading || emailSent}
                className="w-full bg-gradient-gold hover:shadow-gold-lg transition-all duration-300 h-12 font-semibold"
              >
                {isLoading 
                  ? "Enviando..." 
                  : emailSent 
                  ? "✅ Email Enviado! Verifique sua caixa" 
                  : "Enviar Link de Recuperação"}
              </Button>
              
              {emailSent && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    ✅ Email enviado com sucesso! Verifique sua caixa de entrada e SPAM.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Você poderá reenviar em 60 segundos, se necessário.
                  </p>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => setIsForgotPassword(false)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Voltar para o login
                </button>
              </div>
            </form>
          ) : (
            // Login Form
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@usado-no-pagamento.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-secondary border-border focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs text-primary hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-secondary border-border focus:border-primary transition-colors"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-gold hover:shadow-gold-lg transition-all duration-300 h-12 font-semibold"
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
