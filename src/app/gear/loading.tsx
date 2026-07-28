import { GearGridSkeleton } from "@/components/common/gear-grid-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <Skeleton className="h-96 rounded-lg" />
        <div className="flex flex-col gap-6">
          <Skeleton className="h-4 w-24" />
          <GearGridSkeleton count={9} />
        </div>
      </div>
    </div>
  )
}
