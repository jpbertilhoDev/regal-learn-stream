import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/admin/FileUpload";
import {
  useAdminTrails,
  useCreateTrail,
  useUpdateTrail,
} from "@/hooks/useAdminTrails";
import { useUploadFile } from "@/hooks/useUploadFile";
import { ArrowLeft, Loader2 } from "lucide-react";

const trailSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres").max(200),
  slug: z.string().min(3, "Slug deve ter pelo menos 3 caracteres").max(200),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres").max(1000),
  category: z.enum(["ecossistema", "financeiro", "geral"]),
  difficulty_level: z.enum(["iniciante", "intermediario", "avancado"]),
  duration: z.number().min(1, "Duração deve ser maior que 0"),
  order_index: z.number().min(0),
  is_published: z.boolean(),
  thumbnail_url: z.string().url().optional().or(z.literal("")).nullable(),
});

type TrailFormData = z.infer<typeof trailSchema>;

export default function TrailForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: trails } = useAdminTrails();
  const createTrail = useCreateTrail();
  const updateTrail = useUpdateTrail();
  const { uploadFile } = useUploadFile();

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TrailFormData>({
    resolver: zodResolver(trailSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      category: "geral",
      difficulty_level: "iniciante",
      duration: 60,
      order_index: 0,
      is_published: false,
      thumbnail_url: null,
    },
  });

  const title = watch("title");
  const category = watch("category");
  const difficultyLevel = watch("difficulty_level");
  const isPublished = watch("is_published");

  // Load trail data if editing
  useEffect(() => {
    if (isEditing && trails) {
      const trail = trails.find((t) => t.id === id);
      if (trail) {
        setValue("title", trail.title);
        setValue("slug", trail.slug);
        setValue("description", trail.description);
        setValue("category", trail.category as any);
        setValue("difficulty_level", trail.difficulty_level as any);
        setValue("duration", trail.duration);
        setValue("order_index", trail.order_index);
        setValue("is_published", trail.is_published);
        setValue("thumbnail_url", trail.thumbnail_url);
        if (trail.thumbnail_url) {
          setThumbnailPreview(trail.thumbnail_url);
        }
      }
    }
  }, [isEditing, id, trails, setValue]);

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !isEditing) {
      const slug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug);
    }
  }, [title, isEditing, setValue]);

  const handleThumbnailUpload = async (file: File) => {
    const { url, error } = await uploadFile(file, "thumbnails", "trails");
    if (error) {
      console.error("Upload error:", error);
      return;
    }
    if (url) {
      setValue("thumbnail_url", url);
      setThumbnailPreview(url);
    }
  };

  const onSubmit = async (data: TrailFormData) => {
    try {
      console.log("Submitting trail data:", { isEditing, id, data });

      // Clean up thumbnail_url if it's empty string
      const cleanData = {
        ...data,
        thumbnail_url: data.thumbnail_url || null,
        lessons_count: 0, // Add default lessons_count for new trails
      };

      if (isEditing && id) {
        console.log("Updating trail with ID:", id);
        await updateTrail.mutateAsync({ id, ...cleanData });
      } else {
        console.log("Creating new trail");
        await createTrail.mutateAsync(cleanData);
      }
      navigate("/admin/trails");
    } catch (error) {
      console.error("Error saving trail:", error);
      // Show error to user
      alert(`Erro ao salvar trilha: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/trails")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-4xl font-display font-bold text-foreground">
            {isEditing ? "Editar Trilha" : "Nova Trilha"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Preencha os dados da trilha de aprendizado
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Thumbnail */}
          <FileUpload
            onUpload={handleThumbnailUpload}
            preview={thumbnailPreview}
            onRemove={() => {
              setThumbnailPreview(null);
              setValue("thumbnail_url", null);
            }}
            label="Thumbnail da Trilha"
            accept="image/*"
            maxSize={5}
          />

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Ex: Trilha de Identidade"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              {...register("slug")}
              placeholder="trilha-de-identidade"
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              URL amigável gerada automaticamente
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Descrição <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descreva o conteúdo desta trilha..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>
                Categoria <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={(val) => setValue("category", val as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecossistema">Ecossistema</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Nível de Dificuldade <span className="text-destructive">*</span>
              </Label>
              <Select
                value={difficultyLevel}
                onValueChange={(val) => setValue("difficulty_level", val as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iniciante">Iniciante</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                  <SelectItem value="avancado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration and Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duration">
                Duração Total (minutos) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="duration"
                type="number"
                {...register("duration", { valueAsNumber: true })}
                placeholder="60"
              />
              {errors.duration && (
                <p className="text-sm text-destructive">
                  {errors.duration.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="order_index">Ordem de Exibição</Label>
              <Input
                id="order_index"
                type="number"
                {...register("order_index", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
          </div>

          {/* Published Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={isPublished}
              onCheckedChange={(checked) => setValue("is_published", checked)}
            />
            <Label htmlFor="is_published" className="cursor-pointer">
              Publicar trilha (visível para todos os usuários)
            </Label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar Alterações" : "Criar Trilha"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/trails")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
