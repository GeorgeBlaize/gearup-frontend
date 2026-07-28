"use client"

import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertTriangle className="size-10 text-destructive" />
      <h1 className="text-lg font-semibold">Dashboard error</h1>
      <p className="text-sm text-muted-foreground">
        Something went wrong loading this page.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Go home
        </Link>
      </div>
    </div>
  )
}
