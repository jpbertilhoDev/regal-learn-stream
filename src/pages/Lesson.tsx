import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLesson } from "@/hooks/useLesson";

const Lesson = () => {
  const { slug, lessonId } = useParams();
  const { data, isLoading } = useLesson(lessonId);

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

  const { lesson, allLessons } = data;
  const module = lesson.module as any;
  const trail = module.trail;
  
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

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
          <div className="aspect-video bg-gradient-to-br from-secondary to-background flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="w-20 h-20 rounded-full border-4 border-primary/30 flex items-center justify-center mx-auto mb-4">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-primary border-b-[12px] border-b-transparent ml-1" />
              </div>
              <p className="text-sm">Player de vídeo será integrado aqui</p>
              <p className="text-xs mt-2 text-muted-foreground/70">
                (Cloudflare Stream, Mux ou Vimeo)
              </p>
            </div>
          </div>
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
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-display font-bold">Materiais de Apoio</h2>
            </div>
            
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      Workbook - Descobrindo Sua Identidade
                    </p>
                    <p className="text-sm text-muted-foreground">PDF • 2.4 MB</p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              
              <a
                href="#"
                className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      Exercícios Práticos
                    </p>
                    <p className="text-sm text-muted-foreground">PDF • 1.8 MB</p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          {/* Next Lesson */}
          {nextLesson ? (
            <Button 
              className="w-full bg-gradient-gold hover:shadow-gold-lg transition-all duration-300 h-14 text-base font-semibold"
              asChild
            >
              <Link to={`/app/lesson/${slug}/${nextLesson.id}`}>
                Próxima Aula: {nextLesson.title}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          ) : (
            <Button 
              className="w-full bg-gradient-gold hover:shadow-gold-lg transition-all duration-300 h-14 text-base font-semibold"
              asChild
            >
              <Link to={`/app/trail/${slug}`}>
                Voltar para Trilha
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Lesson;
