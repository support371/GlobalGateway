/**
 * POST /api/auth/login
 *
 * Validates credentials, issues access + refresh tokens.
 * Adapter interface: replace `authenticateUser` stub with real DB check.
 */
import { type NextRequest } from "next/server";
import { signAccessToken, signRefreshToken, ACCESS_COOKIE, REFRESH_COOKIE, cookieOptions } from "@v2/lib/jwt";
import { checkRateLimit } from "@v2/lib/ratelimit";
import { ok, badRequest, unauthorized, tooManyRequests, serverError } from "@v2/lib/response";
import { LoginSchema, formatZodError } from "@v2/lib/validation";

export const runtime = "nodejs";

// ─── Adapter stub — replace with Prisma query at Phase 5 cutover ─────────────
async function authenticateUser(
  email: string,
  _password: string
): Promise<{ id: string; email: string; role: "client" | "admin" } | null> {
  // TODO: Replace with:
  //   const user = await prisma.client.findUnique({ where: { email } });
  //   const valid = await bcrypt.compare(password, user.passwordHash);
  //   return valid ? user : null;
  void email;
  return null; // always fails until real auth is wired
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = await checkRateLimit(ip, "auth");
    if (!rl.success) return tooManyRequests(rl.reset);

    // Parse + validate body
    const body: unknown = await req.json().catch(() => null);
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Validation failed", formatZodError(parsed.error));
    }

    const { email, password } = parsed.data;
    const user = await authenticateUser(email, password);
    if (!user) return unauthorized("Invalid email or password");

    // Issue tokens
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ sub: user.id, email: user.email, role: user.role }),
      signRefreshToken({ sub: user.id, jti: crypto.randomUUID() }),
    ]);

    const response = ok({ email: user.email, role: user.role });
    response.cookies.set(ACCESS_COOKIE, accessToken, cookieOptions(15 * 60));
    response.cookies.set(REFRESH_COOKIE, refreshToken, cookieOptions(7 * 24 * 60 * 60));
    return response;
  } catch (err) {
    return serverError("Login failed", err);
  }
}
