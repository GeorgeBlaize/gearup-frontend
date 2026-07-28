import { MapPin, Package, ShieldCheck, Star, Tag } from "lucide-react"
import { notFound } from "next/navigation"

import { GearGallery } from "@/components/gear/gear-gallery"
import { GearReviews } from "@/components/gear/gear-reviews"
import { RentNowPanel } from "@/components/gear/rent-now-panel"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ApiError } from "@/lib/api/client"
import { gearApi } from "@/lib/api/gear"

export default async function GearDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const gear = await gearApi.getById(id).catch((error) => {
    if (error instanceof ApiError && error.status === 404) {
      notFound()
    }
    throw error
  })

  const isAvailable = gear.available ?? (gear.availability && gear.quantity > 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <GearGallery images={gear.images} name={gear.name} />

        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline">{gear.category?.name}</Badge>
              <Badge variant={isAvailable ? "default" : "secondary"}>
                {isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">{gear.name}</h1>
            {gear.brand && (
              <p className="mt-1 text-muted-foreground">{gear.brand}</p>
            )}
            {typeof gear.averageRating === "number" && gear.averageRating > 0 && (
              <p className="mt-1 flex items-center gap-1 text-sm">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {gear.averageRating.toFixed(1)} · {gear.reviews?.length ?? 0} reviews
              </p>
            )}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {gear.description}
          </p>

          <Separator />

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-muted-foreground" />
              Condition: {gear.condition}
            </div>
            <div className="flex items-center gap-2">
              <Package className="size-4 text-muted-foreground" />
              {gear.quantity} in stock
            </div>
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-muted-foreground" />
              {gear.category?.name}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              {gear.provider?.address ?? gear.provider?.name}
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium">Listed by</p>
            <p className="text-sm text-muted-foreground">
              {gear.provider?.name} · {gear.provider?.email}
            </p>
          </div>

          <RentNowPanel
            gearId={gear.id}
            pricePerDay={gear.pricePerDay}
            quantity={gear.quantity}
            isAvailable={isAvailable}
          />
        </div>
      </div>

      <Separator className="my-10" />

      <div className="max-w-2xl">
        <h2 className="mb-4 text-xl font-semibold">Reviews</h2>
        <GearReviews reviews={gear.reviews ?? []} />
      </div>
    </div>
  )
}
