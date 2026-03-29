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
    
    // Validar email
    if (!email || !email.includes("@")) {
      toast({
        title: "❌ Email inválido",
        description: "Por favor, digite um email válido.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Verificar se as variáveis de ambiente estão configuradas
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Configuração do sistema incompleta. Verifique as variáveis de ambiente.");
      }

      const redirectUrl = `${window.location.origin}/create-password`;
      
      // Tentar método normal primeiro
      let error: any = null;
      try {
        const result = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });
        error = result.error;
      } catch (err: any) {
        // Capturar erros de rede ou outros erros não tratados
        error = err;
      }

      // Se der erro 429 (rate limit), tentar Edge Function como fallback
      const isRateLimit = error && (
        error.message?.includes("429") || 
        error.message?.includes("rate limit") || 
        error.status === 429 ||
        error.code === "429" ||
        (error.message?.toLowerCase().includes("too many requests"))
      );

      if (isRateLimit) {
        console.log("Rate limit detectado, tentando Edge Function como fallback...");
        
        try {
          const functionUrl = `${supabaseUrl}/functions/v1/reset-password`;
          const response = await fetch(functionUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseKey}`,
              "apikey": supabaseKey,
            },
            body: JSON.stringify({ email }),
          }).catch((fetchError) => {
            // Se der erro de rede (função não existe ou não acessível)
            console.error("Erro ao chamar Edge Function:", fetchError);
            throw new Error("Função de recuperação não disponível. Aguarde 10 minutos e tente novamente. Alternativa: acesse https://supabase.com/dashboard/project/tzdatllacntstuaoabou/auth/users para resetar sua senha manualmente.");
          });

          // Verificar se a função existe (404 = não deployada)
          if (response.status === 404) {
            throw new Error("Função de recuperação não disponível. Aguarde 10 minutos e tente novamente, ou use o dashboard do Supabase.");
          }

          // Verificar se houve erro de rede
          if (!response.ok && response.status !== 429) {
            const errorText = await response.text();
            let result;
            try {
              result = JSON.parse(errorText);
            } catch {
              throw new Error("Erro ao conectar com o servidor. Tente novamente em alguns minutos.");
            }

            if (result.code === "RATE_LIMIT") {
              throw new Error("Muitas tentativas. Aguarde 10 minutos e tente novamente.");
            }
            if (result.code === "USER_NOT_FOUND") {
              throw new Error("Email não encontrado. Verifique se digitou corretamente.");
            }
            throw new Error(result.error || "Erro ao enviar email de recuperação.");
          }

          // Se ainda der 429 na Edge Function, mostrar mensagem clara
          if (response.status === 429) {
            throw new Error("Muitas tentativas. Aguarde 10 minutos e tente novamente. Você pode também usar o dashboard do Supabase para resetar sua senha.");
          }

          const result = await response.json();

          // Sucesso via Edge Function
          setEmailSent(true);
          toast({
            title: "✅ Email enviado com sucesso!",
            description: "Verifique sua caixa de entrada (e SPAM) nos próximos minutos.",
          });
          
          setTimeout(() => {
            setEmailSent(false);
          }, 60000);
          
          return;
        } catch (fallbackError: any) {
          // Se a Edge Function falhar (não existe, erro de rede, etc)
          console.error("Erro na Edge Function:", fallbackError);
          
          // Se for erro de rede/Failed to fetch, mostrar mensagem específica
          if (fallbackError.message?.includes("Failed to fetch") || 
              fallbackError.message?.includes("NetworkError") ||
              fallbackError.name === "TypeError" ||
              fallbackError.message?.includes("não disponível")) {
            throw new Error(fallbackError.message || "Muitas tentativas detectadas. Aguarde 10 minutos e tente novamente. Alternativa: acesse https://supabase.com/dashboard/project/tzdatllacntstuaoabou/auth/users para resetar sua senha manualmente.");
          }
          
          // Para outros erros, usar a mensagem do erro
          throw new Error(fallbackError.message || "Muitas tentativas. Aguarde 10 minutos e tente novamente.");
        }
      }

      if (error) {
        // Tratar erro específico de rate limit de email
        if (error.message?.includes("email rate limit exceeded") || 
            error.message?.includes("rate limit exceeded") ||
            error.message?.toLowerCase().includes("email rate limit")) {
          throw new Error("Limite de envio de emails excedido. O Supabase limita o número de emails por hora. Aguarde 1 hora e tente novamente. Alternativa: acesse https://supabase.com/dashboard/project/tzdatllacntstuaoabou/auth/users para resetar sua senha manualmente.");
        }
        
        // Tratar outros erros específicos
        if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
          throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
        }
        
        if (error.message?.includes("Invalid email")) {
          throw new Error("Email inválido. Verifique se digitou corretamente.");
        }
        
        // Para outros erros, mostrar mensagem genérica mas útil
        console.error("Erro ao resetar senha:", error);
        throw new Error(error.message || "Não foi possível enviar o email. Tente novamente em alguns minutos.");
      }

      // Sucesso via método normal
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
      console.error("Erro completo:", error);
      
      // Tratar erro específico de rate limit de email
      let errorMessage = error.message || "Tente novamente em alguns minutos.";
      
      if (error.message?.includes("email rate limit exceeded") || 
          error.message?.includes("rate limit exceeded") ||
          error.message?.toLowerCase().includes("email rate limit") ||
          error.message?.includes("magiclink")) {
        errorMessage = "Limite de envio de emails excedido. O Supabase limita o número de emails por hora. Aguarde 1 hora e tente novamente. Alternativa: acesse https://supabase.com/dashboard/project/tzdatllacntstuaoabou/auth/users para resetar sua senha manualmente.";
      }
      
      toast({
        title: "❌ Erro ao enviar email",
        description: errorMessage,
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
