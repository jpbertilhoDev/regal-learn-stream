import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  useUserDetails,
  useUserProgress,
  useUserStats,
} from "@/hooks/useAdminUsers";
import {
  ArrowLeft,
  User,
  Clock,
  CheckCircle2,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useUserDetails(id!);
  const { data: progress, isLoading: progressLoading } = useUserProgress(id!);
  const { data: stats } = useUserStats(id!);

  const isAdmin = user?.user_roles?.some((ur: any) => ur.role === "admin");
  const subscription = user?.subscriptions?.[0];

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}min`;
    return `${mins}min`;
  };

  if (userLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-muted-foreground">
          Carregando usuário...
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Usuário não encontrado</p>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/users")}
            className="mt-4"
          >
            Voltar para usuários
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/users")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-display font-bold text-foreground">
                  {user.name}
                </h1>
                {isAdmin && (
                  <Badge className="bg-purple-500">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-2">ID: {user.id}</p>
              <p className="text-sm text-muted-foreground">
                Membro desde{" "}
                {formatDistanceToNow(new Date(user.created_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aulas Iniciadas
              </CardTitle>
              <PlayCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold text-foreground">
                {stats?.totalLessonsStarted || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aulas Concluídas
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold text-foreground">
                {stats?.completedLessons || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tempo Total
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold text-foreground">
                {formatDuration(stats?.totalWatchTime || 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Info */}
        {subscription && (
          <Card>
            <CardHeader>
              <CardTitle>Assinatura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge
                  variant={
                    subscription.status === "active" ? "default" : "secondary"
                  }
                  className={
                    subscription.status === "active" ? "bg-green-500" : ""
                  }
                >
                  {subscription.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              {subscription.plan_type && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Plano:</span>
                  <span className="font-medium">{subscription.plan_type}</span>
                </div>
              )}
              {subscription.current_period_end && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Próxima renovação:
                  </span>
                  <span className="text-sm">
                    {new Date(
                      subscription.current_period_end
                    ).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Activity History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            {progressLoading ? (
              <p className="text-muted-foreground">Carregando histórico...</p>
            ) : progress && progress.length > 0 ? (
              <div className="space-y-4">
                {progress.map((item: any) => {
                  const progressPercent = item.lesson?.video_duration
                    ? Math.round(
                        (item.progress_seconds / item.lesson.video_duration) *
                          100
                      )
                    : 0;

                  return (
                    <div
                      key={item.id}
                      className="border border-border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">
                            {item.lesson?.title || "Aula sem título"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {item.lesson?.module?.trail?.title || "Trilha"} →{" "}
                            {item.lesson?.module?.title || "Módulo"}
                          </p>
                        </div>
                        {item.completed && (
                          <Badge className="bg-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Concluído
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{progressPercent}% assistido</span>
                          <span>
                            {formatDuration(item.progress_seconds)} /{" "}
                            {formatDuration(item.lesson?.video_duration || 0)}
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>

                      {item.last_watched_at && (
                        <p className="text-xs text-muted-foreground">
                          Última visualização:{" "}
                          {formatDistanceToNow(
                            new Date(item.last_watched_at),
                            { addSuffix: true, locale: ptBR }
                          )}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma atividade registrada ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
