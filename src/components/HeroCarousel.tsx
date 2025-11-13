import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTrails } from "@/hooks/useTrails";

export const HeroCarousel = () => {
  const { data: trails } = useTrails();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get featured trails (first 5)
  const featuredTrails = trails?.slice(0, 5) || [];
  const currentTrail = featuredTrails[currentIndex];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || featuredTrails.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredTrails.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredTrails.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + featuredTrails.length) % featuredTrails.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % featuredTrails.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (!currentTrail) return null;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        {featuredTrails.map((trail, index) => (
          <div
            key={trail.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: trail.thumbnail_url
                ? `url(${trail.thumbnail_url})`
                : "linear-gradient(135deg, hsl(0, 0%, 7%), hsl(0, 0%, 4%))",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {featuredTrails.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 z-30 p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 z-30 p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-card/50 backdrop-blur-sm mb-6 animate-fade-in">
            <span className="text-xs uppercase tracking-wider text-primary font-semibold">
              Destaque
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fade-in leading-tight">
            {currentTrail.title}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed animate-fade-in line-clamp-3">
            {currentTrail.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-8 text-sm text-muted-foreground animate-fade-in">
            <span className="flex items-center gap-1">
              <Play className="w-4 h-4" />
              {currentTrail.lessons_count} aulas
            </span>
            <span>•</span>
            <span>
              {Math.floor(currentTrail.duration / 60)}h {currentTrail.duration % 60}min
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 animate-fade-in">
            <Button
              size="lg"
              className="bg-gradient-gold hover:shadow-gold-lg transition-all duration-300 text-base px-8 font-semibold"
              asChild
            >
              <Link to={`/app/trail/${currentTrail.slug}`}>
                <Play className="w-5 h-5 mr-2" />
                Assistir Agora
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-black/50 backdrop-blur-sm border-white/30 hover:bg-black/70 hover:border-white/50 transition-all duration-300 text-base px-8"
              asChild
            >
              <Link to={`/app/trail/${currentTrail.slug}`}>
                <Info className="w-5 h-5 mr-2" />
                Mais Informações
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {featuredTrails.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {featuredTrails.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                currentIndex === index
                  ? "w-8 h-2 bg-primary"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  );
};
