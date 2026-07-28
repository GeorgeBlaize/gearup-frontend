"use client"

import { CreditCard, PackageOpen, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { EmptyState } from "@/components/common/empty-state"
import { StatusBadge } from "@/components/common/status-badge"
import { TableSkeleton } from "@/components/common/table-skeleton"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePaymentHistory } from "@/hooks/use-payments"
import { useCancelRental, useMyRentals } from "@/hooks/use-rentals"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import type { RentalOrder } from "@/types/api"

function CancelOrderDialog({ order }: { order: RentalOrder }) {
  const [open, setOpen] = useState(false)
  const cancelRental = useCancelRental()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Cancel
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel order {order.orderNumber}?</DialogTitle>
          <DialogDescription>
            This can&apos;t be undone. You&apos;ll need to place a new order if you
            change your mind.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Keep order
          </Button>
          <Button
            variant="destructive"
            disabled={cancelRental.isPending}
            onClick={() =>
              cancelRental.mutate(
                { id: order.id },
                { onSuccess: () => setOpen(false) }
              )
            }
          >
            Cancel order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function OrdersTable() {
  const { data, isLoading } = useMyRentals()

  if (isLoading) return <TableSkeleton rows={4} cols={5} />

  const rentals = data?.rentals ?? []

  if (rentals.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No orders yet"
        description="Browse gear and place your first rental order."
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Gear</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rentals.map((rental) => (
          <TableRow key={rental.id}>
            <TableCell className="font-medium">
              <Link href={`/dashboard/customer/orders/${rental.id}`} className="hover:underline">
                {rental.orderNumber}
              </Link>
            </TableCell>
            <TableCell>
              {rental.rentalItems
                .map((item) => `${item.gearItem.name} ×${item.quantity}`)
                .join(", ")}
            </TableCell>
            <TableCell>
              {formatDate(rental.startDate)} – {formatDate(rental.endDate)}
            </TableCell>
            <TableCell>{formatCurrency(rental.totalAmount)}</TableCell>
            <TableCell>
              <StatusBadge status={rental.status} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                {rental.status === "CONFIRMED" && (
                  <Link
                    href={`/dashboard/customer/orders/${rental.id}/pay`}
                    className={cn(buttonVariants({ size: "sm" }))}
                  >
                    Pay Now
                  </Link>
                )}
                {rental.status === "RETURNED" && rental.canReview && (
                  <Link
                    href={`/dashboard/customer/orders/${rental.id}`}
                    className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                  >
                    Leave Review
                  </Link>
                )}
                {["PLACED", "CONFIRMED"].includes(rental.status) && (
                  <CancelOrderDialog order={rental} />
                )}
                <Link
                  href={`/dashboard/customer/orders/${rental.id}`}
                  className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
                >
                  View
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function PaymentsTable() {
  const { data, isLoading } = usePaymentHistory()

  if (isLoading) return <TableSkeleton rows={4} cols={4} />

  const payments = data?.payments ?? []

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No payments yet"
        description="Your payment history will show up here after checkout."
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Paid</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-mono text-xs">
              {payment.transactionId}
            </TableCell>
            <TableCell>{formatCurrency(payment.amount)}</TableCell>
            <TableCell>{payment.provider}</TableCell>
            <TableCell>
              <span className="text-sm">{payment.status}</span>
            </TableCell>
            <TableCell>
              {payment.paidAt ? formatDate(payment.paidAt) : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function CustomerDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">My Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Track your rentals and payment history.
        </p>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">
            <PackageOpen className="size-4" /> Orders
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="size-4" /> Payments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-4">
          <OrdersTable />
        </TabsContent>
        <TabsContent value="payments" className="mt-4">
          <PaymentsTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
