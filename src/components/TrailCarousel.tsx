import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TrailCard } from "./TrailCard";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Trail {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  duration: number;
  lessons_count: number;
}

interface TrailCarouselProps {
  trails: Trail[];
  title: string;
  icon: React.ReactNode;
}

export const TrailCarousel = ({ trails, title, icon }: TrailCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const maxIndex = Math.max(0, trails.length - itemsPerPage);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-2xl font-display font-bold">{title}</h2>
        </div>
        
        {trails.length > itemsPerPage && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="rounded-full transition-all hover:scale-110"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              disabled={currentIndex === maxIndex}
              className="rounded-full transition-all hover:scale-110"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
          }}
        >
          {trails.map((trail) => (
            <div
              key={trail.id}
              className={cn(
                "flex-shrink-0 transition-opacity duration-300",
                trails.length > itemsPerPage ? "w-[calc(33.333%-1rem)]" : "w-full md:w-[calc(33.333%-1rem)]"
              )}
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
      </div>

      {trails.length > itemsPerPage && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentIndex === index
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
