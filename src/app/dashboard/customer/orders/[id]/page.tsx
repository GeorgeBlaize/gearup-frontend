"use client"

import { Loader2 } from "lucide-react"
import Link from "next/link"
import { use } from "react"

import { StatusBadge } from "@/components/common/status-badge"
import { ReviewForm } from "@/components/gear/review-form"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useRentalDetails } from "@/hooks/use-rentals"
import { cn, formatCurrency, formatDate } from "@/lib/utils"

export default function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: rental, isLoading } = useRentalDetails(id)

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
    <div className="flex max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Order {rental.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            Placed {formatDate(rental.createdAt)}
          </p>
        </div>
        <StatusBadge status={rental.status} />
      </div>

      {rental.status === "CONFIRMED" && (
        <Link
          href={`/dashboard/customer/orders/${rental.id}/pay`}
          className={cn(buttonVariants(), "w-fit")}
        >
          Pay Now
        </Link>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rental period</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm">
          <p>
            {formatDate(rental.startDate)} – {formatDate(rental.endDate)}
          </p>
          {typeof rental.daysRemaining === "number" && rental.status !== "RETURNED" && (
            <p className="text-muted-foreground">
              {rental.daysRemaining} day{rental.daysRemaining === 1 ? "" : "s"} remaining
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Items</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {rental.rentalItems.map((item) => (
            <div key={item.gearItemId} className="flex flex-col gap-2 border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {item.gearItem.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.pricePerDayAtRental)}/day</span>
              </div>
              {rental.status === "RETURNED" &&
                (item.gearItem.reviews?.length ?? 0) === 0 && (
                  <div className="rounded-md bg-muted p-3">
                    <ReviewForm gearItemId={item.gearItemId} gearName={item.gearItem.name} />
                  </div>
                )}
              {rental.status === "RETURNED" && (item.gearItem.reviews?.length ?? 0) > 0 && (
                <Badge variant="secondary" className="w-fit">
                  Reviewed
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Provider</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p>{rental.provider?.name}</p>
          <p>{rental.provider?.email}</p>
          {rental.provider?.phone && <p>{rental.provider.phone}</p>}
        </CardContent>
      </Card>

      {rental.payment && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
            <p>Transaction: {rental.payment.transactionId}</p>
            <p>Status: {rental.payment.status}</p>
            <p>Amount: {formatCurrency(rental.payment.amount)}</p>
          </CardContent>
        </Card>
      )}

      <Separator />
      <div className="flex items-center justify-between text-lg font-semibold">
        <span>Total</span>
        <span>{formatCurrency(rental.totalAmount)}</span>
      </div>
    </div>
  )
}
