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
import { VideoUpload } from "@/components/admin/VideoUpload";
import {
  useAdminLessons,
  useCreateLesson,
  useUpdateLesson,
} from "@/hooks/useAdminLessons";
import { useAdminTrails } from "@/hooks/useAdminTrails";
import { useAdminModules } from "@/hooks/useAdminModules";
import { useUploadFile } from "@/hooks/useUploadFile";
import { ArrowLeft, Loader2 } from "lucide-react";

const lessonSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres").max(200),
  description: z.string().max(1000).optional().nullable(),
  module_id: z.string().uuid("Selecione um módulo válido"),
  video_url: z.string().url().optional().nullable(),
  thumbnail_url: z.string().url().optional().nullable(),
  video_duration: z.number().min(1, "Duração deve ser maior que 0").optional().nullable(),
  order_index: z.number().min(0),
  is_published: z.boolean(),
  requires_subscription: z.boolean(),
});

type LessonFormData = z.infer<typeof lessonSchema>;

export default function LessonForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: trails } = useAdminTrails();
  const { data: lessons } = useAdminLessons();
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const { uploadFile } = useUploadFile();

  const [selectedTrail, setSelectedTrail] = useState<string>("");
  const { data: modules } = useAdminModules(selectedTrail || undefined);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      module_id: "",
      video_url: null,
      thumbnail_url: null,
      video_duration: null,
      order_index: 0,
      is_published: false,
      requires_subscription: false,
    },
  });

  const moduleId = watch("module_id");
  const isPublished = watch("is_published");
  const requiresSubscription = watch("requires_subscription");

  // Load lesson data if editing
  useEffect(() => {
    if (isEditing && lessons) {
      const lesson = lessons.find((l) => l.id === id);
      if (lesson) {
        setValue("title", lesson.title);
        setValue("description", lesson.description || "");
        setValue("module_id", lesson.module_id);
        setValue("video_url", lesson.video_url);
        setValue("thumbnail_url", lesson.thumbnail_url);
        setValue("video_duration", lesson.video_duration);
        setValue("order_index", lesson.order_index);
        setValue("is_published", lesson.is_published);
        setValue("requires_subscription", lesson.requires_subscription);
        
        if (lesson.thumbnail_url) setThumbnailPreview(lesson.thumbnail_url);
        if (lesson.video_url) setVideoPreview(lesson.video_url);
        
        // Set trail for module filtering
        if (lesson.module?.trail?.id) {
          setSelectedTrail(lesson.module.trail.id);
        }
      }
    }
  }, [isEditing, id, lessons, setValue]);

  // Reset module selection when trail changes
  useEffect(() => {
    if (!isEditing && selectedTrail) {
      setValue("module_id", "");
    }
  }, [selectedTrail, isEditing, setValue]);

  const handleThumbnailUpload = async (file: File) => {
    const { url, error } = await uploadFile(file, "thumbnails", "lessons");
    if (error) {
      console.error("Upload error:", error);
      return;
    }
    if (url) {
      setValue("thumbnail_url", url);
      setThumbnailPreview(url);
    }
  };

  const handleVideoUpload = async (file: File, duration: number) => {
    const { url, error } = await uploadFile(file, "videos", "lessons");
    if (error) {
      console.error("Upload error:", error);
      return;
    }
    if (url) {
      setValue("video_url", url);
      setValue("video_duration", duration);
      setVideoPreview(url);
    }
  };

  const onSubmit = async (data: LessonFormData) => {
    try {
      if (isEditing) {
        await updateLesson.mutateAsync({ id, ...data });
      } else {
        await createLesson.mutateAsync(data);
      }
      navigate("/admin/lessons");
    } catch (error) {
      console.error("Error saving lesson:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/lessons")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-4xl font-display font-bold text-foreground">
            {isEditing ? "Editar Aula" : "Nova Aula"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Preencha os dados da aula
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Trail and Module Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>
                Trilha <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedTrail} onValueChange={setSelectedTrail}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma trilha" />
                </SelectTrigger>
                <SelectContent>
                  {trails?.map((trail) => (
                    <SelectItem key={trail.id} value={trail.id}>
                      {trail.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Módulo <span className="text-destructive">*</span>
              </Label>
              <Select
                value={moduleId}
                onValueChange={(val) => setValue("module_id", val)}
                disabled={!selectedTrail}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um módulo" />
                </SelectTrigger>
                <SelectContent>
                  {modules?.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.module_id && (
                <p className="text-sm text-destructive">
                  {errors.module_id.message}
                </p>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <VideoUpload
            onUpload={handleVideoUpload}
            preview={videoPreview}
            onRemove={() => {
              setVideoPreview(null);
              setValue("video_url", null);
              setValue("video_duration", null);
            }}
            label="Vídeo da Aula *"
            maxSize={500}
          />

          {/* Thumbnail Upload */}
          <FileUpload
            onUpload={handleThumbnailUpload}
            preview={thumbnailPreview}
            onRemove={() => {
              setThumbnailPreview(null);
              setValue("thumbnail_url", null);
            }}
            label="Thumbnail da Aula"
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
              placeholder="Ex: Introdução ao React"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Breve descrição da aula..."
              rows={4}
            />
          </div>

          {/* Order Index */}
          <div className="space-y-2">
            <Label htmlFor="order_index">Ordem de Exibição</Label>
            <Input
              id="order_index"
              type="number"
              {...register("order_index", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={isPublished}
                onCheckedChange={(checked) => setValue("is_published", checked)}
              />
              <Label htmlFor="is_published" className="cursor-pointer">
                Publicar aula (visível para usuários)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="requires_subscription"
                checked={requiresSubscription}
                onCheckedChange={(checked) =>
                  setValue("requires_subscription", checked)
                }
              />
              <Label htmlFor="requires_subscription" className="cursor-pointer">
                Requer assinatura (conteúdo premium)
              </Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar Alterações" : "Criar Aula"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/lessons")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
