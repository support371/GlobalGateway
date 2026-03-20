/**
 * Typed API response helpers — server-only.
 */
import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ ok: true, data }, { status });
}

export function created<T>(data: T): NextResponse {
  return NextResponse.json({ ok: true, data }, { status: 201 });
}

export function badRequest(
  message: string,
  errors?: Record<string, string>
): NextResponse {
  return NextResponse.json(
    { ok: false, error: message, ...(errors && { errors }) },
    { status: 400 }
  );
}

export function unauthorized(message = "Authentication required"): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status: 401 });
}

export function forbidden(message = "Access denied"): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status: 403 });
}

export function notFound(message = "Resource not found"): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status: 404 });
}

export function tooManyRequests(reset: number): NextResponse {
  return NextResponse.json(
    { ok: false, error: "Rate limit exceeded. Please retry after the reset time." },
    {
      status: 429,
      headers: {
        "Retry-After": String(reset - Math.floor(Date.now() / 1000)),
      },
    }
  );
}

export function serverError(
  message = "Internal server error",
  err?: unknown
): NextResponse {
  if (process.env.NODE_ENV !== "production" && err) {
    console.error("[API]", err);
  }
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}
