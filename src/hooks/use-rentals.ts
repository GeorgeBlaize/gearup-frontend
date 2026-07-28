"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { ApiError } from "@/lib/api/client"
import {
  rentalsApi,
  type CreateRentalPayload,
} from "@/lib/api/rentals"
import type { RentalStatus } from "@/types/api"

export function useMyRentals(params: { status?: RentalStatus; page?: number } = {}) {
  return useQuery({
    queryKey: ["rentals", "mine", params],
    queryFn: () => rentalsApi.myRentals(params),
  })
}

export function useRentalDetails(id: string) {
  return useQuery({
    queryKey: ["rentals", id],
    queryFn: () => rentalsApi.getById(id),
    enabled: !!id,
  })
}

export function useCheckAvailability(
  gearId: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ["rentals", "availability", gearId, startDate, endDate],
    queryFn: () => rentalsApi.checkAvailability(gearId, startDate!, endDate!),
    enabled: !!gearId && !!startDate && !!endDate,
    retry: false,
  })
}

export function useCreateRental() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateRentalPayload) => rentalsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] })
      toast.success("Rental order placed — proceed to payment")
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to place rental order"
      )
    },
  })
}

export function useCancelRental() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      rentalsApi.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] })
      toast.success("Rental cancelled")
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to cancel rental"
      )
    },
  })
}
