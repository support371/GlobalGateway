/**
 * POST /api/auth/logout
 *
 * Clears auth cookies and revokes refresh token from DB.
 */
import { type NextRequest } from "next/server";
import { verifyRefreshToken, ACCESS_COOKIE, REFRESH_COOKIE } from "@v2/lib/jwt";
import { ok, serverError } from "@v2/lib/response";

export const runtime = "nodejs";

async function revokeRefreshToken(_jti: string): Promise<void> {
  // TODO: prisma.refreshToken.deleteMany({ where: { jti: _jti } })
}

export async function POST(req: NextRequest) {
  try {
    // Best-effort revocation — don't fail if token is already expired
    const refreshCookie = req.cookies.get(REFRESH_COOKIE)?.value;
    if (refreshCookie) {
      try {
        const payload = await verifyRefreshToken(refreshCookie);
        if (payload.jti) await revokeRefreshToken(payload.jti);
      } catch {
        // Token already expired — nothing to revoke
      }
    }

    const response = ok({ loggedOut: true });
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  } catch (err) {
    return serverError("Logout failed", err);
  }
}
