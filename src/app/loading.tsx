import { GearGridSkeleton } from "@/components/common/gear-grid-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <Skeleton className="mb-6 h-8 w-48" />
      <GearGridSkeleton />
    </div>
  )
}
