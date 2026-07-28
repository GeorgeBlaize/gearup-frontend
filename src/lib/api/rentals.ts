import { apiClient } from "@/lib/api/client"
import { buildQueryString } from "@/lib/utils"
import type { RentalListResponse, RentalOrder, RentalStatus } from "@/types/api"

export interface CreateRentalPayload {
  gearItems: { gearItemId: string; quantity: number }[]
  startDate: string
  endDate: string
}

export interface AvailabilityResult {
  gearId: string
  name: string
  totalQuantity: number
  bookedQuantity: number
  availableQuantity: number
  isAvailable: boolean
  pricePerDay: number
}

export const rentalsApi = {
  create: (payload: CreateRentalPayload) =>
    apiClient.post<{ rental: RentalOrder; days: number; items: number }>(
      "/rentals",
      payload
    ),
  myRentals: (params: { status?: RentalStatus; page?: number; limit?: number } = {}) =>
    apiClient.get<RentalListResponse>(`/rentals${buildQueryString(params)}`),
  checkAvailability: (gearId: string, startDate: string, endDate: string) =>
    apiClient.get<AvailabilityResult>(
      `/rentals/availability${buildQueryString({ gearId, startDate, endDate })}`
    ),
  getById: (id: string) => apiClient.get<RentalOrder>(`/rentals/${id}`),
  cancel: (id: string, reason?: string) =>
    apiClient.patch<{ rental: RentalOrder }>(`/rentals/${id}/cancel`, {
      reason,
    }),
}
