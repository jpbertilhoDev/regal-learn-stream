import { ScrollReveal } from "./ScrollReveal";

const stats = [
  {
    number: "3",
    label: "Pilares de Transformação",
    description: "Identidade, Finanças e Vida com Deus"
  },
  {
    number: "50+",
    label: "Aulas Exclusivas",
    description: "Conteúdo prático e aplicável"
  },
  {
    number: "100%",
    label: "Acesso Vitalício",
    description: "Aprenda no seu próprio ritmo"
  }
];

export const Stats = () => {
  return (
    <section className="py-16 px-4 border-y border-border/50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} animation="scale-in" delay={index * 0.1}>
              <div className="text-center group">
                <div className="mb-3">
                  <span className="text-5xl md:text-6xl font-display font-black text-primary tracking-tight">
                    {stat.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {stat.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
