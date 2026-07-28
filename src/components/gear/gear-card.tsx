import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, resolveGearImage } from "@/lib/utils"
import type { GearItem } from "@/types/api"

export function GearCard({ gear }: { gear: GearItem }) {
  const isAvailable = gear.available ?? (gear.availability && gear.quantity > 0)

  return (
    <Link href={`/gear/${gear.id}`}>
      <Card className="group h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
          <Image
            src={resolveGearImage(gear.images?.[0])}
            alt={gear.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
          <Badge
            className="absolute top-2 right-2"
            variant={isAvailable ? "default" : "secondary"}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
        <CardContent className="flex flex-col gap-1.5 pb-4">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline" className="text-xs">
              {gear.category?.name}
            </Badge>
            {typeof gear.averageRating === "number" && gear.averageRating > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {gear.averageRating.toFixed(1)}
                {gear.reviewCount ? ` (${gear.reviewCount})` : ""}
              </span>
            )}
          </div>
          <h3 className="line-clamp-1 font-medium">{gear.name}</h3>
          {gear.brand && (
            <p className="text-xs text-muted-foreground">{gear.brand}</p>
          )}
          <p className="mt-1 text-sm font-semibold">
            {formatCurrency(gear.pricePerDay)}{" "}
            <span className="font-normal text-muted-foreground">/ day</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
