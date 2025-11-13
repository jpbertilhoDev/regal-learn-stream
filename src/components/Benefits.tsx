import { CheckCircle2, TrendingUp, Heart, Target, DollarSign, Award, ArrowRight } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Target,
    category: "Identidade & Propósito",
    title: "Descubra Quem Você Realmente É",
    description: "Clareza sobre seu propósito de vida e direção para tomar decisões alinhadas com seus valores.",
    results: [
      "Autoconhecimento profundo e autenticidade",
      "Direcionamento claro para suas escolhas",
      "Confiança para viver sua verdadeira essência"
    ]
  },
  {
    icon: DollarSign,
    category: "Finanças Inteligentes",
    title: "Construa Riqueza Sustentável",
    description: "Domine o controle financeiro e aprenda estratégias práticas para multiplicar seu patrimônio.",
    results: [
      "Organização financeira completa",
      "Estratégias comprovadas de investimento",
      "Mentalidade abundante e próspera"
    ]
  },
  {
    icon: Heart,
    category: "Vida com Deus",
    title: "Fortaleça Sua Fé e Espiritualidade",
    description: "Desenvolva uma conexão profunda com Deus e viva com propósito espiritual.",
    results: [
      "Relacionamento íntimo com Deus",
      "Paz interior e equilíbrio emocional",
      "Vida guiada por princípios sólidos"
    ]
  }
];

export const Benefits = () => {
  return (
    <section className="py-32 px-4 bg-card/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto relative z-10">
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-card/30 backdrop-blur-sm mb-4">
              <Award className="w-3 h-3 text-primary" />
              <span className="text-xs uppercase tracking-wider text-primary/80 font-medium">
                Resultados
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              O Que Você Vai{" "}
              <span className="text-primary font-serif italic">Conquistar</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Transformação completa em <span className="font-serif italic text-primary">todas as áreas</span> da sua vida
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto space-y-6">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={index} animation="slide-up" delay={index * 0.1}>
              <div className="group bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-gold">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Icon & Category */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300 border border-primary/20">
                      <benefit.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">
                        {benefit.category}
                      </p>
                      <h3 className="text-2xl md:text-3xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>

                    {/* Results List */}
                    <div className="space-y-3">
                      {benefit.results.map((result, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-foreground leading-relaxed">
                            {result}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>Resultados comprovados por centenas de alunos</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA Preview */}
        <ScrollReveal animation="scale-in" delay={0.4}>
          <div className="text-center mt-16 bg-card border-2 border-primary/30 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto hover:border-primary transition-all duration-300 hover:shadow-gold">
            <p className="text-xl md:text-2xl font-display font-semibold mb-4">
              Pronto para sua{" "}
              <span className="text-primary font-serif italic">Transformação Completa</span>?
            </p>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Veja abaixo as <span className="font-serif italic text-primary">condições especiais</span> para começar hoje mesmo
            </p>
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary transition-all duration-300 px-10 py-7 h-auto font-bold uppercase tracking-wider group"
              >
                Ver Investimento
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
