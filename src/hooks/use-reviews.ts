"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { ApiError } from "@/lib/api/client"
import { reviewsApi, type ReviewPayload } from "@/lib/api/reviews"

export function useGearReviews(gearId: string) {
  return useQuery({
    queryKey: ["reviews", "gear", gearId],
    queryFn: () => reviewsApi.byGear(gearId),
    enabled: !!gearId,
  })
}

export function useMyReviews() {
  return useQuery({
    queryKey: ["reviews", "mine"],
    queryFn: () => reviewsApi.mine(),
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ReviewPayload) => reviewsApi.create(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
      queryClient.invalidateQueries({ queryKey: ["rentals"] })
      queryClient.invalidateQueries({ queryKey: ["gear", variables.gearItemId] })
      toast.success("Thanks for your review!")
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to submit review"
      )
    },
  })
}
