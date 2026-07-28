import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react"
import Link from "next/link"

import { GearGrid } from "@/components/gear/gear-grid"
import { buttonVariants } from "@/components/ui/button"
import { gearApi } from "@/lib/api/gear"
import { cn } from "@/lib/utils"

export default async function HomePage() {
  const { gear } = await gearApi
    .list({ limit: 8, sortBy: "createdAt", sortOrder: "desc" })
    .catch(() => ({ gear: [] }))

  return (
    <div className="flex flex-col">
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:py-24">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Rent sports &amp; outdoor gear, instantly.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Bikes, tents, kayaks, skis, and more — from local providers, ready
            when you are. Pick your dates, pay securely, and gear up.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/gear" className={cn(buttonVariants({ size: "lg" }))}>
              Browse gear <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/auth/register"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              List your gear
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">Curated inventory</p>
                <p className="text-sm text-muted-foreground">
                  Quality-checked gear from vetted providers.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">Secure payments</p>
                <p className="text-sm text-muted-foreground">
                  Checkout safely with Stripe.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">Track every order</p>
                <p className="text-sm text-muted-foreground">
                  Real-time status from placed to returned.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured gear</h2>
          <Link href="/gear" className={cn(buttonVariants({ variant: "ghost" }))}>
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <GearGrid gear={gear} />
      </section>
    </div>
  )
}
