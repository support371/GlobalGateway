/**
 * POST /api/auth/refresh
 *
 * Rotates refresh token and issues a new access token.
 */
import { type NextRequest } from "next/server";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieOptions,
} from "@v2/lib/jwt";
import { ok, unauthorized, serverError } from "@v2/lib/response";

export const runtime = "nodejs";

// ─── Adapter stub — replace with Prisma refresh token lookup ─────────────────
async function getRefreshTokenRecord(
  _jti: string
): Promise<{ userId: string; email: string; role: "client" | "admin" } | null> {
  // TODO: prisma.refreshToken.findUnique({ where: { jti }, include: { user: true } })
  return null;
}

async function revokeRefreshToken(_jti: string): Promise<void> {
  // TODO: prisma.refreshToken.delete({ where: { jti } })
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(REFRESH_COOKIE)?.value;
    if (!token) return unauthorized("No refresh token provided");

    let payload;
    try {
      payload = await verifyRefreshToken(token);
    } catch {
      return unauthorized("Refresh token invalid or expired");
    }

    const record = await getRefreshTokenRecord(payload.jti!);
    if (!record) return unauthorized("Refresh token has been revoked");

    // Rotate: revoke old, issue new
    await revokeRefreshToken(payload.jti!);
    const newJti = crypto.randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({
        sub: record.userId,
        email: record.email,
        role: record.role,
      }),
      signRefreshToken({ sub: record.userId, jti: newJti }),
    ]);

    const response = ok({ refreshed: true });
    response.cookies.set(ACCESS_COOKIE, accessToken, cookieOptions(15 * 60));
    response.cookies.set(REFRESH_COOKIE, refreshToken, cookieOptions(7 * 24 * 60 * 60));
    return response;
  } catch (err) {
    return serverError("Token refresh failed", err);
  }
}
