/**
 * GET /api/payments/history
 *
 * Returns paginated transaction history for the authenticated user.
 */
import { type NextRequest } from "next/server";
import { verifyAccessToken, ACCESS_COOKIE } from "@v2/lib/jwt";
import { checkRateLimit } from "@v2/lib/ratelimit";
import { ok, unauthorized, tooManyRequests, serverError } from "@v2/lib/response";
import { PaginationSchema } from "@v2/lib/validation";

export const runtime = "nodejs";

// ─── Stub data — replace with prisma.transaction.findMany ────────────────────

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  description: string | null;
  createdAt: string;
}

async function getTransactionHistory(
  _userId: string,
  _page: number,
  _limit: number
): Promise<{ items: Transaction[]; total: number }> {
  // TODO: prisma.transaction.findMany({
  //   where: { clientId: _userId },
  //   orderBy: { createdAt: "desc" },
  //   skip: (_page - 1) * _limit,
  //   take: _limit,
  // })
  return { items: [], total: 0 };
}

export async function GET(req: NextRequest) {
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
    const rl = await checkRateLimit(userId, "api");
    if (!rl.success) return tooManyRequests(rl.reset);

    // Pagination
    const { searchParams } = req.nextUrl;
    const pagination = PaginationSchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });
    const { page, limit } = pagination.success
      ? pagination.data
      : { page: 1, limit: 20 };

    const result = await getTransactionHistory(userId, page, limit);

    return ok({
      ...result,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    });
  } catch (err) {
    return serverError("Failed to fetch payment history", err);
  }
}
