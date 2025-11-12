import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
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
import { ArrowLeft, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  avatar_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { uploadFile } = useUploadFile();
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: profile?.name || "",
      avatar_url: profile?.avatar_url || "",
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

  const onSubmit = async (data: ProfileFormValues) => {
    updateProfile.mutate({
      name: data.name,
      avatar_url: avatarPreview || data.avatar_url,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/app")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Meu Perfil
            </CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
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
                  <FileUpload
                    onUpload={handleAvatarUpload}
                    accept="image/*"
                    maxSize={2}
                    preview={avatarPreview || profile?.avatar_url || null}
                    label="Alterar Foto de Perfil"
                  />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <Input value={user?.email || ""} disabled />
                  <p className="text-sm text-muted-foreground">
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
      </div>
    </div>
  );
}
