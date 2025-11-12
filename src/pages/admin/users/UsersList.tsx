import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  useAdminUsers,
  useAddAdminRole,
  useRemoveAdminRole,
} from "@/hooks/useAdminUsers";
import { Search, Eye, ShieldCheck, ShieldOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function UsersList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [toggleAdminDialog, setToggleAdminDialog] = useState<{
    userId: string;
    isAdmin: boolean;
    userName: string;
  } | null>(null);

  const { data: users, isLoading } = useAdminUsers(roleFilter);
  const addAdminRole = useAddAdminRole();
  const removeAdminRole = useRemoveAdminRole();

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const isUserAdmin = (user: any) => {
    return user.user_roles?.some((ur: any) => ur.role === "admin");
  };

  const handleToggleAdmin = async () => {
    if (!toggleAdminDialog) return;

    const { userId, isAdmin } = toggleAdminDialog;

    if (isAdmin) {
      await removeAdminRole.mutateAsync(userId);
    } else {
      await addAdminRole.mutateAsync(userId);
    }

    setToggleAdminDialog(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">
            Usuários
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie todos os usuários e permissões
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="admin">Apenas Admins</SelectItem>
              <SelectItem value="user">Apenas Usuários</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando usuários...
          </div>
        ) : filteredUsers && filteredUsers.length > 0 ? (
          <div className="border border-border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assinatura</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const admin = isUserAdmin(user);
                  const subscription = user.subscriptions?.[0];

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {admin ? (
                          <Badge className="bg-purple-500">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Usuário</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {subscription ? (
                          <div>
                            <Badge
                              variant={
                                subscription.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                subscription.status === "active"
                                  ? "bg-green-500"
                                  : ""
                              }
                            >
                              {subscription.status === "active"
                                ? "Ativo"
                                : "Inativo"}
                            </Badge>
                            {subscription.plan_type && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {subscription.plan_type}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Sem assinatura
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(user.created_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              navigate(`/admin/users/${user.id}`)
                            }
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setToggleAdminDialog({
                                userId: user.id,
                                isAdmin: admin,
                                userName: user.name,
                              })
                            }
                            title={
                              admin
                                ? "Remover permissão de admin"
                                : "Conceder permissão de admin"
                            }
                          >
                            {admin ? (
                              <ShieldOff className="h-4 w-4 text-orange-500" />
                            ) : (
                              <ShieldCheck className="h-4 w-4 text-purple-500" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {search
              ? "Nenhum usuário encontrado com esse termo"
              : "Nenhum usuário cadastrado ainda"}
          </div>
        )}
      </div>

      {/* Toggle Admin Dialog */}
      <AlertDialog
        open={!!toggleAdminDialog}
        onOpenChange={() => setToggleAdminDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleAdminDialog?.isAdmin
                ? "Remover permissão de admin"
                : "Conceder permissão de admin"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleAdminDialog?.isAdmin ? (
                <>
                  Tem certeza que deseja remover a permissão de admin de{" "}
                  <strong>{toggleAdminDialog.userName}</strong>? O usuário não
                  poderá mais acessar o painel administrativo.
                </>
              ) : (
                <>
                  Tem certeza que deseja conceder permissão de admin para{" "}
                  <strong>{toggleAdminDialog?.userName}</strong>? O usuário
                  terá acesso completo ao painel administrativo.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleAdmin}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
