import { useAuth } from "@/hooks/useAuth";
import { useUserChallenges } from "@/hooks/useChallenges";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import { Clock, Trophy, Zap } from "lucide-react";

export const WeeklyChallenges = () => {
  const { user } = useAuth();
  const { data: challenges, isLoading } = useUserChallenges(user?.id);

  if (!user) return null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Desafios Semanais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Carregando desafios...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!challenges || challenges.length === 0) {
    return null;
  }

  // Calculate time remaining
  const endDate = new Date(challenges[0]?.end_date);
  const now = new Date();
  const timeRemaining = endDate.getTime() - now.getTime();
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "hard":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Fácil";
      case "medium":
        return "Médio";
      case "hard":
        return "Difícil";
      default:
        return difficulty;
    }
  };

  return (
    <Card className="border-primary/30 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Desafios Semanais
            </CardTitle>
            <CardDescription>
              Complete os desafios e ganhe recompensas exclusivas
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {daysRemaining}d {hoursRemaining}h restantes
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {challenges.map((challenge: any) => {
            const IconComponent = (LucideIcons as any)[challenge.icon] || Zap;
            
            return (
              <div
                key={challenge.id}
                className={`p-4 rounded-lg border transition-all ${
                  challenge.completed
                    ? "bg-success/5 border-success/30"
                    : "bg-card border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      challenge.completed
                        ? "bg-success/20"
                        : "bg-primary/20"
                    }`}
                  >
                    <IconComponent
                      className={`w-6 h-6 ${
                        challenge.completed ? "text-success" : "text-primary"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {challenge.title}
                          {challenge.completed && (
                            <span className="text-success text-sm">✓</span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {challenge.description}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={getDifficultyColor(challenge.difficulty)}
                      >
                        {getDifficultyLabel(challenge.difficulty)}
                      </Badge>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {challenge.currentProgress} / {challenge.target_value}
                        </span>
                        <span className="font-semibold text-primary">
                          +{challenge.reward_points} pts
                        </span>
                      </div>
                      <Progress
                        value={challenge.progressPercentage}
                        className={challenge.completed ? "bg-success/20" : ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {challenges.filter((c: any) => c.completed).length} /{" "}
              {challenges.length} desafios completos
            </span>
            <span className="font-semibold text-primary">
              Total: +
              {challenges
                .filter((c: any) => c.completed)
                .reduce((sum: number, c: any) => sum + c.reward_points, 0)}{" "}
              pts ganhos
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
