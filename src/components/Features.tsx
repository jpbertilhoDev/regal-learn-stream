import { Target, TrendingUp, Heart } from "lucide-react";

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
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Três Pilares para sua{" "}
            <span className="text-primary">Transformação</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Uma jornada completa de desenvolvimento pessoal, financeiro e espiritual
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-gold"
            >
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
          ))}
        </div>
      </div>
    </section>
  );
};
