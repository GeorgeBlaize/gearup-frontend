"use client"

import { CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { StatusBadge } from "@/components/common/status-badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRentalDetails } from "@/hooks/use-rentals"
import { cn, formatCurrency } from "@/lib/utils"

function SuccessContent() {
  const rentalId = useSearchParams().get("rentalId")
  const { data: rental, isLoading } = useRentalDetails(rentalId ?? "")

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
      <CheckCircle2 className="size-14 text-green-500" />
      <h1 className="text-2xl font-semibold">Payment successful</h1>
      <p className="text-muted-foreground">
        Thanks! Your rental is confirmed and the provider has been notified.
      </p>

      {isLoading && rentalId && (
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      )}

      {rental && (
        <Card className="w-full text-left">
          <CardContent className="flex flex-col gap-2 pt-6 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">Order {rental.orderNumber}</span>
              <StatusBadge status={rental.status} />
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Amount paid</span>
              <span>{formatCurrency(rental.totalAmount)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-2 flex gap-3">
        {rentalId && (
          <Link
            href={`/dashboard/customer/orders/${rentalId}`}
            className={cn(buttonVariants())}
          >
            View order
          </Link>
        )}
        <Link
          href="/dashboard/customer"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  )
}
