import { Award, Target, Users, Heart, CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import mentorPhoto from "@/assets/mentor.png";

const achievements = [
  {
    icon: Users,
    title: "1000+ Alunos",
    description: "Vidas transformadas em 3 continentes"
  },
  {
    icon: Award,
    title: "15 Anos",
    description: "De experiência em mentoria e coaching"
  },
  {
    icon: Target,
    title: "98% Satisfação",
    description: "Avaliação dos alunos"
  }
];

const expertise = [
  "Especialista em Desenvolvimento Pessoal e Identidade",
  "Mentor Financeiro Certificado",
  "Líder Espiritual e Conselheiro",
  "Autor de 3 livros best-sellers",
  "Palestrante Internacional"
];

export const AboutMentor = () => {
  return (
    <section className="py-32 px-4 bg-card/30 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto relative z-10">
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-card/30 backdrop-blur-sm mb-4">
              <Heart className="w-3 h-3 text-primary" />
              <span className="text-xs uppercase tracking-wider text-primary/80 font-medium">
                Seu Mentor
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Quem Vai Te{" "}
              <span className="text-primary font-serif italic">Guiar</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Conheça o mentor que vai <span className="font-serif italic text-primary">transformar</span> sua jornada
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Side - Photo */}
            <ScrollReveal animation="slide-left">
              <div className="relative">
                {/* Golden glow effects */}
                <div className="absolute top-1/4 left-0 w-[350px] h-[350px] bg-primary/30 rounded-full blur-[140px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] bg-primary/20 rounded-full blur-[100px]" />

                {/* Photo - sem borda */}
                <div className="relative">
                  <img
                    src={mentorPhoto}
                    alt="Seu Mentor MASTER CLASS"
                    className="relative z-10 w-full h-auto object-contain"
                  />
                </div>

                {/* Achievements Badges */}
                <div className="mt-6 grid grid-cols-3 gap-4 relative z-20">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="bg-card border border-primary/30 rounded-xl p-3 text-center hover:border-primary transition-all duration-300 hover:shadow-gold"
                    >
                      <achievement.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-sm font-bold text-foreground mb-1">
                        {achievement.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {achievement.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Right Side - Bio & Expertise */}
            <ScrollReveal animation="slide-right">
              <div className="space-y-6">
                {/* Intro */}
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-4xl font-display font-bold">
                    Uma <span className="text-primary font-serif italic">Missão</span> de Transformação
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    Há mais de 15 anos, dedico minha vida a ajudar pessoas a descobrirem seu{" "}
                    <span className="font-serif italic text-primary">verdadeiro propósito</span>,{" "}
                    construírem{" "}
                    <span className="font-serif italic text-primary">riqueza sustentável</span>{" "}
                    e desenvolverem uma{" "}
                    <span className="font-serif italic text-primary">conexão profunda com Deus</span>.
                  </p>

                  <p className="text-muted-foreground leading-relaxed">
                    Já impactei milhares de vidas em 3 continentes, e agora quero compartilhar tudo
                    que aprendi para que você também possa viver uma vida de{" "}
                    <span className="font-serif italic text-primary">plenitude</span>,{" "}
                    <span className="font-serif italic text-primary">prosperidade</span> e{" "}
                    <span className="font-serif italic text-primary">propósito</span>.
                  </p>
                </div>

                {/* Expertise List */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h4 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Credenciais & Experiência
                  </h4>
                  <div className="space-y-3">
                    {expertise.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mission Statement */}
                <div className="border-l-4 border-primary pl-6 py-2">
                  <p className="text-lg font-serif italic text-foreground leading-relaxed">
                    "Minha missão é guiar você para descobrir quem você realmente é,
                    construir a vida dos seus sonhos e viver em conexão plena com Deus.
                    Estou aqui para caminhar ao seu lado nessa jornada."
                  </p>
                  <p className="text-sm text-muted-foreground mt-3 font-semibold">
                    — Seu Mentor, MASTER CLASS
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
