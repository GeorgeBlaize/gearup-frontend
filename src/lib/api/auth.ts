import { apiClient } from "@/lib/api/client"
import type { User, UserRole } from "@/types/api"

export interface RegisterPayload {
  email: string
  password: string
  name: string
  role: UserRole
  phone?: string
  address?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResult {
  user: User
  token: string
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResult>("/auth/register", payload, { auth: false }),
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResult>("/auth/login", payload, { auth: false }),
  me: () => apiClient.get<{ user: User }>("/auth/me"),
}
