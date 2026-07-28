"use client"

import { Menu, PackageSearch, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth, useLogout } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/api"

const DASHBOARD_PATH: Record<UserRole, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function Navbar() {
  const { user, isAuthenticated } = useAuth()
  const logout = useLogout()
  const [open, setOpen] = useState(false)

  const dashboardHref = user ? DASHBOARD_PATH[user.role] : "/auth/login"

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <PackageSearch className="size-5 text-primary" />
          <span>GearUp</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <Link href="/gear" className="text-muted-foreground hover:text-foreground">
            Browse Gear
          </Link>
          {isAuthenticated && (
            <Link
              href={dashboardHref}
              className="text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" className="gap-2 px-1.5" />}
              >
                <Avatar className="size-7">
                  <AvatarFallback className="text-xs">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-32 truncate">{user.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="truncate">{user.email}</span>
                  <Badge variant="secondary" className="w-fit text-[10px] uppercase">
                    {user.role}
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href={dashboardHref} />}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} variant="destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                Log in
              </Link>
              <Link href="/auth/register" className={cn(buttonVariants())}>
                Sign up
              </Link>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="md:hidden" />}
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <PackageSearch className="size-5 text-primary" />
                GearUp
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
              >
                Home
              </Link>
              <Link
                href="/gear"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
              >
                Browse Gear
              </Link>
              {isAuthenticated && user ? (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
                  >
                    Dashboard
                  </Link>
                  <div className="mt-2 flex items-center gap-2 border-t px-2 py-3 text-sm text-muted-foreground">
                    <UserIcon className="size-4" />
                    {user.name} ({user.role})
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOpen(false)
                      logout()
                    }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <div className="mt-2 flex flex-col gap-2 border-t pt-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants())}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
