import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useReviews, useUserReview, useCreateReview } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReviewsProps {
  trailId: string;
}

export const Reviews = ({ trailId }: ReviewsProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { data: reviews, isLoading } = useReviews(trailId);
  const { data: userReview } = useUserReview(trailId);
  const createReview = useCreateReview();
  const { user } = useAuth();

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r: any) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    createReview.mutate(
      { trailId, rating, reviewText },
      {
        onSuccess: () => {
          setRating(0);
          setReviewText("");
          setShowForm(false);
        },
      }
    );
  };

  const StarRating = ({ value, size = "w-5 h-5" }: { value: number; size?: string }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= value
              ? "fill-primary text-primary"
              : "fill-none text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-display font-bold mb-2">
            Avaliações {reviews && `(${reviews.length})`}
          </h2>
          {reviews && reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <StarRating value={Math.round(averageRating)} />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} de 5
              </span>
            </div>
          )}
        </div>

        {user && !userReview && !showForm && (
          <Button onClick={() => setShowForm(true)}>Avaliar Trilha</Button>
        )}
      </div>

      {/* Review Form */}
      {user && (showForm || userReview) && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-secondary/20 rounded-lg border border-border/50">
          <p className="font-semibold mb-3">
            {userReview ? "Sua Avaliação" : "Avaliar Trilha"}
          </p>
          
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
                disabled={!!userReview}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating || userReview?.rating || 0)
                      ? "fill-primary text-primary"
                      : "fill-none text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>

          {!userReview && (
            <>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Compartilhe sua experiência com esta trilha (opcional)..."
                className="mb-3"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setRating(0);
                    setReviewText("");
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={rating === 0 || createReview.isPending}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  {createReview.isPending ? "Publicando..." : "Publicar"}
                </Button>
              </div>
            </>
          )}

          {userReview && (
            <p className="text-sm text-muted-foreground">
              {userReview.review_text || "Sem comentário"}
            </p>
          )}
        </form>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <p className="text-center text-muted-foreground py-4">
          Carregando avaliações...
        </p>
      ) : !reviews || reviews.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          Nenhuma avaliação ainda. Seja o primeiro a avaliar!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div
              key={review.id}
              className="p-4 bg-secondary/20 rounded-lg border border-border/50"
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={review.profiles?.avatar_url} />
                  <AvatarFallback>
                    {review.profiles?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm">
                        {review.profiles?.name || "Usuário"}
                      </p>
                      <StarRating value={review.rating} size="w-4 h-4" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                  {review.review_text && (
                    <p className="text-sm text-foreground leading-relaxed">
                      {review.review_text}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
