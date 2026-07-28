"use client"

import { Loader2 } from "lucide-react"
import { use } from "react"

import { GearForm } from "@/components/provider/gear-form"
import { useGearDetails } from "@/hooks/use-gear"

export default function EditGearPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: gear, isLoading } = useGearDetails(id)

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!gear) {
    return <p className="text-muted-foreground">Gear not found.</p>
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">Edit gear</h1>
      <GearForm
        gearId={gear.id}
        defaultValues={{
          name: gear.name,
          description: gear.description,
          pricePerDay: gear.pricePerDay,
          categoryId: gear.categoryId,
          brand: gear.brand ?? "",
          condition: gear.condition,
          quantity: gear.quantity,
          images: gear.images,
          availability: gear.availability,
        }}
      />
    </div>
  )
}
