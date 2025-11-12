import { useState } from "react";
import { MessageCircle, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useComments, useCreateComment, useDeleteComment } from "@/hooks/useComments";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CommentsProps {
  lessonId: string;
}

export const Comments = ({ lessonId }: CommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const { data: comments, isLoading } = useComments(lessonId);
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    createComment.mutate(
      { lessonId, content: newComment },
      {
        onSuccess: () => setNewComment(""),
      }
    );
  };

  const handleDelete = (commentId: string) => {
    if (confirm("Tem certeza que deseja excluir este comentário?")) {
      deleteComment.mutate(commentId);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-display font-bold">
          Comentários {comments && `(${comments.length})`}
        </h2>
      </div>

      {/* New Comment Form */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Deixe seu comentário..."
            className="mb-3"
            rows={3}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!newComment.trim() || createComment.isPending}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              {createComment.isPending ? "Publicando..." : "Publicar"}
            </Button>
          </div>
        </form>
      )}

      {/* Comments List */}
      {isLoading ? (
        <p className="text-center text-muted-foreground py-4">
          Carregando comentários...
        </p>
      ) : !comments || comments.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          Nenhum comentário ainda. Seja o primeiro a comentar!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment: any) => (
            <div
              key={comment.id}
              className="p-4 bg-secondary/20 rounded-lg border border-border/50"
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.profiles?.avatar_url} />
                  <AvatarFallback>
                    {comment.profiles?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm">
                      {comment.profiles?.name || "Usuário"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                      {user?.id === comment.user_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(comment.id)}
                          className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
