"use client"

import { Users as UsersIcon } from "lucide-react"
import { useState } from "react"

import { EmptyState } from "@/components/common/empty-state"
import { TableSkeleton } from "@/components/common/table-skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
import { useAdminUsers, useUpdateUserStatus } from "@/hooks/use-admin"
import { formatDate } from "@/lib/utils"
import type { User, UserRole } from "@/types/api"

const ROLE_ITEMS = { all: "All roles", CUSTOMER: "Customer", PROVIDER: "Provider", ADMIN: "Admin" }
const STATUS_ITEMS = { all: "All statuses", active: "Active", suspended: "Suspended" }

function SuspendDialog({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const updateStatus = useUpdateUserStatus()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Suspend
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suspend {user.name}?</DialogTitle>
          <DialogDescription>
            They won&apos;t be able to log in until reactivated.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={updateStatus.isPending}
            onClick={() =>
              updateStatus.mutate(
                { id: user.id, isActive: false },
                { onSuccess: () => setOpen(false) }
              )
            }
          >
            Suspend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")
  const [status, setStatus] = useState("all")

  const { data, isLoading } = useAdminUsers({
    search: search || undefined,
    role: role === "all" ? undefined : (role as UserRole),
    isActive: status === "all" ? undefined : status === "active",
  })
  const updateStatus = useUpdateUserStatus()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Search, filter, and manage platform users.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={role} items={ROLE_ITEMS} onValueChange={(v) => setRole(v ?? "all")}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ROLE_ITEMS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} items={STATUS_ITEMS} onValueChange={(v) => setStatus(v ?? "all")}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_ITEMS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : (data?.users.length ?? 0) === 0 ? (
        <EmptyState icon={UsersIcon} title="No users found" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? "Active" : "Suspended"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  {user.isActive ? (
                    <SuspendDialog user={user} />
                  ) : (
                    <Button
                      size="sm"
                      disabled={updateStatus.isPending}
                      onClick={() =>
                        updateStatus.mutate({ id: user.id, isActive: true })
                      }
                    >
                      Activate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
