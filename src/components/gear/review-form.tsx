"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Star } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useCreateReview } from "@/hooks/use-reviews"
import { cn } from "@/lib/utils"
import { reviewSchema, type ReviewFormValues } from "@/lib/validators/review"

export function ReviewForm({
  gearItemId,
  gearName,
  onSubmitted,
}: {
  gearItemId: string
  gearName: string
  onSubmitted?: () => void
}) {
  const createReview = useCreateReview()

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: "" },
  })

  function onSubmit(values: ReviewFormValues) {
    createReview.mutate(
      { gearItemId, rating: values.rating, comment: values.comment || undefined },
      { onSuccess: () => onSubmitted?.() }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <p className="text-sm font-medium">Review: {gearName}</p>
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={cn(
                          "size-6",
                          value <= field.value
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment (optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="How was the gear?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createReview.isPending} className="w-fit">
          {createReview.isPending && <Loader2 className="size-4 animate-spin" />}
          Submit review
        </Button>
      </form>
    </Form>
  )
}
