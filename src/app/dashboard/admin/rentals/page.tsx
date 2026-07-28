"use client"

import { ShoppingBag } from "lucide-react"
import { useState } from "react"

import { EmptyState } from "@/components/common/empty-state"
import { StatusBadge } from "@/components/common/status-badge"
import { TableSkeleton } from "@/components/common/table-skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAdminRentals, useAdminUpdateRentalStatus } from "@/hooks/use-admin"
import { formatCurrency, formatDate, rentalStatusLabel } from "@/lib/utils"
import type { RentalStatus } from "@/types/api"

const ALL_STATUSES: RentalStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PAID",
  "PICKED_UP",
  "RETURNED",
  "CANCELLED",
]
const statusItems = Object.fromEntries(
  ALL_STATUSES.map((s) => [s, rentalStatusLabel(s)])
)
const filterItems = { all: "All statuses", ...statusItems }

export default function AdminRentalsPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const { data, isLoading } = useAdminRentals({
    status: statusFilter === "all" ? undefined : (statusFilter as RentalStatus),
  })
  const updateStatus = useAdminUpdateRentalStatus()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Rental Moderation</h1>
        <p className="text-sm text-muted-foreground">
          Inspect and override rental order statuses platform-wide.
        </p>
      </div>

      <Select
        value={statusFilter}
        items={filterItems}
        onValueChange={(v) => setStatusFilter(v ?? "all")}
      >
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(filterItems).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : (data?.rentals.length ?? 0) === 0 ? (
        <EmptyState icon={ShoppingBag} title="No rentals found" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Override</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.rentals.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell className="font-medium">
                  {rental.orderNumber}
                  <p className="text-xs font-normal text-muted-foreground">
                    {formatDate(rental.createdAt)}
                  </p>
                </TableCell>
                <TableCell>{rental.customer?.name}</TableCell>
                <TableCell>{rental.provider?.name}</TableCell>
                <TableCell>{formatCurrency(rental.totalAmount)}</TableCell>
                <TableCell>
                  <StatusBadge status={rental.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Select
                    value={rental.status}
                    items={statusItems}
                    onValueChange={(value) =>
                      value &&
                      value !== rental.status &&
                      updateStatus.mutate({
                        id: rental.id,
                        status: value as RentalStatus,
                      })
                    }
                  >
                    <SelectTrigger className="ml-auto w-40" size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {rentalStatusLabel(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
