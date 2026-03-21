/**
 * Rate limiting helpers — server-only
 *
 * In production, uses Upstash Redis via environment variables:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * In development/test, falls back to a simple in-memory store
 * so the app runs without Redis configured.
 */

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // Unix timestamp (seconds)
}

// ─── In-memory fallback ───────────────────────────────────────────────────────

interface MemoryBucket {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, MemoryBucket>();

function memoryRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Math.floor(Date.now() / 1000);
  const bucket = memoryStore.get(key);

  if (!bucket || now >= bucket.resetAt) {
    const resetAt = now + windowSeconds;
    memoryStore.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, reset: resetAt };
  }

  if (bucket.count >= limit) {
    return { success: false, remaining: 0, reset: bucket.resetAt };
  }

  bucket.count += 1;
  return {
    success: true,
    remaining: limit - bucket.count,
    reset: bucket.resetAt,
  };
}

// ─── Upstash Redis adapter ────────────────────────────────────────────────────

async function upstashRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;

  const now = Math.floor(Date.now() / 1000);
  const windowKey = `rl:${key}:${Math.floor(now / windowSeconds)}`;

  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", windowKey],
      ["EXPIRE", windowKey, windowSeconds],
    ]),
  });

  const [[, count]] = (await res.json()) as [[null, number], [null, number]];
  const reset = (Math.floor(now / windowSeconds) + 1) * windowSeconds;

  return {
    success: count <= limit,
    remaining: Math.max(0, limit - count),
    reset,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Check rate limit for a given identifier.
 *
 * @param identifier - IP address or user ID
 * @param preset - Preset config key
 */
export async function checkRateLimit(
  identifier: string,
  preset: keyof typeof PRESETS = "api"
): Promise<RateLimitResult> {
  const { limit, windowSeconds } = PRESETS[preset];
  const key = `${preset}:${identifier}`;

  const hasUpstash =
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN;

  if (hasUpstash) {
    return upstashRateLimit(key, limit, windowSeconds);
  }

  return memoryRateLimit(key, limit, windowSeconds);
}

export const PRESETS = {
  api:    { limit: 120, windowSeconds: 60 },   // 120 req/min
  auth:   { limit: 10,  windowSeconds: 60 },   // 10 logins/min
  strict: { limit: 20,  windowSeconds: 60 },   // sensitive endpoints
} as const;
