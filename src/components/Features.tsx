import { Target, TrendingUp, Heart, GraduationCap, ArrowRight } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Target,
    title: "Identidade & Propósito",
    description: "Descubra quem você é e qual o seu propósito de vida através de mentorias profundas."
  },
  {
    icon: TrendingUp,
    title: "Finanças Inteligentes",
    description: "Aprenda a gerenciar suas finanças e construir riqueza de forma sustentável."
  },
  {
    icon: Heart,
    title: "Vida com Deus",
    description: "Fortaleça sua vida espiritual e desenvolva uma conexão profunda com Deus."
  }
];

export const Features = () => {
  return (
    <section className="py-32 px-4">
      <div className="container mx-auto">
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-card/30 backdrop-blur-sm mb-4">
              <GraduationCap className="w-3 h-3 text-primary" />
              <span className="text-xs uppercase tracking-wider text-primary/80 font-medium">
                Aprendizado
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Três Pilares para sua{" "}
              <span className="text-primary font-serif italic">Transformação</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Uma jornada completa de desenvolvimento pessoal, financeiro e espiritual
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <ScrollReveal
              key={index}
              animation="slide-up"
              delay={index * 0.1}
            >
              <div className="group relative bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-gold h-full">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-gradient-gold transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>

                <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl" />
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Intermediate CTA */}
        <ScrollReveal animation="scale-in" delay={0.4}>
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Estes três pilares trabalhando juntos vão <span className="font-serif italic text-primary">transformar completamente</span> sua vida
            </p>
            <a
              href="https://hotmart.com/pt-br/marketplace/produtos/hagsxd-mentoria-master-03j7t/M102901994X"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-gradient-gold hover:shadow-gold-lg shadow-gold transition-all duration-300 text-base px-10 py-7 h-auto font-bold uppercase tracking-wider group"
              >
                Quero Começar Minha Transformação
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
