import { Link } from "react-router-dom";
import { Play, BookOpen, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Module {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  lessons: { count: number }[];
}

interface Trail {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  category: string | null;
  modules: Module[];
}

interface TrailSectionProps {
  trail: Trail;
}

export const TrailSection = ({ trail }: TrailSectionProps) => {
  const totalLessons = trail.modules.reduce((acc, module) => {
    return acc + (module.lessons[0]?.count || 0);
  }, 0);

  return (
    <section className="mb-12 animate-fade-in">
      {/* Trail Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-display font-bold text-foreground">
              {trail.title}
            </h2>
            {trail.category && (
              <Badge variant="outline" className="capitalize">
                {trail.category}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground max-w-3xl">
            {trail.description}
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{trail.modules.length} módulos</span>
            <span>•</span>
            <Play className="w-4 h-4" />
            <span>{totalLessons} aulas</span>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link to={`/app/trail/${trail.slug}`}>
            Ver trilha completa
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Modules Grid */}
      {trail.modules.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trail.modules.map((module, index) => (
            <Card 
              key={module.id}
              className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Módulo {index + 1}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {module.title}
                </CardTitle>
                {module.description && (
                  <CardDescription className="line-clamp-2">
                    {module.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Play className="w-3 h-3" />
                    <span>{module.lessons[0]?.count || 0} aulas</span>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link to={`/app/trail/${trail.slug}#module-${module.id}`}>
                      Acessar
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum módulo cadastrado nesta trilha ainda.
          </CardContent>
        </Card>
      )}
    </section>
  );
};
