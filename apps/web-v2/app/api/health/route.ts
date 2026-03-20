import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, "ok" | "degraded" | "down"> = {
    api: "ok",
  };

  // Optional DB ping — only if DATABASE_URL is configured
  if (process.env.DATABASE_URL) {
    try {
      // Lazy import so health route doesn't break if Prisma client is not generated yet
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();
      await prisma.$queryRaw`SELECT 1`;
      await prisma.$disconnect();
      checks.database = "ok";
    } catch {
      checks.database = "down";
    }
  } else {
    checks.database = "degraded"; // not configured
  }

  const allOk = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json(
    {
      status: allOk ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "2.0.0",
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
}
