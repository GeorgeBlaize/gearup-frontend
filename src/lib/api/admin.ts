import { apiClient } from "@/lib/api/client"
import { buildQueryString } from "@/lib/utils"
import type {
  AdminDashboardStats,
  GearItem,
  Pagination,
  RentalOrder,
  RentalStatus,
  User,
  UserRole,
} from "@/types/api"

export const adminApi = {
  users: (
    params: { role?: UserRole; isActive?: boolean; search?: string; page?: number; limit?: number } = {}
  ) =>
    apiClient.get<{ users: User[]; pagination: Pagination }>(
      `/admin/users${buildQueryString(params)}`
    ),
  userById: (id: string) => apiClient.get<{ user: User }>(`/admin/users/${id}`),
  updateUserStatus: (id: string, isActive: boolean) =>
    apiClient.patch<{ user: User }>(`/admin/users/${id}/status`, { isActive }),

  gear: (
    params: { categoryId?: string; providerId?: string; availability?: boolean; search?: string; page?: number; limit?: number } = {}
  ) =>
    apiClient.get<{ gear: GearItem[]; pagination: Pagination }>(
      `/admin/gear${buildQueryString(params)}`
    ),
  deleteGear: (id: string) => apiClient.delete<void>(`/admin/gear/${id}`),

  rentals: (
    params: {
      status?: RentalStatus
      customerId?: string
      providerId?: string
      fromDate?: string
      toDate?: string
      page?: number
      limit?: number
    } = {}
  ) =>
    apiClient.get<{ rentals: RentalOrder[]; pagination: Pagination }>(
      `/admin/rentals${buildQueryString(params)}`
    ),
  rentalById: (id: string) =>
    apiClient.get<{ rental: RentalOrder }>(`/admin/rentals/${id}`),
  updateRentalStatus: (id: string, status: RentalStatus, reason?: string) =>
    apiClient.patch<{ rental: RentalOrder }>(`/admin/rentals/${id}/status`, {
      status,
      reason,
    }),

  dashboardStats: () =>
    apiClient.get<AdminDashboardStats>("/admin/dashboard/stats"),
}
