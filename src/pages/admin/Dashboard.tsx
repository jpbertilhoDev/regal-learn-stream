import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { useTrailAnalytics } from "@/hooks/useTrailAnalytics";
import { Users, Target, Video, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MetricCardProps {
  title: string;
  value: number;
  icon: any;
  suffix?: string;
}

const MetricCard = ({
  title,
  value,
  icon: Icon,
  suffix = "",
}: MetricCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-display font-bold text-foreground">
        {value}
        {suffix}
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: recentActivity } = useRecentActivity();
  const { data: trailAnalytics } = useTrailAnalytics();

  if (statsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando métricas...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Visão geral do sistema e métricas principais
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total de Usuários"
            value={stats?.totalUsers ?? 0}
            icon={Users}
          />
          <MetricCard
            title="Trilhas Publicadas"
            value={stats?.totalTrails ?? 0}
            icon={Target}
          />
          <MetricCard
            title="Aulas Publicadas"
            value={stats?.totalLessons ?? 0}
            icon={Video}
          />
          <MetricCard
            title="Taxa de Conclusão"
            value={stats?.completionRate ?? 0}
            icon={TrendingUp}
            suffix="%"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Most Watched Trails */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">
                Trilhas Mais Assistidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trailAnalytics && trailAnalytics.length > 0 ? (
                <div className="space-y-4">
                  {trailAnalytics.map((trail, index) => (
                    <div
                      key={trail.title}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                          {index + 1}
                        </div>
                        <span className="text-foreground font-medium">
                          {trail.title}
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        {trail.views} visualizações
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum dado disponível
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity: any) => (
                    <div key={activity.id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {activity.user?.name || "Usuário"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {activity.last_watched_at &&
                            formatDistanceToNow(
                              new Date(activity.last_watched_at),
                              { addSuffix: true, locale: ptBR }
                            )}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.completed ? "Concluiu" : "Assistiu"}{" "}
                        <span className="font-medium">
                          {activity.lesson?.title || "Aula"}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma atividade recente
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
