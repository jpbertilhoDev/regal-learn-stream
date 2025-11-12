import { Link } from "react-router-dom";
import { Play, Clock } from "lucide-react";

interface TrailCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  lessonsCount: number;
}

export const TrailCard = ({ id, title, description, image, duration, lessonsCount }: TrailCardProps) => {
  return (
    <Link to={`/app/trail/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-gold">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
              <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Play className="w-3 h-3" />
              {lessonsCount} aulas
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {duration}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
