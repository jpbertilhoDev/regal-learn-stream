import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StripeCheckoutButton } from "@/components/StripeCheckoutButton";
import heroBg from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="space-y-8 max-w-5xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black mb-8 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight leading-none">
            MASTER CLASS
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Transforme sua vida com mentorias exclusivas em{" "}
            <span className="text-primary font-serif italic font-semibold">Identidade</span>,{" "}
            <span className="text-primary font-serif italic font-semibold">Finanças</span> e{" "}
            <span className="text-primary font-serif italic font-semibold">Vida com Deus</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <StripeCheckoutButton
              priceType="oneTime"
              size="lg"
              className="bg-gradient-gold hover:shadow-gold-lg shadow-gold transition-all duration-300 text-base px-10 py-7 h-auto font-bold uppercase tracking-wider group"
            >
              Garantir Minha Vaga
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </StripeCheckoutButton>

            <Button
              size="lg"
              variant="outline"
              className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary transition-all duration-300 text-lg px-8 py-6 h-auto"
              asChild
            >
              <Link to="/auth">
                Já Sou Aluno
              </Link>
            </Button>
          </div>
          </div>
        </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  );
};
