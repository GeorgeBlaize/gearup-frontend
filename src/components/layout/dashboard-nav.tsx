"use client"

import { LayoutDashboard, ListChecks, Package, ShoppingBag, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/api"

const NAV_ITEMS: Record<
  UserRole,
  { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[]
> = {
  CUSTOMER: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
  ],
  PROVIDER: [
    { href: "/dashboard/provider", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/provider/gear", label: "Inventory", icon: Package },
    { href: "/dashboard/provider/orders", label: "Orders", icon: ListChecks },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/gear", label: "Gear", icon: Package },
    { href: "/dashboard/admin/rentals", label: "Rentals", icon: ShoppingBag },
  ],
}

export function DashboardNav({ role }: { role: UserRole }) {
  const pathname = usePathname()
  const items = NAV_ITEMS[role]

  return (
    <nav className="flex gap-1 overflow-x-auto border-b px-4 sm:px-6">
      {items.map((item) => {
        const active =
          item.href === pathname ||
          (item.href !== `/dashboard/${role.toLowerCase()}` &&
            pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors",
              active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
