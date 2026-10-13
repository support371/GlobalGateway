import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

/**
 * Portable PostgreSQL connection compatible with Supabase poolers and standard
 * PostgreSQL providers. Secrets must stay in Vercel's server environment.
 *
 * Use the provider's TLS-enabled connection string. Do not disable certificate
 * verification or log the connection string.
 */
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL must be configured before database routes are enabled.");
}

export const pool = new Pool({
  connectionString: databaseUrl,
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on("error", (error) => {
  console.error("[database] A pooled connection failed:", error.name);
});

export const db = drizzle({ client: pool, schema });
