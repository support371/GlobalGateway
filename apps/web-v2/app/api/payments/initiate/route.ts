/**
 * POST /api/payments/initiate
 *
 * Initiates a payment transaction.
 * STUB: Replace adapter with real Stripe/Klarna SDK calls.
 */
import { type NextRequest } from "next/server";
import { verifyAccessToken, ACCESS_COOKIE } from "@v2/lib/jwt";
import { checkRateLimit } from "@v2/lib/ratelimit";
import {
  created,
  badRequest,
  unauthorized,
  tooManyRequests,
  serverError,
} from "@v2/lib/response";
import { PaymentInitiateSchema, formatZodError } from "@v2/lib/validation";

export const runtime = "nodejs";

// ─── Payment adapter interface ────────────────────────────────────────────────

interface PaymentResult {
  transactionId: string;
  status: "pending" | "processing" | "completed" | "failed";
  clientSecret?: string; // Stripe PaymentIntent client_secret
  redirectUrl?: string;  // Klarna redirect
}

async function initiatePayment(
  _userId: string,
  _input: {
    amount: number;
    currency: string;
    method: string;
    description?: string;
    metadata?: Record<string, string>;
  }
): Promise<PaymentResult> {
  // TODO: Switch on method:
  //   "card"          → stripe.paymentIntents.create(...)
  //   "bank_transfer" → stripe.paymentIntents.create({ payment_method_types: ["us_bank_account"] })
  //   "klarna"        → stripe.paymentIntents.create({ payment_method_types: ["klarna"] })
  // Then persist to prisma.transaction
  return {
    transactionId: `txn_stub_${crypto.randomUUID()}`,
    status: "pending",
  };
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate
    const token = req.cookies.get(ACCESS_COOKIE)?.value
      ?? req.headers.get("Authorization")?.slice(7);
    if (!token) return unauthorized();

    let userId: string;
    try {
      const payload = await verifyAccessToken(token);
      userId = payload.sub;
    } catch {
      return unauthorized("Invalid or expired token");
    }

    // Rate limit
    const rl = await checkRateLimit(userId, "strict");
    if (!rl.success) return tooManyRequests(rl.reset);

    // Validate body
    const body: unknown = await req.json().catch(() => null);
    const parsed = PaymentInitiateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Validation failed", formatZodError(parsed.error));
    }

    const result = await initiatePayment(userId, parsed.data);
    return created(result);
  } catch (err) {
    return serverError("Payment initiation failed", err);
  }
}
