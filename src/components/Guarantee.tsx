import { Shield, Check, BadgeCheck } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export const Guarantee = () => {
  return (
    <section className="py-32 px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Icon */}
            <ScrollReveal animation="slide-left">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                  <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/50">
                    <Shield className="w-24 h-24 md:w-32 md:h-32 text-primary" />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Side - Content */}
            <ScrollReveal animation="slide-right">
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-card/30 backdrop-blur-sm mb-4">
                    <BadgeCheck className="w-3 h-3 text-primary" />
                    <span className="text-xs uppercase tracking-wider text-primary/80 font-medium">
                      Sem Riscos
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    Garantia <span className="font-serif italic text-primary">Incondicional</span> de{" "}
                    <span className="text-primary">7 Dias</span>
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Experimente a mentoria MASTER CLASS <span className="font-serif italic text-primary">sem riscos</span>. Se você não
                    ficar 100% satisfeito, <span className="font-serif italic text-primary">devolvemos seu dinheiro</span>.
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Risco Zero</h4>
                      <p className="text-muted-foreground text-sm">
                        Teste todo o conteúdo por 7 dias completos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Reembolso Rápido</h4>
                      <p className="text-muted-foreground text-sm">
                        Processo simples e sem burocracia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Sem Perguntas</h4>
                      <p className="text-muted-foreground text-sm">
                        Não gostou? Devolvemos 100% do seu investimento
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground italic">
                    "Estamos tão confiantes na qualidade da mentoria que oferecemos
                    garantia total. Sua satisfação é nossa prioridade."
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
