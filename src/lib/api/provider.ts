import { apiClient } from "@/lib/api/client"
import { buildQueryString } from "@/lib/utils"
import type {
  GearItem,
  Pagination,
  ProviderStats,
  RentalOrder,
  RentalStatus,
} from "@/types/api"

export interface GearFormPayload {
  name: string
  description: string
  pricePerDay: number
  brand?: string
  condition: "Excellent" | "Good" | "Fair" | "Poor"
  quantity: number
  categoryId: string
  images: string[]
  availability?: boolean
}

export const providerApi = {
  myGear: (
    params: { categoryId?: string; availability?: boolean; search?: string; page?: number; limit?: number } = {}
  ) =>
    apiClient.get<{ gear: GearItem[]; pagination: Pagination }>(
      `/provider/gear${buildQueryString(params)}`
    ),
  createGear: (payload: GearFormPayload) =>
    apiClient.post<{ gear: GearItem }>("/provider/gear", payload),
  updateGear: (id: string, payload: Partial<GearFormPayload>) =>
    apiClient.put<{ gear: GearItem }>(`/provider/gear/${id}`, payload),
  deleteGear: (id: string) => apiClient.delete<void>(`/provider/gear/${id}`),

  incomingOrders: (
    params: { status?: RentalStatus; fromDate?: string; toDate?: string; page?: number; limit?: number } = {}
  ) =>
    apiClient.get<{ orders: RentalOrder[]; pagination: Pagination }>(
      `/provider/orders${buildQueryString(params)}`
    ),
  orderDetails: (id: string) =>
    apiClient.get<{ order: RentalOrder }>(`/provider/orders/${id}`),
  updateOrderStatus: (
    id: string,
    status: "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED",
    note?: string
  ) =>
    apiClient.patch<{ order: RentalOrder }>(`/provider/orders/${id}`, {
      status,
      note,
    }),

  stats: () => apiClient.get<ProviderStats>("/provider/stats"),
}
