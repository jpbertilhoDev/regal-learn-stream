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
import { useAdminLessons, useDeleteLesson } from "@/hooks/useAdminLessons";
import { useAdminTrails } from "@/hooks/useAdminTrails";
import { Plus, Pencil, Trash2, Search, Lock } from "lucide-react";

export default function LessonsList() {
  const [search, setSearch] = useState("");
  const [selectedTrail, setSelectedTrail] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: trails } = useAdminTrails();
  const { data: lessons, isLoading } = useAdminLessons();
  const deleteLesson = useDeleteLesson();

  const filteredLessons = lessons?.filter((lesson) => {
    const matchesSearch = lesson.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesTrail =
      selectedTrail === "all" ||
      lesson.module?.trail?.id === selectedTrail;
    return matchesSearch && matchesTrail;
  });

  const handleDelete = async () => {
    if (deleteId) {
      await deleteLesson.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">
              Aulas
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todas as aulas do sistema
            </p>
          </div>
          <Link to="/admin/lessons/new">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Nova Aula
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar aulas..."
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
            Carregando aulas...
          </div>
        ) : filteredLessons && filteredLessons.length > 0 ? (
          <div className="border border-border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Thumb</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Trilha</TableHead>
                  <TableHead className="text-center">Duração</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Premium</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell>
                      <div className="w-16 h-12 rounded overflow-hidden bg-muted">
                        {lesson.thumbnail_url ? (
                          <img
                            src={lesson.thumbnail_url}
                            alt={lesson.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            Sem thumb
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {lesson.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {lesson.module?.title || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {lesson.module?.trail?.title || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {formatDuration(lesson.video_duration)}
                    </TableCell>
                    <TableCell className="text-center">
                      {lesson.is_published ? (
                        <Badge className="bg-green-500">Publicado</Badge>
                      ) : (
                        <Badge variant="secondary">Rascunho</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {lesson.requires_subscription ? (
                        <Lock className="h-4 w-4 mx-auto text-yellow-500" />
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          Livre
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/lessons/${lesson.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(lesson.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {search
              ? "Nenhuma aula encontrada com esse termo"
              : "Nenhuma aula cadastrada ainda"}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta aula? Esta ação não pode ser
              desfeita.
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
