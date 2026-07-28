import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { RentalStatus } from "@/types/api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Builds a query string from an object, skipping empty/undefined values. */
export function buildQueryString(params: object) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(
    params as Record<string, string | number | boolean | undefined | null>
  )) {
    if (value === undefined || value === null || value === "") continue
    search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date))
}

const RENTAL_STATUS_LABEL: Record<RentalStatus, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PAID: "Paid",
  PICKED_UP: "Picked up",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
}

// Matches the assignment's suggested badge colors:
// PLACED amber, CONFIRMED blue, PAID purple, PICKED_UP green, RETURNED gray, CANCELLED red.
const RENTAL_STATUS_CLASSES: Record<RentalStatus, string> = {
  PLACED: "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300",
  CONFIRMED: "bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-300",
  PAID: "bg-purple-100 text-purple-900 dark:bg-purple-500/20 dark:text-purple-300",
  PICKED_UP:
    "bg-green-100 text-green-900 dark:bg-green-500/20 dark:text-green-300",
  RETURNED: "bg-gray-100 text-gray-900 dark:bg-gray-500/20 dark:text-gray-300",
  CANCELLED: "bg-red-100 text-red-900 dark:bg-red-500/20 dark:text-red-300",
}

export function rentalStatusLabel(status: RentalStatus) {
  return RENTAL_STATUS_LABEL[status] ?? status
}

export function rentalStatusClasses(status: RentalStatus) {
  return RENTAL_STATUS_CLASSES[status] ?? "bg-muted text-muted-foreground"
}

/** Gear image URLs from providers/seed data aren't guaranteed to be
 * resolvable (seed data even ships bare filenames). Fall back to a local
 * placeholder for anything that isn't an absolute http(s) URL. */
export function resolveGearImage(src: string | undefined | null) {
  if (src && /^https?:\/\//i.test(src)) return src
  return "/gear-placeholder.svg"
}
