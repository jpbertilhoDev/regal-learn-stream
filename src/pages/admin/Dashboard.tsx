import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useAdminAnalytics, useEngagementChart } from "@/hooks/useAdminAnalytics";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { useTrailAnalytics } from "@/hooks/useTrailAnalytics";
import { AnalyticsCard } from "@/components/admin/AnalyticsCard";
import { StatsCardSkeleton } from "@/components/LoadingSkeleton";
import { 
  Users, 
  Target, 
  Video, 
  TrendingUp, 
  Clock, 
  Activity,
  BarChart3,
  Eye
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();
  const { data: chartData, isLoading: chartLoading } = useEngagementChart();
  const { data: recentActivity } = useRecentActivity();
  const { data: trailAnalytics } = useTrailAnalytics();

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    if (hours > 0) return `${hours}h`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}min`;
  };

  if (statsLoading || analyticsLoading) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Carregando métricas...</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <StatsCardSkeleton key={i} />
            ))}
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

        {/* Main Analytics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AnalyticsCard
            icon={Users}
            label="Total de Usuários"
            value={analytics?.totalUsers ?? 0}
            trend={{
              value: 12,
              isPositive: true,
            }}
            iconColor="text-blue-500"
          />
          <AnalyticsCard
            icon={Activity}
            label="Usuários Ativos"
            value={analytics?.activeUsers ?? 0}
            trend={{
              value: 8,
              isPositive: true,
            }}
            iconColor="text-green-500"
          />
          <AnalyticsCard
            icon={Clock}
            label="Tempo Total Assistido"
            value={formatWatchTime(analytics?.totalWatchTime ?? 0)}
            iconColor="text-purple-500"
          />
          <AnalyticsCard
            icon={TrendingUp}
            label="Taxa de Conclusão"
            value={`${analytics?.completionRate ?? 0}%`}
            trend={{
              value: 5,
              isPositive: true,
            }}
            iconColor="text-orange-500"
          />
        </div>

        {/* Engagement Chart */}
        {!chartLoading && chartData && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Engajamento dos Últimos 30 Dias
              </CardTitle>
              <CardDescription>
                Número de visualizações de aulas por dia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    labelFormatter={(value) => {
                      const date = new Date(value as string);
                      return date.toLocaleDateString('pt-BR');
                    }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Lessons */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Aulas Mais Populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.topLessons && analytics.topLessons.length > 0 ? (
                <div className="space-y-4">
                  {analytics.topLessons.map((lesson, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium">
                          {lesson.title}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {lesson.views} views
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
