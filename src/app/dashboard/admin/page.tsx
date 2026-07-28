"use client"

import { DollarSign, Loader2, Package, ShoppingBag, Users } from "lucide-react"

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
import { useAdminDashboardStats } from "@/hooks/use-admin"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminDashboardStats()

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const overview = data?.overview
  const recentRentals = data?.recentRentals ?? []
  const statusBreakdown = data?.statusBreakdown ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Platform Overview</h1>
        <p className="text-sm text-muted-foreground">
          Global stats across all users, gear, and rentals.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={overview?.totalUsers ?? 0} icon={Users} />
        <StatCard
          label="Providers"
          value={overview?.totalProviders ?? 0}
          icon={Users}
        />
        <StatCard
          label="Gear listings"
          value={overview?.totalGearItems ?? 0}
          icon={Package}
        />
        <StatCard
          label="Total rentals"
          value={overview?.totalRentals ?? 0}
          icon={ShoppingBag}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Revenue (last 30 days)"
          value={formatCurrency(overview?.monthlyRevenue ?? 0)}
          icon={DollarSign}
        />
        <StatCard
          label="Transactions (last 30 days)"
          value={overview?.monthlyTransactions ?? 0}
          icon={DollarSign}
        />
      </div>

      {statusBreakdown.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-medium">Rentals by status</h2>
          <div className="flex flex-wrap gap-3">
            {statusBreakdown.map((row) => (
              <div
                key={row.status}
                className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
              >
                <StatusBadge status={row.status} />
                <span className="font-medium">{row._count.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-lg font-medium">Recent rentals</h2>
        {recentRentals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No rentals yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Placed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">{rental.orderNumber}</TableCell>
                  <TableCell>{rental.customer?.name}</TableCell>
                  <TableCell>{rental.provider?.name}</TableCell>
                  <TableCell>{formatCurrency(rental.totalAmount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={rental.status} />
                  </TableCell>
                  <TableCell>{formatDate(rental.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
