/**
 * GET /api/kyc/status
 *
 * Returns the KYC verification status for the authenticated user.
 */
import { type NextRequest } from "next/server";
import { verifyAccessToken, ACCESS_COOKIE } from "@v2/lib/jwt";
import { ok, unauthorized, serverError } from "@v2/lib/response";

export const runtime = "nodejs";

type KycStatus = "not_started" | "pending" | "under_review" | "approved" | "rejected";

interface KycStatusResult {
  status: KycStatus;
  level: 0 | 1 | 2 | 3;          // 0 = none, 3 = fully verified
  requiredDocuments: string[];
  submittedAt: string | null;
  reviewedAt: string | null;
  notes: string | null;
}

async function getKycStatus(_userId: string): Promise<KycStatusResult> {
  // TODO: prisma.kycDocument.findMany({ where: { clientId: _userId } })
  // Derive status from document states
  return {
    status: "not_started",
    level: 0,
    requiredDocuments: [
      "government_id",
      "proof_of_address",
      "business_registration",
    ],
    submittedAt: null,
    reviewedAt: null,
    notes: null,
  };
}

export async function GET(req: NextRequest) {
  try {
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

    const status = await getKycStatus(userId);
    return ok(status);
  } catch (err) {
    return serverError("Failed to fetch KYC status", err);
  }
}
