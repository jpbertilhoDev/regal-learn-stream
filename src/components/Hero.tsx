import { Link } from "react-router-dom";
import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-card/50 backdrop-blur-sm mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm uppercase tracking-wider text-primary font-medium">
            Plataforma Exclusiva
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          MASTER CLASS
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
          Transforme sua vida com mentorias exclusivas em{" "}
          <span className="text-primary font-semibold">Identidade</span>,{" "}
          <span className="text-primary font-semibold">Finanças</span> e{" "}
          <span className="text-primary font-semibold">Vida com Deus</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-gradient-gold hover:shadow-gold-lg transition-all duration-300 text-lg px-8 py-6 h-auto font-semibold"
            asChild
          >
            <Link to="/auth">
              <Play className="w-5 h-5 mr-2" />
              Começar Agora
            </Link>
          </Button>

          <Button 
            size="lg" 
            variant="outline"
            className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary transition-all duration-300 text-lg px-8 py-6 h-auto"
            asChild
          >
            <Link to="/auth">
              Fazer Login
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20 pt-12 border-t border-border/50">
          <div>
            <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">3</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">Pilares</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">Aulas</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">Premium</div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  );
};
