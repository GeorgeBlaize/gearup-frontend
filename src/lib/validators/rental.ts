import { z } from "zod"

// Mirrors gearup-backend/src/validators/rental.validator.ts `create` rules.
export const rentalDatesSchema = z
  .object({
    startDate: z.date({ message: "Start date is required" }),
    endDate: z.date({ message: "End date is required" }),
  })
  .refine((data) => data.startDate >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "Start date cannot be in the past",
    path: ["startDate"],
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine(
    (data) =>
      Math.ceil(
        (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) <= 30,
    { message: "Maximum rental period is 30 days", path: ["endDate"] }
  )

export type RentalDatesValues = z.infer<typeof rentalDatesSchema>

export const orderStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "PICKED_UP", "RETURNED", "CANCELLED"]),
  note: z
    .string()
    .max(500, "Note must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
})

export type OrderStatusValues = z.infer<typeof orderStatusSchema>

export const adminRentalStatusSchema = z.object({
  status: z.enum([
    "PLACED",
    "CONFIRMED",
    "PAID",
    "PICKED_UP",
    "RETURNED",
    "CANCELLED",
  ]),
  reason: z
    .string()
    .max(200, "Reason must not exceed 200 characters")
    .optional()
    .or(z.literal("")),
})

export type AdminRentalStatusValues = z.infer<typeof adminRentalStatusSchema>
