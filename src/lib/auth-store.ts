import Cookies from "js-cookie"
import { create } from "zustand"

import type { User } from "@/types/api"

const TOKEN_COOKIE = "gearup_token"
const ROLE_COOKIE = "gearup_role"
const COOKIE_EXPIRES_DAYS = 7

interface AuthState {
  user: User | null
  token: string | null
  isHydrated: boolean
  setAuth: (user: User, token: string) => void
  setUser: (user: User) => void
  logout: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isHydrated: false,

  setAuth: (user, token) => {
    Cookies.set(TOKEN_COOKIE, token, { expires: COOKIE_EXPIRES_DAYS })
    Cookies.set(ROLE_COOKIE, user.role, { expires: COOKIE_EXPIRES_DAYS })
    if (typeof window !== "undefined") {
      window.localStorage.setItem("gearup_user", JSON.stringify(user))
    }
    set({ user, token, isHydrated: true })
  },

  setUser: (user) => {
    Cookies.set(ROLE_COOKIE, user.role, { expires: COOKIE_EXPIRES_DAYS })
    if (typeof window !== "undefined") {
      window.localStorage.setItem("gearup_user", JSON.stringify(user))
    }
    set({ user })
  },

  logout: () => {
    Cookies.remove(TOKEN_COOKIE)
    Cookies.remove(ROLE_COOKIE)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("gearup_user")
    }
    set({ user: null, token: null, isHydrated: true })
  },

  hydrate: () => {
    const token = Cookies.get(TOKEN_COOKIE) ?? null
    let user: User | null = null
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("gearup_user")
      if (raw) {
        try {
          user = JSON.parse(raw) as User
        } catch {
          user = null
        }
      }
    }
    set({ token, user: token ? user : null, isHydrated: true })
  },
}))
