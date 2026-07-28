"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { ApiError } from "@/lib/api/client"
import { providerApi, type GearFormPayload } from "@/lib/api/provider"
import type { RentalStatus } from "@/types/api"

export function useProviderStats() {
  return useQuery({
    queryKey: ["provider", "stats"],
    queryFn: () => providerApi.stats(),
  })
}

export function useProviderGear(
  params: { categoryId?: string; availability?: boolean; search?: string; page?: number } = {}
) {
  return useQuery({
    queryKey: ["provider", "gear", params],
    queryFn: () => providerApi.myGear(params),
  })
}

export function useCreateGear() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: GearFormPayload) => providerApi.createGear(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider", "gear"] })
      toast.success("Gear listed successfully")
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Failed to add gear")
    },
  })
}

export function useUpdateGear() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<GearFormPayload> }) =>
      providerApi.updateGear(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider", "gear"] })
      queryClient.invalidateQueries({ queryKey: ["gear"] })
      toast.success("Gear updated")
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Failed to update gear")
    },
  })
}

export function useDeleteGear() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => providerApi.deleteGear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider", "gear"] })
      toast.success("Gear removed")
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Failed to delete gear")
    },
  })
}

export function useProviderOrders(
  params: { status?: RentalStatus; page?: number } = {}
) {
  return useQuery({
    queryKey: ["provider", "orders", params],
    queryFn: () => providerApi.incomingOrders(params),
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      status,
      note,
    }: {
      id: string
      status: "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED"
      note?: string
    }) => providerApi.updateOrderStatus(id, status, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["provider", "orders"] })
      queryClient.invalidateQueries({ queryKey: ["provider", "stats"] })
      toast.success(`Order updated to ${variables.status.replace("_", " ")}`)
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to update order"
      )
    },
  })
}
