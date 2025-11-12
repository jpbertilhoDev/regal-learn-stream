import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
}

export const AnalyticsCard = ({ 
  icon: Icon, 
  label, 
  value,
  trend,
  iconColor = "text-primary" 
}: AnalyticsCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">{label}</p>
            <p className="text-3xl font-bold mb-2">{value}</p>
            {trend && (
              <p className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}% este mês
              </p>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-xl bg-primary/10",
            iconColor
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
