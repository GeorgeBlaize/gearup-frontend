"use client"

import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function GearDetailsError({
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
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <AlertTriangle className="size-10 text-destructive" />
      <h1 className="text-xl font-semibold">Couldn&apos;t load this gear item</h1>
      <p className="text-sm text-muted-foreground">
        Something went wrong while fetching this listing. Please try again.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href="/gear" className={cn(buttonVariants({ variant: "outline" }))}>
          Back to browse
        </Link>
      </div>
    </div>
  )
}
