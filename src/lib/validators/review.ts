import { z } from "zod"

// Mirrors gearup-backend/src/validators/review.validator.ts `create` rules.
export const reviewSchema = z.object({
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .max(500, "Comment must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>
