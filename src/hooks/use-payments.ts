"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { ApiError } from "@/lib/api/client"
import { paymentsApi } from "@/lib/api/payments"

export function usePaymentHistory() {
  return useQuery({
    queryKey: ["payments", "mine"],
    queryFn: () => paymentsApi.history(),
  })
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (rentalOrderId: string) => paymentsApi.create(rentalOrderId),
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Could not start payment"
      )
    },
  })
}

export function useConfirmPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (paymentIntentId: string) => paymentsApi.confirm(paymentIntentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] })
      queryClient.invalidateQueries({ queryKey: ["payments"] })
    },
  })
}
