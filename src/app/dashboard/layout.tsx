"use client"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { DashboardNav } from "@/components/layout/dashboard-nav"
import { useAuth, useMe } from "@/hooks/use-auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, token, isHydrated } = useAuth()
  const router = useRouter()

  useMe(isHydrated && !!token)

  useEffect(() => {
    if (isHydrated && !token) {
      router.replace("/auth/login")
    }
  }, [isHydrated, token, router])

  if (!isHydrated || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <DashboardNav role={user.role} />
      <div className="px-4 py-6 sm:px-6">{children}</div>
    </div>
  )
}
