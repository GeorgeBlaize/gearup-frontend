"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { adminApi } from "@/lib/api/admin"
import { ApiError } from "@/lib/api/client"
import type { RentalStatus, UserRole } from "@/types/api"

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminApi.dashboardStats(),
  })
}

export function useAdminUsers(
  params: { role?: UserRole; isActive?: boolean; search?: string; page?: number } = {}
) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => adminApi.users(params),
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.updateUserStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      toast.success(variables.isActive ? "User activated" : "User suspended")
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to update user"
      )
    },
  })
}

export function useAdminGear(
  params: { categoryId?: string; providerId?: string; search?: string; page?: number } = {}
) {
  return useQuery({
    queryKey: ["admin", "gear", params],
    queryFn: () => adminApi.gear(params),
  })
}

export function useAdminDeleteGear() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteGear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gear"] })
      toast.success("Gear listing removed")
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Failed to delete gear")
    },
  })
}

export function useAdminRentals(
  params: { status?: RentalStatus; page?: number } = {}
) {
  return useQuery({
    queryKey: ["admin", "rentals", params],
    queryFn: () => adminApi.rentals(params),
  })
}

export function useAdminUpdateRentalStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: string
      status: RentalStatus
      reason?: string
    }) => adminApi.updateRentalStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "rentals"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] })
      toast.success("Rental status updated")
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to update rental"
      )
    },
  })
}
