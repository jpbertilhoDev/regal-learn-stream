import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, FileText, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLesson } from "@/hooks/useLesson";
import { useMarkComplete } from "@/hooks/useProgress";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useToast } from "@/hooks/use-toast";
import { useResources, formatFileSize } from "@/hooks/useResources";
import { Comments } from "@/components/Comments";

const Lesson = () => {
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, isLoading } = useLesson(lessonId);
  const { data: resources, isLoading: resourcesLoading } = useResources(lessonId);
  const markComplete = useMarkComplete();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando aula...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Aula não encontrada</p>
      </div>
    );
  }

  const { lesson, progress, allLessons } = data;
  const module = lesson.module as any;
  const trail = module.trail;
  
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleComplete = () => {
    if (!lessonId) return;
    
    markComplete.mutate(lessonId, {
      onSuccess: () => {
        if (nextLesson) {
          navigate(`/app/lesson/${nextLesson.id}`);
        } else {
          navigate(`/app/trail/${trail.slug}`);
        }
      },
    });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={`/app/trail/${slug}`} className="flex items-center gap-3 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar para Trilha</span>
          </Link>
          
          <span className="text-2xl font-display font-bold text-primary">MASTER CLASS</span>
        </div>
      </header>

      {/* Video Player */}
      <section className="bg-black">
        <div className="container mx-auto">
          <VideoPlayer
            lessonId={lesson.id}
            videoUrl={lesson.video_url || ""}
            initialProgress={progress?.progress_seconds || 0}
            onComplete={handleComplete}
          />
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Lesson Info */}
          <div className="mb-8">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs uppercase tracking-wider text-primary mb-4">
              Aula {currentIndex + 1} de {allLessons.length} • {trail.title}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {lesson.title}
            </h1>
            
            {lesson.description && (
              <p className="text-muted-foreground leading-relaxed mb-6">
                {lesson.description}
              </p>
            )}

            <p className="text-sm text-muted-foreground">
              Duração: {formatDuration(lesson.video_duration)}
            </p>
          </div>

          {/* Materials */}
          {resources && resources.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-display font-bold">Materiais de Apoio</h2>
              </div>
              
              {resourcesLoading ? (
                <p className="text-center text-muted-foreground py-4">
                  Carregando materiais...
                </p>
              ) : (
                <div className="space-y-3">
                  {resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold group-hover:text-primary transition-colors">
                            {resource.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {resource.file_type.toUpperCase()} • {formatFileSize(resource.file_size)}
                          </p>
                          {resource.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {resource.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Comments */}
          {lessonId && <Comments lessonId={lessonId} />}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {!progress?.completed && (
              <Button
                onClick={handleComplete}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Marcar como Concluída
              </Button>
            )}
            {nextLesson ? (
              <Button 
                className="flex-1 bg-gradient-gold hover:shadow-gold-lg transition-all duration-300 h-14 text-base font-semibold"
                onClick={() => navigate(`/app/lesson/${nextLesson.id}`)}
              >
                Próxima Aula: {nextLesson.title}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button 
                className="flex-1 bg-gradient-gold hover:shadow-gold-lg transition-all duration-300 h-14 text-base font-semibold"
                onClick={() => navigate(`/app/trail/${trail.slug}`)}
              >
                Voltar para Trilha
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson;
