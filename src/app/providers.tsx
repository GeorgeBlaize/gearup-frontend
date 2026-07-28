"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { useEffect, useState } from "react"

import { Toaster } from "@/components/ui/sonner"
import { useAuthStore } from "@/lib/auth-store"
import { makeQueryClient } from "@/lib/query-client"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient())
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-center" />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
