"use client"

import { XCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function CancelContent() {
  const rentalId = useSearchParams().get("rentalId")

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
      <XCircle className="size-14 text-destructive" />
      <h1 className="text-2xl font-semibold">Payment not completed</h1>
      <p className="text-muted-foreground">
        Your payment was cancelled or didn&apos;t go through. No charge was made.
        You can try again from your order.
      </p>

      <div className="mt-2 flex gap-3">
        {rentalId && (
          <Link
            href={`/dashboard/customer/orders/${rentalId}/pay`}
            className={cn(buttonVariants())}
          >
            Try again
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

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={null}>
      <CancelContent />
    </Suspense>
  )
}
