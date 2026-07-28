import { z } from "zod"

// Mirrors gearup-backend/src/validators/gear.validator.ts.
export const gearSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be between 3 and 100 characters")
    .max(100, "Name must be between 3 and 100 characters"),
  description: z
    .string()
    .min(10, "Description must be between 10 and 1000 characters")
    .max(1000, "Description must be between 10 and 1000 characters"),
  pricePerDay: z
    .number({ message: "Price per day must be a positive number" })
    .positive("Price per day must be a positive number"),
  categoryId: z.string().min(1, "Category is required"),
  brand: z
    .string()
    .max(50, "Brand must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor"], {
    message: "Condition is required",
  }),
  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity cannot exceed 100"),
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .max(10, "Maximum 10 images allowed"),
  availability: z.boolean().optional(),
})

export type GearFormValues = z.infer<typeof gearSchema>
