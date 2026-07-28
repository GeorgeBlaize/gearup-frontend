import { apiClient } from "@/lib/api/client"
import type { CreatePaymentResult, Payment } from "@/types/api"

export const paymentsApi = {
  create: (rentalOrderId: string) =>
    apiClient.post<CreatePaymentResult>("/payments/create", {
      rentalOrderId,
      provider: "STRIPE",
    }),
  confirm: (paymentIntentId: string) =>
    apiClient.post<Payment>("/payments/confirm", { paymentIntentId }),
  history: () => apiClient.get<{ payments: Payment[] }>("/payments"),
  getById: (id: string) => apiClient.get<{ payment: Payment }>(`/payments/${id}`),
}
