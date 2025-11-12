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
      "transition-all",
      unlocked ? "border-primary/50 bg-primary/5" : "opacity-50 grayscale"
    )}>
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center gap-3">
          <div className={cn(
            "p-4 rounded-full bg-background border-2",
            unlocked ? "border-primary" : "border-border"
          )}>
            <Icon className={cn("w-8 h-8", unlocked ? iconColor : "text-muted-foreground")} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          {unlocked && (
            <span className="text-xs font-medium text-primary">✓ Conquistada</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
