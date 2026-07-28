import { Compass } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <Compass className="size-12 text-muted-foreground" />
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-muted-foreground">
        We couldn&apos;t find the page you&apos;re looking for.
      </p>
      <div className="flex gap-3">
        <Link href="/" className={cn(buttonVariants())}>
          Go home
        </Link>
        <Link href="/gear" className={cn(buttonVariants({ variant: "outline" }))}>
          Browse gear
        </Link>
      </div>
    </div>
  )
}
