import { z } from "zod"

// Mirrors gearup-backend/src/validators/auth.validator.ts exactly.
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "Password must contain at least one letter and one number")

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

// Public registration intentionally excludes ADMIN — see API_INTEGRATION.md.
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be between 2 and 50 characters")
    .max(50, "Name must be between 2 and 50 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: passwordSchema,
  role: z.enum(["CUSTOMER", "PROVIDER"]),
  phone: z.string().optional().or(z.literal("")),
  address: z
    .string()
    .max(200, "Address must not exceed 200 characters")
    .optional()
    .or(z.literal("")),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
