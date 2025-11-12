import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useAdminModules, useDeleteModule, useReorderModules } from "@/hooks/useAdminModules";
import { useAdminTrails } from "@/hooks/useAdminTrails";
import { Plus, Pencil, Trash2, Search, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableRowProps {
  module: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SortableRow = ({ module, onEdit, onDelete }: SortableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell className="font-medium">{module.title}</TableCell>
      <TableCell>
        <Badge variant="outline">{module.trail?.title || "N/A"}</Badge>
      </TableCell>
      <TableCell className="text-center">{module.order_index}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(module.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(module.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default function ModulesList() {
  const [search, setSearch] = useState("");
  const [selectedTrail, setSelectedTrail] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: trails } = useAdminTrails();
  const { data: modules, isLoading } = useAdminModules(
    selectedTrail === "all" ? undefined : selectedTrail
  );
  const deleteModule = useDeleteModule();
  const reorderModules = useReorderModules();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredModules = modules?.filter((module) =>
    module.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && filteredModules) {
      const oldIndex = filteredModules.findIndex((m) => m.id === active.id);
      const newIndex = filteredModules.findIndex((m) => m.id === over.id);

      const reordered = arrayMove(filteredModules, oldIndex, newIndex);
      const updates = reordered.map((module, index) => ({
        id: module.id,
        order_index: index,
      }));

      reorderModules.mutate(updates);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteModule.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">
              Módulos
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie os módulos das trilhas
            </p>
          </div>
          <Link to="/admin/modules/new">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Novo Módulo
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar módulos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedTrail} onValueChange={setSelectedTrail}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Filtrar por trilha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as trilhas</SelectItem>
              {trails?.map((trail) => (
                <SelectItem key={trail.id} value={trail.id}>
                  {trail.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando módulos...
          </div>
        ) : filteredModules && filteredModules.length > 0 ? (
          <div className="border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Trilha</TableHead>
                  <TableHead className="text-center">Ordem</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={filteredModules.map((m) => m.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {filteredModules.map((module) => (
                      <SortableRow
                        key={module.id}
                        module={module}
                        onEdit={(id) =>
                          (window.location.href = `/admin/modules/${id}/edit`)
                        }
                        onDelete={setDeleteId}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {search
              ? "Nenhum módulo encontrado com esse termo"
              : "Nenhum módulo cadastrado ainda"}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este módulo? Esta ação não pode ser
              desfeita e todas as aulas associadas também serão removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
