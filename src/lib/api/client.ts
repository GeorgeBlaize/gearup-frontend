import { useAuthStore } from "@/lib/auth-store"
import type { ApiResponse } from "@/types/api"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"

export class ApiError extends Error {
  status: number
  errorDetails?: string

  constructor(message: string, status: number, errorDetails?: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.errorDetails = errorDetails
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
  auth?: boolean
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string>),
  }

  if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json"
  }

  if (auth) {
    const token = useAuthStore.getState().token
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`
    }
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(
      "Could not reach the server. Check your connection and try again.",
      0
    )
  }

  let payload: ApiResponse<T> | undefined
  try {
    payload = await response.json()
  } catch {
    payload = undefined
  }

  if (!response.ok || !payload?.success) {
    if (response.status === 401 && auth) {
      useAuthStore.getState().logout()
    }
    throw new ApiError(
      payload?.message ?? `Request failed with status ${response.status}`,
      response.status,
      payload?.errorDetails
    )
  }

  return payload.data as T
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
}
