"use client"

import { Elements } from "@stripe/react-stripe-js"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { use, useEffect, useRef } from "react"

import { StatusBadge } from "@/components/common/status-badge"
import { StripeCheckoutForm } from "@/components/payments/stripe-checkout-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCreatePayment } from "@/hooks/use-payments"
import { useRentalDetails } from "@/hooks/use-rentals"
import { getStripe } from "@/lib/stripe"
import { cn, formatCurrency } from "@/lib/utils"

export default function PayOrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: rental, isLoading } = useRentalDetails(id)
  const createPayment = useCreatePayment()
  const requested = useRef(false)

  const needsPayment =
    !!rental && rental.status === "CONFIRMED" && !rental.payment

  useEffect(() => {
    if (needsPayment && !requested.current) {
      requested.current = true
      createPayment.mutate(id)
    }
  }, [needsPayment, id, createPayment])

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!rental) {
    return <p className="text-muted-foreground">Order not found.</p>
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Payment</h1>
        <StatusBadge status={rental.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order {rental.orderNumber}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          {rental.rentalItems.map((item) => (
            <div key={item.gearItemId} className="flex justify-between">
              <span>
                {item.gearItem.name} × {item.quantity}
              </span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(rental.totalAmount)}</span>
          </div>
        </CardContent>
      </Card>

      {rental.status === "PAID" || rental.payment?.status === "COMPLETED" ? (
        <Alert>
          <AlertDescription>
            This order has already been paid.{" "}
            <Link href={`/dashboard/customer/orders/${rental.id}`}>View order</Link>
          </AlertDescription>
        </Alert>
      ) : rental.status !== "CONFIRMED" ? (
        <Alert>
          <AlertDescription>
            This order isn&apos;t ready for payment yet. The provider needs to
            confirm it first (current status: {rental.status}).
          </AlertDescription>
        </Alert>
      ) : rental.payment ? (
        <Alert variant="destructive">
          <AlertDescription>
            A payment attempt already exists for this order (status:{" "}
            {rental.payment.status}). Please contact support if you believe this
            is an error.
          </AlertDescription>
        </Alert>
      ) : createPayment.isPending || !createPayment.data ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Preparing secure payment…
        </div>
      ) : (
        <Elements
          stripe={getStripe()}
          options={{ clientSecret: createPayment.data.clientSecret }}
        >
          <StripeCheckoutForm rentalId={rental.id} clientSecret={createPayment.data.clientSecret} />
        </Elements>
      )}

      <Link
        href={`/dashboard/customer/orders/${rental.id}`}
        className={cn(buttonVariants({ variant: "ghost" }), "w-fit")}
      >
        Back to order
      </Link>
    </div>
  )
}
