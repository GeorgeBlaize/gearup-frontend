import { apiClient } from "@/lib/api/client"
import { buildQueryString } from "@/lib/utils"
import type { GearItem, GearListResponse } from "@/types/api"

export interface GearFilters {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  availability?: boolean
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export const gearApi = {
  list: (filters: GearFilters = {}) =>
    apiClient.get<GearListResponse>(`/gear${buildQueryString(filters)}`, {
      auth: false,
    }),
  getById: (id: string) =>
    apiClient.get<GearItem>(`/gear/${id}`, { auth: false }),
}
