import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile, useChangePassword, useUserStats } from "@/hooks/useProfile";
import { useUploadFile } from "@/hooks/useUploadFile";
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

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const { uploadFile } = useUploadFile();
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // Calculate badges
  const badges = [
    {
      icon: PlayCircle,
      title: "Primeiro Passo",
      description: "Comece sua primeira aula",
      unlocked: (stats?.totalLessonsStarted || 0) >= 1,
      iconColor: "text-blue-500"
    },
    {
      icon: Flame,
      title: "Dedicado",
      description: "Complete 10 aulas",
      unlocked: (stats?.completedLessons || 0) >= 10,
      iconColor: "text-orange-500"
    },
    {
      icon: Target,
      title: "Focado",
      description: "Complete sua primeira trilha",
      unlocked: (stats?.completedTrails || 0) >= 1,
      iconColor: "text-green-500"
    },
    {
      icon: Trophy,
      title: "Mestre",
      description: "Complete 3 trilhas",
      unlocked: (stats?.completedTrails || 0) >= 3,
      iconColor: "text-yellow-500"
    },
    {
      icon: Star,
      title: "Maratonista",
      description: "Assista 10 horas de conteúdo",
      unlocked: (stats?.totalWatchTimeSeconds || 0) >= 36000,
      iconColor: "text-purple-500"
    },
    {
      icon: Zap,
      title: "Imparável",
      description: "Complete 50 aulas",
      unlocked: (stats?.completedLessons || 0) >= 50,
      iconColor: "text-red-500"
    },
  ];

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
    changePassword.mutate(data.newPassword, {
      onSuccess: () => {
        passwordForm.reset();
      },
    });
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Badges Conquistadas
                </CardTitle>
                <CardDescription>
                  Continue progredindo para desbloquear mais badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {badges.map((badge, index) => (
                    <BadgeCard key={index} {...badge} />
                  ))}
                </div>
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
                Altere sua senha de acesso
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                    disabled={changePassword.isPending}
                  >
                    {changePassword.isPending ? "Alterando..." : "Alterar Senha"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
