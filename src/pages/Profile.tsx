import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile, useChangePassword, useRequestVerificationCode, useVerifyCode, useUserStats } from "@/hooks/useProfile";
import { useUploadFile } from "@/hooks/useUploadFile";
import { useBadges, useUserBadges, useUserBadgeStats } from "@/hooks/useBadges";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/admin/FileUpload";
import { StatCard } from "@/components/StatCard";
import { BadgeCard } from "@/components/BadgeCard";
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Clock, 
  PlayCircle, 
  CheckCircle, 
  Award,
  Flame,
  Target,
  Trophy,
  Star,
  Zap
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  avatar_url: z.string().optional(),
});

const passwordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const verificationSchema = z.object({
  code: z.string().length(6, "O código deve ter 6 dígitos"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type VerificationFormValues = z.infer<typeof verificationSchema>;

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { data: allBadges } = useBadges();
  const { data: userBadges } = useUserBadges(user?.id);
  const { data: badgeStats } = useUserBadgeStats(user?.id);
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const requestVerificationCode = useRequestVerificationCode();
  const verifyCode = useVerifyCode();
  const { uploadFile } = useUploadFile();
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [showVerification, setShowVerification] = useState(false);
  const [pendingPassword, setPendingPassword] = useState<string>("");

  // Create map of earned badges for quick lookup
  const earnedBadgeIds = new Set(userBadges?.map((ub: any) => ub.badge_id) || []);
  
  // Prepare badges data combining all badges with user progress
  const badges = allBadges?.map((badge) => {
    const userBadge = userBadges?.find((ub: any) => ub.badge_id === badge.id);
    return {
      icon: badge.icon,
      title: badge.name,
      description: badge.description,
      unlocked: earnedBadgeIds.has(badge.id),
      points: badge.points,
      earnedAt: userBadge?.earned_at,
      category: badge.category,
    };
  }) || [];

  // Format watch time
  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: profile?.name || "",
      avatar_url: profile?.avatar_url || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const verificationForm = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleAvatarUpload = async (file: File) => {
    const { url, error } = await uploadFile(file, "avatars", user?.id);
    
    if (error) {
      toast({
        title: "Erro ao fazer upload",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (url) {
      setAvatarPreview(url);
      toast({
        title: "Avatar enviado!",
        description: "Clique em 'Salvar Alterações' para confirmar.",
      });
    }
  };

  const onProfileSubmit = async (data: ProfileFormValues) => {
    updateProfile.mutate({
      name: data.name,
      avatar_url: avatarPreview || data.avatar_url,
    });
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    // Store password and request verification code
    setPendingPassword(data.newPassword);
    await requestVerificationCode.mutateAsync("password_change");
    setShowVerification(true);
  };

  const onVerificationSubmit = async (data: VerificationFormValues) => {
    try {
      // Verify the code
      await verifyCode.mutateAsync({
        code: data.code,
        type: "password_change",
      });

      // If verified, change the password
      await changePassword.mutateAsync(pendingPassword);
      
      // Reset forms and state
      passwordForm.reset();
      verificationForm.reset();
      setShowVerification(false);
      setPendingPassword("");
      
      toast({
        title: "Senha alterada!",
        description: "Sua senha foi atualizada com sucesso.",
      });
    } catch (error) {
      // Error already handled by mutations
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/app")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-background shadow-lg">
                {(avatarPreview || profile?.avatar_url) ? (
                  <img
                    src={avatarPreview || profile?.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{profile?.name || "Usuário"}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Stats Section */}
          {!statsLoading && stats && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Suas Estatísticas
              </h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  icon={Clock}
                  label="Tempo Assistido"
                  value={formatWatchTime(stats.totalWatchTimeSeconds)}
                  iconColor="text-blue-500"
                />
                <StatCard
                  icon={PlayCircle}
                  label="Aulas Iniciadas"
                  value={stats.totalLessonsStarted}
                  iconColor="text-purple-500"
                />
                <StatCard
                  icon={CheckCircle}
                  label="Aulas Completas"
                  value={stats.completedLessons}
                  iconColor="text-green-500"
                />
                <StatCard
                  icon={Trophy}
                  label="Trilhas Completas"
                  value={stats.completedTrails}
                  iconColor="text-yellow-500"
                />
              </div>

              {/* Badges Section */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Badges Conquistadas
                      </CardTitle>
                      <CardDescription>
                        Continue progredindo para desbloquear mais badges
                      </CardDescription>
                    </div>
                    {badgeStats && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {badgeStats.earnedBadges}/{badgeStats.totalBadges}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {badgeStats.totalPoints} pontos
                        </p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {badges.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Carregando badges...
                    </p>
                  ) : (
                    <>
                      {/* Progress by Category */}
                      <div className="mb-6 space-y-3">
                        {["progress", "trails", "community", "special", "challenges"].map((category) => {
                          const categoryBadges = badges.filter((b) => b.category === category);
                          const earnedInCategory = categoryBadges.filter((b) => b.unlocked).length;
                          const categoryNames: Record<string, string> = {
                            progress: "Progresso",
                            trails: "Trilhas",
                            community: "Comunidade",
                            special: "Especiais",
                            challenges: "Desafios",
                          };
                          
                          if (categoryBadges.length === 0) return null;
                          
                          return (
                            <div key={category}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                  {categoryNames[category]}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {earnedInCategory}/{categoryBadges.length}
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-gold transition-all duration-500"
                                  style={{ 
                                    width: `${(earnedInCategory / categoryBadges.length) * 100}%` 
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Badges Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {badges.map((badge, index) => (
                          <BadgeCard key={index} {...badge} />
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

        {/* Settings Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize seu nome e foto de perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="flex justify-center">
                    <FileUpload
                      onUpload={handleAvatarUpload}
                      accept="image/*"
                      maxSize={2}
                      preview={avatarPreview || profile?.avatar_url || null}
                      label="Foto de Perfil"
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Email</FormLabel>
                    <Input value={user?.email || ""} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">
                      O email não pode ser alterado
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Segurança
              </CardTitle>
              <CardDescription>
                Altere sua senha de acesso com verificação por email
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showVerification ? (
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova Senha</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Digite sua nova senha"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Senha</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Confirme sua nova senha"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-muted/50 border border-border rounded-lg p-4">
                      <p className="text-sm font-medium mb-2">Requisitos da senha:</p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Mínimo de 8 caracteres</li>
                        <li>Letra maiúscula e minúscula</li>
                        <li>Pelo menos um número</li>
                      </ul>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={requestVerificationCode.isPending}
                    >
                      {requestVerificationCode.isPending ? "Enviando código..." : "Continuar"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...verificationForm}>
                  <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        <strong>📧 Código enviado!</strong>
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Enviamos um código de 6 dígitos para {user?.email}. O código expira em 10 minutos.
                      </p>
                    </div>

                    <FormField
                      control={verificationForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código de Verificação</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="000000"
                              maxLength={6}
                              className="text-center text-2xl tracking-widest font-mono"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowVerification(false);
                          verificationForm.reset();
                          passwordForm.reset();
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={verifyCode.isPending}
                      >
                        {verifyCode.isPending ? "Verificando..." : "Confirmar"}
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="link"
                      className="w-full text-sm"
                      onClick={() => requestVerificationCode.mutate("password_change")}
                      disabled={requestVerificationCode.isPending}
                    >
                      Reenviar código
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
