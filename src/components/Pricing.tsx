import { Check, Sparkles, Wallet } from "lucide-react";
import { PaymentOptions } from "@/components/PaymentOptions";
import { ScrollReveal } from "./ScrollReveal";

const benefits = [
  "Acesso vitalício a todas as trilhas",
  "Aulas práticas e aplicáveis",
  "Certificado de conclusão",
  "Suporte direto com mentores",
  "Comunidade exclusiva de alunos",
  "Atualizações de conteúdo gratuitas",
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-32 px-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container mx-auto relative z-10">
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-card/30 backdrop-blur-sm mb-4">
              <Wallet className="w-3 h-3 text-primary" />
              <span className="text-xs uppercase tracking-wider text-primary/80 font-medium">
                Investimento
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Invista em sua{" "}
              <span className="text-primary font-serif italic">Transformação</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Condição especial <span className="font-serif italic text-primary">por tempo limitado</span>
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="scale-in" delay={0.2}>
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-card border-2 border-primary/50 rounded-2xl p-8 md:p-12 hover:border-primary transition-all duration-300 hover:shadow-gold-lg">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Left Side - Pricing */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-display font-bold mb-2">
                      Mentoria MASTER CLASS
                    </h3>
                    <p className="text-muted-foreground">
                      Acesso completo à plataforma
                    </p>
                  </div>

                  {/* Price */}
                  <div className="space-y-4">
                    {/* From Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground line-through text-xl">
                        De R$ 6.000
                      </span>
                      <span className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-semibold">
                        -58%
                      </span>
                    </div>

                    {/* Main Price - 12x */}
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-muted-foreground text-lg">12x de</span>
                        <span className="text-6xl md:text-7xl font-display font-bold text-primary">
                          R$ 208
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        ou <span className="text-primary font-semibold text-lg">R$ 2.500</span> à vista
                      </p>
                    </div>
                  </div>

                  {/* Payment Options will be shown in a separate section below */}

                  <p className="text-center text-xs text-muted-foreground">
                    Pagamento seguro via Hotmart
                  </p>
                </div>

                {/* Right Side - Benefits */}
                <div className="space-y-4">
                  <h4 className="text-xl font-display font-bold mb-6">
                    O que está incluído:
                  </h4>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 group"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-gradient-gold transition-all duration-300">
                          <Check className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                        </div>
                        <span className="text-foreground leading-relaxed">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-6 border-t border-border mt-8">
                    <div className="flex flex-wrap gap-4 items-center justify-center text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500" />
                        <span>Acesso Imediato</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500" />
                        <span>Garantia de 7 dias</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500" />
                        <span>Certificado Incluso</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Payment Options Section */}
        <ScrollReveal animation="scale-in" delay={0.4}>
          <div className="max-w-5xl mx-auto mt-16">
            <PaymentOptions amount={208} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
