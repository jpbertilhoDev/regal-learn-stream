import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "./ScrollReveal";

const faqs = [
  {
    question: "Como funciona o acesso à plataforma?",
    answer: "Após a compra, você recebe acesso imediato à plataforma. Basta fazer login com seu email e começar sua jornada nas trilhas de aprendizado.",
  },
  {
    question: "Posso parcelar o pagamento?",
    answer: "Sim! Você pode parcelar em até 12x no cartão de crédito através da Hotmart, nossa plataforma de pagamento segura.",
  },
  {
    question: "Qual a duração do acesso?",
    answer: "O acesso é vitalício! Você pode assistir as aulas quantas vezes quiser, no seu próprio ritmo, sem prazo de expiração.",
  },
  {
    question: "Vou receber certificado?",
    answer: "Sim! Ao concluir cada trilha, você recebe um certificado digital de conclusão que pode compartilhar em seu LinkedIn e redes sociais.",
  },
  {
    question: "E se eu não gostar do conteúdo?",
    answer: "Oferecemos garantia incondicional de 7 dias. Se por qualquer motivo você não ficar satisfeito, devolvemos 100% do seu investimento, sem burocracia.",
  },
  {
    question: "Tenho suporte durante as aulas?",
    answer: "Sim! Você terá acesso à comunidade exclusiva de alunos e suporte direto com os mentores para tirar suas dúvidas.",
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 px-4">
      <div className="container mx-auto">
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-card/30 backdrop-blur-sm mb-4">
              <HelpCircle className="w-3 h-3 text-primary" />
              <span className="text-xs uppercase tracking-wider text-primary/80 font-medium">
                Dúvidas
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Perguntas{" "}
              <span className="text-primary font-serif italic">Frequentes</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tire suas <span className="font-serif italic text-primary">dúvidas</span> sobre a mentoria
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} animation="slide-up" delay={index * 0.05}>
              <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/50 transition-all duration-300">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold pr-8">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300",
                      openIndex === index && "rotate-180"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    openIndex === index ? "max-h-96" : "max-h-0"
                  )}
                >
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Ainda tem dúvidas?
          </p>
          <a
            href="https://hotmart.com/pt-br/marketplace/produtos/hagsxd-mentoria-master-03j7t/M102901994X"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Entre em contato conosco →
          </a>
        </div>
      </div>
    </section>
  );
};
