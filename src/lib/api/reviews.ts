import { apiClient } from "@/lib/api/client"
import type { Review } from "@/types/api"

export interface ReviewPayload {
  gearItemId: string
  rating: number
  comment?: string
}

export const reviewsApi = {
  byGear: (gearId: string) =>
    apiClient.get<{ reviews: Review[] }>(`/reviews/gear/${gearId}`, {
      auth: false,
    }),
  mine: () => apiClient.get<{ reviews: Review[] }>("/reviews/me"),
  create: (payload: ReviewPayload) =>
    apiClient.post<{ review: Review }>("/reviews", payload),
  update: (id: string, payload: { rating?: number; comment?: string }) =>
    apiClient.patch<{ review: Review }>(`/reviews/${id}`, payload),
  remove: (id: string) => apiClient.delete<void>(`/reviews/${id}`),
}
