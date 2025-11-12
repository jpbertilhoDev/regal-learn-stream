import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  unlocked: boolean;
  iconColor?: string;
}

export const BadgeCard = ({ 
  icon: Icon, 
  title, 
  description, 
  unlocked,
  iconColor = "text-primary"
}: BadgeCardProps) => {
  return (
    <Card className={cn(
      "transition-all hover:scale-105",
      unlocked ? "border-primary/50 bg-primary/5 shadow-md" : "opacity-60 grayscale hover:grayscale-0"
    )}>
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center gap-3">
          <div className={cn(
            "p-3 rounded-full bg-background border-2 shadow-sm",
            unlocked ? "border-primary" : "border-border"
          )}>
            <Icon className={cn("w-6 h-6", unlocked ? iconColor : "text-muted-foreground")} />
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          </div>
          {unlocked && (
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              ✓ Conquistada
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
