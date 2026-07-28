"use client"

import { DollarSign, Loader2, Package, ShoppingBag, Timer } from "lucide-react"
import Link from "next/link"

import { StatCard } from "@/components/common/stat-card"
import { StatusBadge } from "@/components/common/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useProviderStats } from "@/hooks/use-provider"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function ProviderDashboardPage() {
  const { data, isLoading } = useProviderStats()

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const overview = data?.overview
  const recentOrders = data?.recentOrders ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Provider Overview</h1>
        <p className="text-sm text-muted-foreground">
          A snapshot of your gear inventory and rental activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total gear" value={overview?.totalGear ?? 0} icon={Package} />
        <StatCard
          label="Total orders"
          value={overview?.totalOrders ?? 0}
          icon={ShoppingBag}
        />
        <StatCard
          label="Pending orders"
          value={overview?.pendingOrders ?? 0}
          icon={Timer}
        />
        <StatCard
          label="Total revenue"
          value={formatCurrency(overview?.totalRevenue ?? 0)}
          icon={DollarSign}
        />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium">Recent orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Placed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <Link
                      href="/dashboard/provider/orders"
                      className="hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{order.customer?.name}</TableCell>
                  <TableCell>
                    {order.rentalItems.map((i) => i.gearItem.name).join(", ")}
                  </TableCell>
                  <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
