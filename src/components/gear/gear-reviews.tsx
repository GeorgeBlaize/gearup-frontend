import { Star } from "lucide-react"

import { cn, formatDate } from "@/lib/utils"
import type { GearReview } from "@/types/api"

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
          )}
        />
      ))}
    </div>
  )
}

export function GearReviews({ reviews }: { reviews: GearReview[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No reviews yet — be the first to rent and review this gear.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review, i) => (
        <div key={review.id ?? i} className="flex flex-col gap-1 border-b pb-4 last:border-0">
          <div className="flex items-center justify-between">
            <p className="font-medium">{review.customer.name}</p>
            <span className="text-xs text-muted-foreground">
              {formatDate(review.createdAt)}
            </span>
          </div>
          <Stars rating={review.rating} />
          {review.comment && (
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  )
}
