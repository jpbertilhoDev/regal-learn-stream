import { Link } from "react-router-dom";
import { Play, Clock, Settings, Award, Loader2 } from "lucide-react";
import { TrailSection } from "@/components/TrailSection";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { useTrailsWithModules } from "@/hooks/useTrailsWithModules";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/hooks/useAuth";
import { useUserBadges } from "@/hooks/useBadges";
import { Progress } from "@/components/ui/progress";
import { BadgeCard } from "@/components/BadgeCard";
import { Separator } from "@/components/ui/separator";

const AppHome = () => {
  const { user } = useAuth();
  const { data: trails, isLoading } = useTrailsWithModules();
  const { data: continueWatching } = useContinueWatching();
  const { data: userBadges } = useUserBadges(user?.id);
  const { isAdmin } = useIsAdmin();
  
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

          {/* Trails by Category */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : trails && trails.length > 0 ? (
            <div className="space-y-8">
              {trails.map((trail, index) => (
                <div key={trail.id}>
                  <TrailSection trail={trail} />
                  {index < trails.length - 1 && <Separator className="my-8" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma trilha disponível no momento.
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AppHome;
