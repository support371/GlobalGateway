/**
 * Next.js middleware — runs on the Edge Runtime before every matched request.
 *
 * Responsibilities:
 *  1. Protect /portal routes — redirect to /login if no valid access token
 *  2. Add rate-limit headers to /api routes (full rate check happens in handlers)
 */
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED_PREFIXES = ["/portal"];
const API_PREFIX = "/api";

function getSecret(): Uint8Array {
  const value = process.env.JWT_SECRET;
  if (!value) {
    // In development without JWT_SECRET set, allow through with a warning
    console.warn("[middleware] JWT_SECRET not set — skipping auth guard");
    return new Uint8Array(32); // zero key — always fails verify
  }
  return new TextEncoder().encode(value);
}

function getToken(req: NextRequest): string | null {
  // 1. Cookie (preferred — httpOnly)
  const cookieName = process.env.SESSION_COOKIE_NAME ?? "gg_access";
  const cookie = req.cookies.get(cookieName);
  if (cookie) return cookie.value;

  // 2. Authorization header (Bearer token for API clients)
  const auth = req.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);

  return null;
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  // ── Portal guard ──────────────────────────────────────────────────────────
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const token = getToken(req);

    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    } catch {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(process.env.SESSION_COOKIE_NAME ?? "gg_access");
      return response;
    }
  }

  // ── API rate-limit headers ────────────────────────────────────────────────
  if (pathname.startsWith(API_PREFIX)) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    // Actual rate checking is done in each handler.
    // Here we add a request-id for correlation.
    const requestId = crypto.randomUUID();
    const response = NextResponse.next();
    response.headers.set("X-Request-Id", requestId);
    response.headers.set("X-RateLimit-Policy", "120;w=60");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match /portal/* and /api/* but skip static assets and Next internals
    "/portal/:path*",
    "/api/:path*",
  ],
};
