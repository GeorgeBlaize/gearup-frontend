import { PackageSearch } from "lucide-react"

import { GearCard } from "@/components/gear/gear-card"
import type { GearItem } from "@/types/api"

export function GearGrid({ gear }: { gear: GearItem[] }) {
  if (gear.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        <PackageSearch className="size-8" />
        <p className="font-medium">No gear found</p>
        <p className="text-sm">Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {gear.map((item) => (
        <GearCard key={item.id} gear={item} />
      ))}
    </div>
  )
}
