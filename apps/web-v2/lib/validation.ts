/**
 * Shared Zod schemas for V2 API route validation.
 */
import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RefreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});
export type RefreshInput = z.infer<typeof RefreshSchema>;

// ─── Payments ────────────────────────────────────────────────────────────────

export const PaymentInitiateSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .max(10_000_000, "Amount exceeds maximum"),
  currency: z
    .string()
    .length(3, "Currency must be ISO 4217 code (e.g. USD)")
    .toUpperCase(),
  description: z.string().max(500).optional(),
  method: z.enum(["card", "bank_transfer", "klarna"]),
  metadata: z.record(z.string()).optional(),
});
export type PaymentInitiateInput = z.infer<typeof PaymentInitiateSchema>;

// ─── Common ───────────────────────────────────────────────────────────────────

export const PaginationSchema = z.object({
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type PaginationInput = z.infer<typeof PaginationSchema>;

// ─── Error helper ─────────────────────────────────────────────────────────────

export function formatZodError(error: z.ZodError): Record<string, string> {
  return Object.fromEntries(
    error.errors.map((e) => [e.path.join("."), e.message])
  );
}
