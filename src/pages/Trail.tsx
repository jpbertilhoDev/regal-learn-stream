import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Play, Lock, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import trailIdentity from "@/assets/trail-identity.jpg";

const modules = [
  {
    id: 1,
    title: "Fundamentos da Identidade",
    lessons: [
      { id: 1, title: "O que é Identidade?", duration: "18:30", completed: true, locked: false },
      { id: 2, title: "Descobrindo Suas Raízes", duration: "22:15", completed: true, locked: false },
      { id: 3, title: "Valores e Princípios", duration: "25:40", completed: false, locked: false },
    ]
  },
  {
    id: 2,
    title: "Encontrando Seu Propósito",
    lessons: [
      { id: 4, title: "O Chamado Interior", duration: "20:10", completed: false, locked: false },
      { id: 5, title: "Alinhando Paixão e Propósito", duration: "28:45", completed: false, locked: false },
      { id: 6, title: "Criando Seu Plano de Vida", duration: "32:20", completed: false, locked: false },
    ]
  }
];

const Trail = () => {
  const { slug } = useParams();

  return (
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
          src={trailIdentity}
          alt="Identidade & Propósito"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs uppercase tracking-wider text-primary mb-4">
              Pilar 1
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              Identidade & Propósito
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-6">
              Descubra quem você realmente é e qual o seu propósito de vida através de uma jornada profunda de autoconhecimento.
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <Play className="w-4 h-4 text-primary" />
                12 aulas
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                6h 30min
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Modules & Lessons */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {modules.map((module) => (
            <div key={module.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6 bg-secondary/30 border-b border-border">
                <h2 className="text-xl font-display font-bold">
                  Módulo {module.id}: {module.title}
                </h2>
              </div>
              
              <div className="divide-y divide-border">
                {module.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    to={lesson.locked ? "#" : `/app/lesson/${slug}/${lesson.id}`}
                    className={`flex items-center gap-4 p-6 transition-all duration-300 ${
                      lesson.locked 
                        ? "cursor-not-allowed opacity-60" 
                        : "hover:bg-secondary/30 hover:pl-8"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      lesson.completed 
                        ? "bg-success/20 text-success" 
                        : lesson.locked 
                        ? "bg-muted" 
                        : "bg-primary/20 text-primary"
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : lesson.locked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 fill-current" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                    </div>
                    
                    {lesson.completed && (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Trail;
