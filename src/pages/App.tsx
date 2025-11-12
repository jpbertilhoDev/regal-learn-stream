import { Link } from "react-router-dom";
import { Play, TrendingUp, Sparkles } from "lucide-react";
import { TrailCard } from "@/components/TrailCard";
import trailIdentity from "@/assets/trail-identity.jpg";
import trailFinances from "@/assets/trail-finances.jpg";
import trailFaith from "@/assets/trail-faith.jpg";

const trails = [
  {
    id: "identidade-proposito",
    title: "Identidade & Propósito",
    description: "Descubra quem você realmente é e qual o seu propósito de vida",
    image: trailIdentity,
    duration: "6h 30min",
    lessonsCount: 12
  },
  {
    id: "financas",
    title: "Finanças Inteligentes",
    description: "Domine suas finanças pessoais e construa riqueza sustentável",
    image: trailFinances,
    duration: "8h 15min",
    lessonsCount: 15
  },
  {
    id: "vida-com-deus",
    title: "Vida com Deus",
    description: "Desenvolva uma conexão profunda e transformadora com Deus",
    image: trailFaith,
    duration: "7h 45min",
    lessonsCount: 14
  }
];

const AppHome = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/app" className="text-2xl font-display font-bold text-primary">
            MASTER CLASS
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/app" className="text-sm font-medium hover:text-primary transition-colors">
              Início
            </Link>
            <Link to="/app" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Minha Conta
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Continue Watching */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Play className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-display font-bold">Continuar Assistindo</h2>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-gold cursor-pointer">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-80 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={trailIdentity}
                  alt="Continue assistindo"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-xs text-primary uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3" />
                  Em Progresso
                </div>
                <h3 className="text-xl font-display font-bold mb-2">
                  Descobrindo Seu Propósito
                </h3>
                <p className="text-muted-foreground mb-4">
                  Aula 3 de 12 • Identidade & Propósito
                </p>
                
                {/* Progress Bar */}
                <div className="w-full bg-secondary rounded-full h-2 mb-4">
                  <div className="bg-gradient-gold h-2 rounded-full" style={{ width: '35%' }} />
                </div>
                
                <p className="text-sm text-muted-foreground">
                  15 minutos restantes
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trails */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-display font-bold">Todas as Trilhas</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trails.map((trail) => (
              <TrailCard key={trail.id} {...trail} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AppHome;
