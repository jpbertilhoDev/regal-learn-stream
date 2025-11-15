import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CreatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Validar token ao carregar a página
  useEffect(() => {
    const validateToken = async () => {
      const accessToken = searchParams.get("access_token");
      const type = searchParams.get("type");

      if (!accessToken || type !== "recovery") {
        setIsTokenValid(false);
        toast({
          title: "Link inválido",
          description: "Este link expirou ou é inválido. Solicite um novo.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/auth"), 3000);
        return;
      }

      // Token válido
      setIsTokenValid(true);
    };

    validateToken();
  }, [searchParams, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter no mínimo 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Atualizar senha
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      // Sucesso! Mostrar mensagem e redirecionar
      toast({
        title: "🎉 Senha criada com sucesso!",
        description: "Você será redirecionado para o login.",
      });

      // Aguardar 2 segundos e redirecionar
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Erro ao criar senha",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading enquanto valida o token
  if (isTokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Validando link...</p>
        </div>
      </div>
    );
  }

  // Se token inválido, mostrar mensagem de erro
  if (isTokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-gold text-center">
            <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-2">Link Inválido</h1>
            <p className="text-muted-foreground mb-6">
              Este link expirou ou é inválido. Solicite um novo link na página de login.
            </p>
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-gradient-gold hover:shadow-gold-lg transition-all duration-300"
            >
              Ir para o Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Formulário de criar senha
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Bem-vindo à MASTER CLASS! 🎉
          </h1>
          <p className="text-muted-foreground">
            Seu pagamento foi confirmado. Crie sua senha para acessar.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-gold">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Box */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-foreground mb-1">
                    Crie uma senha segura para proteger sua conta.
                  </p>
                  <p className="text-muted-foreground">
                    Mínimo de 6 caracteres.
                  </p>
                </div>
              </div>
            </div>

            {/* Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-secondary border-border focus:border-primary transition-colors"
              />
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="bg-secondary border-border focus:border-primary transition-colors"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-gold hover:shadow-gold-lg transition-all duration-300 h-12 font-semibold"
            >
              {isLoading ? "Criando senha..." : "Criar Senha e Acessar"}
            </Button>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      password.length < 6 
                        ? "w-1/3 bg-destructive" 
                        : password.length < 10 
                        ? "w-2/3 bg-yellow-500" 
                        : "w-full bg-green-500"
                    }`}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {password.length < 6 
                    ? "Senha fraca" 
                    : password.length < 10 
                    ? "Senha média" 
                    : "Senha forte"}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Após criar sua senha, você será redirecionado para o login.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;


