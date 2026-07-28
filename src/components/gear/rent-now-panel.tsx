"use client"

import { AlertCircle, CalendarIcon, CheckCircle2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useCheckAvailability } from "@/hooks/use-rentals"
import { useCreateRental } from "@/hooks/use-rentals"
import { cn, formatCurrency, formatDate } from "@/lib/utils"

function toIsoDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString()
}

export function RentNowPanel({
  gearId,
  pricePerDay,
  quantity: totalQuantity,
  isAvailable,
}: {
  gearId: string
  pricePerDay: number
  quantity: number
  isAvailable: boolean
}) {
  const router = useRouter()
  const { isAuthenticated, user, isHydrated } = useAuth()
  const [range, setRange] = useState<DateRange | undefined>()
  const [quantity, setQuantity] = useState("1")
  const [open, setOpen] = useState(false)

  const startDate = range?.from ? toIsoDate(range.from) : undefined
  const endDate = range?.to ? toIsoDate(range.to) : undefined
  const days =
    range?.from && range?.to
      ? Math.max(
          1,
          Math.ceil(
            (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)
          )
        )
      : 0

  const { data: availabilityData, isFetching: isCheckingAvailability } =
    useCheckAvailability(gearId, startDate, endDate)

  const createRental = useCreateRental()

  const subtotal = useMemo(
    () => days * Number(quantity || 1) * pricePerDay,
    [days, quantity, pricePerDay]
  )

  const canRent =
    isAvailable &&
    !!range?.from &&
    !!range?.to &&
    (!availabilityData || availabilityData.isAvailable)

  function handleRentNow() {
    if (!isHydrated) return

    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/gear/${gearId}`)
      return
    }

    if (user?.role !== "CUSTOMER") {
      return
    }

    if (!startDate || !endDate) return

    createRental.mutate(
      {
        gearItems: [{ gearItemId: gearId, quantity: Number(quantity) }],
        startDate,
        endDate,
      },
      {
        onSuccess: ({ rental }) => {
          router.push(`/dashboard/customer/orders/${rental.id}/pay`)
        },
      }
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-5">
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-semibold">{formatCurrency(pricePerDay)}</p>
        <span className="text-sm text-muted-foreground">/ day</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Rental dates</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-start font-normal"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {range?.from && range?.to
              ? `${formatDate(range.from)} - ${formatDate(range.to)}`
              : "Select rental dates"}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <Calendar
              mode="range"
              numberOfMonths={1}
              selected={range}
              onSelect={setRange}
              disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
              className="w-fit"
            />
          </PopoverContent>
        </Popover>
      </div>

      {totalQuantity > 1 && (
        <div className="flex flex-col gap-1.5">
          <Label>Quantity</Label>
          <Select value={quantity} onValueChange={(value) => setQuantity(value ?? "1")}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: Math.min(totalQuantity, 10) }, (_, i) => i + 1).map(
                (q) => (
                  <SelectItem key={q} value={String(q)}>
                    {q}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {range?.from && range?.to && (
        <>
          {isCheckingAvailability ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" /> Checking availability…
            </p>
          ) : availabilityData?.isAvailable === false ? (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                Not available for these dates. Try a different range.
              </AlertDescription>
            </Alert>
          ) : availabilityData?.isAvailable ? (
            <Alert>
              <CheckCircle2 className="size-4" />
              <AlertDescription>Available for your selected dates.</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-1 rounded-md bg-muted p-3 text-sm">
            <div className="flex justify-between">
              <span>
                {formatCurrency(pricePerDay)} x {days} day{days > 1 ? "s" : ""} x{" "}
                {quantity}
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t pt-1 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
        </>
      )}

      {isHydrated && isAuthenticated && user?.role !== "CUSTOMER" && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            Only customer accounts can rent gear. You&apos;re signed in as{" "}
            {user?.role.toLowerCase()}.
          </AlertDescription>
        </Alert>
      )}

      <Button
        size="lg"
        disabled={!canRent || createRental.isPending || (isAuthenticated && user?.role !== "CUSTOMER")}
        onClick={handleRentNow}
      >
        {createRental.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Placing order…
          </>
        ) : !isAvailable ? (
          "Unavailable"
        ) : !isAuthenticated ? (
          "Log in to rent"
        ) : (
          "Rent Now"
        )}
      </Button>
    </div>
  )
}
