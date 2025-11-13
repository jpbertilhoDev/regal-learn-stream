import { Star, Quote, Users } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

const testimonials = [
  {
    name: "Ana Paula Silva",
    role: "Empresária",
    content: "A mentoria MASTER CLASS mudou completamente minha perspectiva sobre finanças e propósito. Hoje tenho clareza do meu caminho e meu negócio cresceu 300%.",
    rating: 5,
    result: "Negócio cresceu 300%"
  },
  {
    name: "Carlos Eduardo Santos",
    role: "Consultor Financeiro",
    content: "Nunca imaginei que poderia ter uma vida espiritual tão profunda enquanto construo riqueza. O equilíbrio que encontrei aqui é transformador.",
    rating: 5,
    result: "Equilíbrio total"
  },
  {
    name: "Mariana Costa",
    role: "Coach de Carreira",
    content: "Descobri minha verdadeira identidade e propósito. As aulas são práticas e diretas, mudaram minha vida pessoal e profissional completamente.",
    rating: 5,
    result: "Nova carreira"
  },
  {
    name: "Roberto Almeida",
    role: "Empreendedor",
    content: "Depois da mentoria, organizei minhas finanças, invisto com sabedoria e ainda fortaleço minha fé todos os dias. Valeu cada centavo!",
    rating: 5,
    result: "Investidor consciente"
  },
  {
    name: "Juliana Ferreira",
    role: "Psicóloga",
    content: "Os três pilares trabalhando juntos são poderosos. Hoje vivo com propósito, prosperidade e paz. Recomendo de olhos fechados!",
    rating: 5,
    result: "Vida com propósito"
  },
  {
    name: "Fernando Oliveira",
    role: "Pastor",
    content: "Como líder espiritual, encontrei aqui ferramentas práticas para ajudar minha comunidade a prosperar em todas as áreas da vida.",
    rating: 5,
    result: "Liderança transformada"
  }
];

// Split testimonials into 3 columns
const firstColumn = testimonials.slice(0, 2);
const secondColumn = testimonials.slice(2, 4);
const thirdColumn = testimonials.slice(4, 6);

const TestimonialsColumn = (props: {
  testimonials: typeof testimonials;
  className?: string;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 20,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map((testimonial, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-gold max-w-sm w-full"
                >
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className="w-10 h-10 text-primary/20" />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <Star key={starIndex} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>

                  {/* Author Info */}
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3">
                      {/* Avatar Placeholder */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/30">
                        <span className="text-primary font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>

                      {/* Name & Role */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    {/* Result Badge */}
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <span className="text-xs text-primary font-semibold">
                        ✓ {testimonial.result}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

export const Testimonials = () => {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-card/30 backdrop-blur-sm mb-4">
            <Users className="w-3 h-3 text-primary" />
            <span className="text-xs uppercase tracking-wider text-primary/80 font-medium">
              Depoimentos
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            O Que Nossos{" "}
            <span className="text-primary font-serif italic">Alunos Dizem</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Milhares de vidas <span className="font-serif italic text-primary">transformadas</span> pela mentoria MASTER CLASS
          </p>
        </div>

        {/* Animated Testimonials Columns */}
        <div className="flex justify-center gap-6 max-w-7xl mx-auto [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>

        {/* Social Proof Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-8 bg-card border-2 border-primary/30 rounded-2xl px-8 py-6">
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-primary mb-1">1000+</div>
              <div className="text-sm text-muted-foreground">Alunos Ativos</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border" />
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">Avaliação Média</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-primary mb-1">98%</div>
              <div className="text-sm text-muted-foreground">Satisfação</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
