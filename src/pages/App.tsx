import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Play, TrendingUp, Sparkles, LogOut, User, Clock, Network, Wallet } from "lucide-react";
import { TrailCard } from "@/components/TrailCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTrails } from "@/hooks/useTrails";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { Progress } from "@/components/ui/progress";
import { SearchAndFilters } from "@/components/SearchAndFilters";

const AppHome = () => {
  const { user, signOut } = useAuth();
  const { data: trails, isLoading } = useTrails();
  const { data: continueWatching } = useContinueWatching();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");

  // Category-specific trails (independent of filters)
  const ecosystemTrails = useMemo(() => {
    if (!trails) return [];
    return trails.filter((trail) => trail.category === "ecossistema").slice(0, 3);
  }, [trails]);

  const financialTrails = useMemo(() => {
    if (!trails) return [];
    return trails.filter((trail) => trail.category === "financeiro").slice(0, 3);
  }, [trails]);

  // Filter logic for "Todas as Trilhas" section
  const filteredTrails = useMemo(() => {
    if (!trails) return [];

    return trails.filter((trail) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        trail.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trail.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || trail.category === selectedCategory;

      // Difficulty filter
      const matchesDifficulty =
        selectedDifficulty === "all" || trail.difficulty_level === selectedDifficulty;

      // Duration filter (in minutes)
      const durationInHours = trail.duration / 60;
      let matchesDuration = true;
      if (selectedDuration === "short") {
        matchesDuration = durationInHours <= 2;
      } else if (selectedDuration === "medium") {
        matchesDuration = durationInHours > 2 && durationInHours <= 5;
      } else if (selectedDuration === "long") {
        matchesDuration = durationInHours > 5;
      }

      return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration;
    });
  }, [trails, searchQuery, selectedCategory, selectedDifficulty, selectedDuration]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setSelectedDuration("all");
  };

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
        {/* Continue Watching */}
        {continueWatching && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Play className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-display font-bold">Continuar Assistindo</h2>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
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

        {/* Ecossistema Section */}
        {!isLoading && ecosystemTrails.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Network className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-display font-bold">Ecossistema</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ecosystemTrails.map((trail) => (
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
          </section>
        )}

        {/* Financeiro Section */}
        {!isLoading && financialTrails.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Wallet className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-display font-bold">Financeiro</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {financialTrails.map((trail) => (
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
          </section>
        )}

        {/* Search and Filters */}
        <section className="mb-12">
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            selectedDuration={selectedDuration}
            onDurationChange={setSelectedDuration}
            onClearFilters={handleClearFilters}
          />
        </section>

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
          ) : filteredTrails.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrails.map((trail) => (
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
              <p className="text-lg mb-2">Nenhuma trilha encontrada</p>
              <p className="text-sm">Tente ajustar os filtros ou buscar por outros termos</p>
              {(searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all" || selectedDuration !== "all") && (
                <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
                  Limpar Filtros
                </Button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AppHome;
