import { Badge } from "@/components/ui/badge"
import { cn, rentalStatusClasses, rentalStatusLabel } from "@/lib/utils"
import type { RentalStatus } from "@/types/api"

export function StatusBadge({ status }: { status: RentalStatus }) {
  return (
    <Badge className={cn("border-0", rentalStatusClasses(status))}>
      {rentalStatusLabel(status)}
    </Badge>
  )
}
