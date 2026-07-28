"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { ApiError } from "@/lib/api/client"
import { authApi, type LoginPayload, type RegisterPayload } from "@/lib/api/auth"
import { useAuthStore } from "@/lib/auth-store"

export function useAuth() {
  const { user, token, isHydrated } = useAuthStore()
  return { user, token, isAuthenticated: !!token, isHydrated }
}

export function useMe(enabled: boolean) {
  const setUser = useAuthStore((state) => state.setUser)
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { user } = await authApi.me()
      setUser(user)
      return user
    },
    enabled,
    staleTime: 60 * 1000,
    retry: false,
  })
}

export function useLogin(redirectTo?: string) {
  const setAuth = useAuthStore((state) => state.setAuth)
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      queryClient.invalidateQueries()
      toast.success(`Welcome back, ${user.name}`)
      router.push(
        redirectTo ||
          (user.role === "ADMIN"
            ? "/dashboard/admin"
            : user.role === "PROVIDER"
              ? "/dashboard/provider"
              : "/dashboard/customer")
      )
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Login failed")
    },
  })
}

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      toast.success("Account created — welcome to GearUp!")
      router.push(
        user.role === "PROVIDER" ? "/dashboard/provider" : "/dashboard/customer"
      )
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Registration failed"
      )
    },
  })
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()
  const queryClient = useQueryClient()

  return () => {
    logout()
    queryClient.clear()
    toast.success("Logged out")
    router.push("/auth/login")
  }
}
