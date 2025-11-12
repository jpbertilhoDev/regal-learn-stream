import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Play, Lock, CheckCircle2, Clock } from "lucide-react";
import { useTrailDetails } from "@/hooks/useTrailDetails";
import { SEO } from "@/components/SEO";

const Trail = () => {
  const { slug } = useParams();
  const { data, isLoading } = useTrailDetails(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando trilha...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Trilha não encontrada</p>
      </div>
    );
  }

  const { trail, modules } = data;

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <SEO
        title={`${trail.title} - Trilha de Aprendizado`}
        description={trail.description}
        image={trail.thumbnail_url || undefined}
      />
      
      <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-3">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-2xl font-display font-bold text-primary">MASTER CLASS</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src={trail.thumbnail_url || ""}
          alt={trail.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              {trail.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-6">
              {trail.description}
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <Play className="w-4 h-4 text-primary" />
                {trail.lessons_count} aulas
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {Math.floor(trail.duration / 60)}h {trail.duration % 60}min
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Modules & Lessons */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {modules.map((module, moduleIndex) => (
            <div key={module.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6 bg-secondary/30 border-b border-border">
                <h2 className="text-xl font-display font-bold">
                  Módulo {moduleIndex + 1}: {module.title}
                </h2>
                {module.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {module.description}
                  </p>
                )}
              </div>
              
              <div className="divide-y divide-border">
                {module.lessons.map((lesson: any) => {
                  const locked = lesson.requires_subscription; // Pode adicionar lógica de assinatura aqui
                  
                  return (
                    <Link
                      key={lesson.id}
                      to={locked ? "#" : `/app/lesson/${slug}/${lesson.id}`}
                      className={`flex items-center gap-4 p-6 transition-all duration-300 ${
                        locked 
                          ? "cursor-not-allowed opacity-60" 
                          : "hover:bg-secondary/30 hover:pl-8"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        lesson.completed 
                          ? "bg-success/20 text-success" 
                          : locked 
                          ? "bg-muted" 
                          : "bg-primary/20 text-primary"
                      }`}>
                        {lesson.completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : locked ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 fill-current" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDuration(lesson.video_duration)}
                        </p>
                      </div>
                      
                      {lesson.completed && (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    </>
  );
};

export default Trail;
