"use client"

import { Package } from "lucide-react"
import Image from "next/image"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAdminDeleteGear, useAdminGear } from "@/hooks/use-admin"
import { formatCurrency, resolveGearImage } from "@/lib/utils"
import type { GearItem } from "@/types/api"

function DeleteGearDialog({ gear }: { gear: GearItem }) {
  const [open, setOpen] = useState(false)
  const deleteGear = useAdminDeleteGear()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>
        Remove
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove {gear.name}?</DialogTitle>
          <DialogDescription>
            This removes the listing platform-wide. Gear with active rentals
            can&apos;t be removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteGear.isPending}
            onClick={() =>
              deleteGear.mutate(gear.id, { onSuccess: () => setOpen(false) })
            }
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminGearPage() {
  const [search, setSearch] = useState("")
  const { data, isLoading } = useAdminGear({ search: search || undefined })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Gear Moderation</h1>
        <p className="text-sm text-muted-foreground">
          Inspect and moderate all gear listings across the platform.
        </p>
      </div>

      <Input
        placeholder="Search gear..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : (data?.gear.length ?? 0) === 0 ? (
        <EmptyState icon={Package} title="No gear found" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price/day</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.gear.map((gear) => (
              <TableRow key={gear.id}>
                <TableCell>
                  <div className="relative size-10 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={resolveGearImage(gear.images?.[0])}
                      alt={gear.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{gear.name}</TableCell>
                <TableCell>{gear.provider?.name}</TableCell>
                <TableCell>{gear.category?.name}</TableCell>
                <TableCell>{formatCurrency(gear.pricePerDay)}</TableCell>
                <TableCell>
                  <Badge variant={gear.availability ? "default" : "secondary"}>
                    {gear.availability ? "Available" : "Unavailable"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DeleteGearDialog gear={gear} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
