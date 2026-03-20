/**
 * JWT helpers — server-only (never import in client components)
 * Uses jose for edge-compatible JWT operations.
 */
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export interface AccessTokenPayload extends JWTPayload {
  sub: string;       // user id
  email: string;
  role: "client" | "admin";
}

export interface RefreshTokenPayload extends JWTPayload {
  sub: string;
  jti: string;       // token id for revocation
}

function getSecret(key: string): Uint8Array {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return new TextEncoder().encode(value);
}

// ─── Access token (15 min) ────────────────────────────────────────────────────

export async function signAccessToken(
  payload: Omit<AccessTokenPayload, "iat" | "exp">
): Promise<string> {
  return new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getSecret("JWT_SECRET"));
}

export async function verifyAccessToken(
  token: string
): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, getSecret("JWT_SECRET"), {
    algorithms: ["HS256"],
  });
  return payload as AccessTokenPayload;
}

// ─── Refresh token (7 days) ───────────────────────────────────────────────────

export async function signRefreshToken(
  payload: Omit<RefreshTokenPayload, "iat" | "exp">
): Promise<string> {
  return new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret("JWT_REFRESH_SECRET"));
}

export async function verifyRefreshToken(
  token: string
): Promise<RefreshTokenPayload> {
  const { payload } = await jwtVerify(token, getSecret("JWT_REFRESH_SECRET"), {
    algorithms: ["HS256"],
  });
  return payload as RefreshTokenPayload;
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

export const ACCESS_COOKIE =
  process.env.SESSION_COOKIE_NAME ?? "gg_access";

export const REFRESH_COOKIE = "gg_refresh";

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
