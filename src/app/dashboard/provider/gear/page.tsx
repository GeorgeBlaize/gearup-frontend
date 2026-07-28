"use client"

import { Package, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { EmptyState } from "@/components/common/empty-state"
import { TableSkeleton } from "@/components/common/table-skeleton"
import { Badge } from "@/components/ui/badge"
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
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDeleteGear, useProviderGear, useUpdateGear } from "@/hooks/use-provider"
import { cn, formatCurrency, resolveGearImage } from "@/lib/utils"
import type { GearItem } from "@/types/api"

function DeleteGearDialog({ gear }: { gear: GearItem }) {
  const [open, setOpen] = useState(false)
  const deleteGear = useDeleteGear()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {gear.name}?</DialogTitle>
          <DialogDescription>
            This can&apos;t be undone. Gear with active rentals can&apos;t be
            deleted.
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
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ProviderGearPage() {
  const { data, isLoading } = useProviderGear()
  const updateGear = useUpdateGear()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <p className="text-sm text-muted-foreground">
            Manage the gear you have listed for rent.
          </p>
        </div>
        <Link
          href="/dashboard/provider/gear/new"
          className={cn(buttonVariants())}
        >
          <Plus className="size-4" /> Add gear
        </Link>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={6} />
      ) : (data?.gear.length ?? 0) === 0 ? (
        <EmptyState
          icon={Package}
          title="No gear listed yet"
          description="Add your first item to start renting it out."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price/day</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Available</TableHead>
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
                <TableCell className="font-medium">
                  {gear.name}
                  {(gear._count?.rentalItems ?? 0) > 0 && (
                    <Badge variant="secondary" className="ml-2 text-[10px]">
                      {gear._count?.rentalItems} active
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{gear.category?.name}</TableCell>
                <TableCell>{formatCurrency(gear.pricePerDay)}</TableCell>
                <TableCell>{gear.quantity}</TableCell>
                <TableCell>
                  <Switch
                    checked={gear.availability}
                    onCheckedChange={(checked) =>
                      updateGear.mutate({ id: gear.id, payload: { availability: checked } })
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/dashboard/provider/gear/${gear.id}/edit`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      Edit
                    </Link>
                    <DeleteGearDialog gear={gear} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
