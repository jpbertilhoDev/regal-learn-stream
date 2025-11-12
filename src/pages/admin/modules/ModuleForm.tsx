import { useEffect } from "react";
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
import {
  useAdminModules,
  useCreateModule,
  useUpdateModule,
} from "@/hooks/useAdminModules";
import { useAdminTrails } from "@/hooks/useAdminTrails";
import { ArrowLeft, Loader2 } from "lucide-react";

const moduleSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres").max(200),
  description: z.string().max(500).optional().nullable(),
  trail_id: z.string().uuid("Selecione uma trilha válida"),
  order_index: z.number().min(0),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

export default function ModuleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: trails } = useAdminTrails();
  const { data: modules } = useAdminModules();
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      description: "",
      trail_id: "",
      order_index: 0,
    },
  });

  const trailId = watch("trail_id");

  // Load module data if editing
  useEffect(() => {
    if (isEditing && modules) {
      const module = modules.find((m) => m.id === id);
      if (module) {
        setValue("title", module.title);
        setValue("description", module.description || "");
        setValue("trail_id", module.trail_id);
        setValue("order_index", module.order_index);
      }
    }
  }, [isEditing, id, modules, setValue]);

  const onSubmit = async (data: ModuleFormData) => {
    try {
      if (isEditing) {
        await updateModule.mutateAsync({ id, ...data });
      } else {
        await createModule.mutateAsync(data);
      }
      navigate("/admin/modules");
    } catch (error) {
      console.error("Error saving module:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/modules")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-4xl font-display font-bold text-foreground">
            {isEditing ? "Editar Módulo" : "Novo Módulo"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Preencha os dados do módulo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Trail Selection */}
          <div className="space-y-2">
            <Label>
              Trilha <span className="text-destructive">*</span>
            </Label>
            <Select value={trailId} onValueChange={(val) => setValue("trail_id", val)}>
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
            {errors.trail_id && (
              <p className="text-sm text-destructive">
                {errors.trail_id.message}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Ex: Introdução"
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
              placeholder="Breve descrição do módulo..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
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
            {errors.order_index && (
              <p className="text-sm text-destructive">
                {errors.order_index.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              A ordem pode ser ajustada via drag & drop na lista de módulos
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar Alterações" : "Criar Módulo"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/modules")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
