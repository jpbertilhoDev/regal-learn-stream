import { Link } from "react-router-dom";
import { Play, TrendingUp, Sparkles, LogOut, User } from "lucide-react";
import { TrailCard } from "@/components/TrailCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTrails } from "@/hooks/useTrails";

const AppHome = () => {
  const { user, signOut } = useAuth();
  const { data: trails, isLoading } = useTrails();

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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                {user?.email}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="hover:text-primary"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Continue Watching - será implementado na Fase 2 com dados reais */}
        {/* <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Play className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-display font-bold">Continuar Assistindo</h2>
          </div>
        </section> */}

        {/* Trails */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-display font-bold">Todas as Trilhas</h2>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Carregando trilhas...
            </div>
          ) : trails && trails.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trails.map((trail) => (
                <TrailCard
                  key={trail.id}
                  id={trail.slug}
                  title={trail.title}
                  description={trail.description}
                  image={trail.thumbnail_url || ""}
                  duration={`${Math.floor(trail.duration / 60)}h ${trail.duration % 60}min`}
                  lessonsCount={trail.lessons_count}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma trilha disponível no momento.
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AppHome;
