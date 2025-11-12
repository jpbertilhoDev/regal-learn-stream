import { Link } from "react-router-dom";
import { Play, TrendingUp, Clock, Network, Wallet, Settings } from "lucide-react";
import { TrailCard } from "@/components/TrailCard";
import { TrailCarousel } from "@/components/TrailCarousel";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { TrailCardSkeleton } from "@/components/LoadingSkeleton";
import { useTrails } from "@/hooks/useTrails";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Progress } from "@/components/ui/progress";

const AppHome = () => {
  const { data: trails, isLoading } = useTrails();
  const { data: continueWatching } = useContinueWatching();
  const { isAdmin } = useIsAdmin();

  // Filtrar trilhas por categoria (você pode ajustar os slugs conforme necessário)
  // Organize trails by category
  const ecosystemTrails = trails?.filter(t => t.category === "ecossistema") || [];
  const financialTrails = trails?.filter(t => t.category === "financeiro") || [];
  const allTrails = trails || [];

  return (
    <>
      <SEO
        title="Início - Sua Jornada de Aprendizado"
        description="Acesse suas trilhas de aprendizado, continue de onde parou e explore novos cursos para impulsionar sua carreira."
      />
      
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border transition-all">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/app" className="text-2xl font-display font-bold text-primary">
            MASTER CLASS
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/app" className="text-sm font-medium hover:text-primary transition-colors">
              Início
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            )}
            <UserMenu />
          </nav>
        </div>
      </header>

        <main className="container mx-auto px-4 py-12">
          {/* Continue Watching */}
          {continueWatching && (
            <section className="mb-16 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Play className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-display font-bold">Continuar Assistindo</h2>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="w-full md:w-48 h-32 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                {continueWatching.thumbnail ? (
                  <img 
                    src={continueWatching.thumbnail} 
                    alt={continueWatching.lessonTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-3 w-full">
                <div>
                  <p className="text-sm text-muted-foreground">{continueWatching.trailTitle}</p>
                  <h3 className="text-xl font-semibold">{continueWatching.lessonTitle}</h3>
                </div>
                
                <Progress value={continueWatching.progressPercentage} className="w-full" />
                
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{continueWatching.progressPercentage}% concluído</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{continueWatching.remainingTime} restantes</span>
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="w-full md:w-auto" asChild>
                <Link to={`/app/lesson/${continueWatching.lessonId}`}>
                  Continuar
                </Link>
              </Button>
            </div>
          </section>
        )}

          {/* Ecossistema Section with Carousel */}
          {!isLoading && ecosystemTrails.length > 0 && (
            <div className="animate-fade-in">
              <TrailCarousel
                trails={ecosystemTrails}
                title="Ecossistema"
                icon={<Network className="w-5 h-5 text-primary" />}
              />
            </div>
          )}

          {/* Financeiro Section with Carousel */}
          {!isLoading && financialTrails.length > 0 && (
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <TrailCarousel
                trails={financialTrails}
                title="Financeiro"
                icon={<Wallet className="w-5 h-5 text-primary" />}
              />
            </div>
          )}

          {/* All Trails */}
          <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-display font-bold">Todas as Trilhas</h2>
            </div>
            
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <TrailCardSkeleton key={i} />
                ))}
              </div>
            ) : allTrails && allTrails.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allTrails.map((trail, index) => (
                  <div
                    key={trail.id}
                    className="animate-fade-in hover-scale"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TrailCard
                      id={trail.slug}
                      title={trail.title}
                      description={trail.description}
                      image={trail.thumbnail_url || ""}
                      duration={`${Math.floor(trail.duration / 60)}h ${trail.duration % 60}min`}
                      lessonsCount={trail.lessons_count}
                    />
                  </div>
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
    </>
  );
};

export default AppHome;
