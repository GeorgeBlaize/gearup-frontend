import { apiClient } from "@/lib/api/client"
import type { Category } from "@/types/api"

export const categoriesApi = {
  list: () =>
    apiClient.get<{ categories: Category[] }>("/categories", { auth: false }),
}
