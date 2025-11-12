import * as LucideIcons from "lucide-react";

interface BadgeCardProps {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  points?: number;
  earnedAt?: string;
}

export const BadgeCard = ({ 
  icon, 
  title, 
  description, 
  unlocked,
  points,
  earnedAt
}: BadgeCardProps) => {
  // Dynamically get the icon component from lucide-react
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Award;
  
  return (
    <div 
      className={`relative p-4 rounded-xl border transition-all duration-300 ${
        unlocked 
          ? "bg-card border-primary/30 shadow-gold hover:shadow-gold-lg hover:scale-105" 
          : "bg-muted/50 border-muted opacity-60 grayscale"
      }`}
      title={earnedAt ? `Desbloqueado em ${new Date(earnedAt).toLocaleDateString('pt-BR')}` : undefined}
    >
      {/* Badge Icon */}
      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
        unlocked ? "bg-primary/20" : "bg-muted"
      }`}>
        <IconComponent className={`w-6 h-6 ${unlocked ? "text-primary" : "text-muted-foreground"}`} />
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        {points !== undefined && (
          <p className={`text-xs font-bold mt-2 ${unlocked ? "text-primary" : "text-muted-foreground"}`}>
            {points} pts
          </p>
        )}
      </div>

      {/* Unlocked Badge */}
      {unlocked && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-success flex items-center justify-center shadow-lg">
          <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};
