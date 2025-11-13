import { Link } from "react-router-dom";
import { Play, TrendingUp, Clock, Network, Wallet, Settings, Award } from "lucide-react";
import { TrailCarousel } from "@/components/TrailCarousel";
import { HeroCarousel } from "@/components/HeroCarousel";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { TrailCardSkeleton } from "@/components/LoadingSkeleton";
import { useTrails } from "@/hooks/useTrails";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/hooks/useAuth";
import { useUserBadges } from "@/hooks/useBadges";
import { Progress } from "@/components/ui/progress";
import { BadgeCard } from "@/components/BadgeCard";

const AppHome = () => {
  const { user } = useAuth();
  const { data: trails, isLoading } = useTrails();
  const { data: continueWatching } = useContinueWatching();
  const { data: userBadges } = useUserBadges(user?.id);
  const { isAdmin } = useIsAdmin();

  // Filtrar trilhas por categoria (você pode ajustar os slugs conforme necessário)
  // Organize trails by category
  const ecosystemTrails = trails?.filter(t => t.category === "ecossistema") || [];
  const financialTrails = trails?.filter(t => t.category === "financeiro") || [];
  const allTrails = trails || [];
  
  // Get last 3 earned badges
  const recentBadges = userBadges?.slice(0, 3).map((ub: any) => ({
    icon: ub.badge.icon,
    title: ub.badge.name,
    description: ub.badge.description,
    unlocked: true,
    points: ub.badge.points,
    earnedAt: ub.earned_at,
  })) || [];

  return (
    <>
      <SEO
        title="Início - Sua Jornada de Aprendizado"
        description="Acesse suas trilhas de aprendizado, continue de onde parou e explore novos cursos para impulsionar sua carreira."
      />
      
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg transition-all">
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

        {/* Hero Carousel */}
        <HeroCarousel />

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

          {/* Recent Badges */}
          {recentBadges.length > 0 && (
            <section className="mb-16 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-display font-bold">Conquistas Recentes</h2>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile" className="text-sm">
                    Ver todas →
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {recentBadges.map((badge, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <BadgeCard {...badge} />
                  </div>
                ))}
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
          {!isLoading && allTrails && allTrails.length > 0 && (
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <TrailCarousel
                trails={allTrails}
                title="Todas as Trilhas"
                icon={<TrendingUp className="w-5 h-5 text-primary" />}
              />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!allTrails || allTrails.length === 0) && (
            <section className="animate-fade-in">
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma trilha disponível no momento.
              </div>
            </section>
          )}

          {/* Loading State */}
          {isLoading && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-display font-bold">Todas as Trilhas</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <TrailCardSkeleton key={i} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default AppHome;
