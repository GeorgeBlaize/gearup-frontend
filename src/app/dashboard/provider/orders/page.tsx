"use client"

import { ClipboardList } from "lucide-react"

import { EmptyState } from "@/components/common/empty-state"
import { StatusBadge } from "@/components/common/status-badge"
import { TableSkeleton } from "@/components/common/table-skeleton"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useProviderOrders, useUpdateOrderStatus } from "@/hooks/use-provider"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { RentalOrder, RentalStatus } from "@/types/api"

const NEXT_STATUS: Partial<
  Record<RentalStatus, { status: "CONFIRMED" | "PICKED_UP" | "RETURNED"; label: string }>
> = {
  PLACED: { status: "CONFIRMED", label: "Confirm" },
  PAID: { status: "PICKED_UP", label: "Mark Picked Up" },
  PICKED_UP: { status: "RETURNED", label: "Mark Returned" },
}

function OrderActions({ order }: { order: RentalOrder }) {
  const updateStatus = useUpdateOrderStatus()
  const next = NEXT_STATUS[order.status]

  return (
    <div className="flex justify-end gap-2">
      {next && (
        <Button
          size="sm"
          disabled={updateStatus.isPending}
          onClick={() =>
            updateStatus.mutate({ id: order.id, status: next.status })
          }
        >
          {next.label}
        </Button>
      )}
      {["PLACED", "CONFIRMED"].includes(order.status) && (
        <Button
          size="sm"
          variant="outline"
          disabled={updateStatus.isPending}
          onClick={() =>
            updateStatus.mutate({ id: order.id, status: "CANCELLED" })
          }
        >
          Cancel
        </Button>
      )}
    </div>
  )
}

export default function ProviderOrdersPage() {
  const { data, isLoading } = useProviderOrders()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage incoming rental orders for your gear.
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={6} />
      ) : (data?.orders.length ?? 0) === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No incoming orders"
          description="Orders placed for your gear will show up here."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{order.customer?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {order.customer?.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {order.rentalItems
                    .map((i) => `${i.gearItem.name} ×${i.quantity}`)
                    .join(", ")}
                </TableCell>
                <TableCell>
                  {formatDate(order.startDate)} – {formatDate(order.endDate)}
                </TableCell>
                <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  <OrderActions order={order} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
