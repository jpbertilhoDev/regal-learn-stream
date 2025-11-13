import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export const FinalCTA = () => {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/10 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto relative z-10">
        <ScrollReveal animation="scale-in">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-card/30 backdrop-blur-sm mb-6">
              <Clock className="w-3 h-3 text-primary" />
              <span className="text-xs uppercase tracking-wider text-primary/80 font-medium">
                Última Oportunidade
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Sua{" "}
              <span className="text-primary font-serif italic">Transformação</span>
              {" "}Começa <span className="font-serif italic text-primary">Agora</span>
            </h2>

            {/* Description */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Não deixe para depois. Milhares de pessoas já estão <span className="font-serif italic text-primary">transformando suas vidas</span>. Junte-se a elas <span className="font-serif italic text-primary">hoje mesmo</span>.
            </p>

            {/* Pricing Highlight */}
            <div className="bg-card border-2 border-primary/50 rounded-2xl p-8 mb-8 max-w-2xl mx-auto hover:border-primary transition-all duration-300 hover:shadow-gold">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left flex-1">
                  <p className="text-muted-foreground mb-2">
                    Investimento único de
                  </p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl md:text-5xl font-display font-bold text-primary">
                      12x R$ 208
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ou R$ 2.500 à vista
                  </p>
                </div>

                <a
                  href="https://hotmart.com/pt-br/marketplace/produtos/hagsxd-mentoria-master-03j7t/M102901994X"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto"
                >
                  <Button
                    size="lg"
                    className="w-full bg-gradient-gold hover:shadow-gold-lg shadow-gold transition-all duration-300 text-base px-10 py-7 h-auto font-bold uppercase tracking-wider"
                  >
                    Garantir Minha Vaga
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Trust Elements */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Acesso Imediato</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Garantia de 7 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Pagamento Seguro</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
