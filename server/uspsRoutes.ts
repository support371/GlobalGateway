import type { Express, RequestHandler } from "express";
import { z } from "zod";
import { getRates, trackPackage, verifyAddress, UspsError } from "./usps.js";

type RateLimitBucket = { count: number; resetAt: number };
const uspsRateLimitBuckets = new Map<string, RateLimitBucket>();
const USPS_RATE_LIMIT_WINDOW_MS = 60_000;
const USPS_RATE_LIMIT_MAX_REQUESTS = 30;

const uspsRateLimit: RequestHandler = (req, res, next) => {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const existing = uspsRateLimitBuckets.get(key);

  if (!existing || now >= existing.resetAt) {
    uspsRateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + USPS_RATE_LIMIT_WINDOW_MS,
    });
  } else if (existing.count >= USPS_RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existing.resetAt - now) / 1000),
    );
    res.setHeader("Retry-After", String(retryAfterSeconds));
    return res.status(429).json({
      message: "Too many USPS requests. Please wait and try again.",
      code: "USPS_PROXY_RATE_LIMITED",
    });
  } else {
    existing.count += 1;
  }

  // Prevent stale client keys from accumulating indefinitely in long-lived processes.
  if (uspsRateLimitBuckets.size > 2_000) {
    for (const [bucketKey, bucket] of uspsRateLimitBuckets) {
      if (now >= bucket.resetAt) uspsRateLimitBuckets.delete(bucketKey);
    }
  }

  next();
};

export function registerUspsRoutes(app: Express): void {
  /* ---------------------------------------------------------------------- */
  /* USPS REST API proxy routes (public, rate limited)                       */
  /* ---------------------------------------------------------------------- */

  const zip5 = z.string().regex(/^\d{5}$/, "Enter a valid 5-digit ZIP code");
  const positiveDimension = z.coerce
    .number()
    .positive("Package dimensions must be greater than 0")
    .max(130, "Package dimensions must be 130 inches or less");

  const rateRequestSchema = z.object({
    originZip: zip5,
    destinationZip: zip5,
    weightLbs: z.coerce
      .number()
      .positive("Weight must be greater than 0")
      .max(70, "USPS packages must be 70 lbs or less"),
    length: positiveDimension.optional(),
    width: positiveDimension.optional(),
    height: positiveDimension.optional(),
    service: z.string().optional(),
    priceType: z.enum(["RETAIL", "COMMERCIAL"]).optional(),
  });

  // Get live domestic prices from the USPS Prices REST API.
  app.post("/api/usps/rates", uspsRateLimit, async (req, res) => {
    try {
      const data = rateRequestSchema.parse(req.body);
      const rates = await getRates(data);
      res.json({ rates });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0]?.message ?? "Invalid request",
        });
      }
      if (error instanceof UspsError) {
        return res.status(error.status).json({
          message: error.message,
          code: error.code,
        });
      }
      console.error("USPS rate error:", error);
      res.status(500).json({ message: "Failed to fetch USPS rates" });
    }
  });

  // Track a package using the current USPS Tracking REST API.
  app.get(
    "/api/usps/track/:trackingNumber",
    uspsRateLimit,
    async (req, res) => {
      try {
        const trackingNumber = String(req.params.trackingNumber || "")
          .replace(/[^a-zA-Z0-9]/g, "")
          .toUpperCase();
        if (!trackingNumber) {
          return res.status(400).json({
            message: "Tracking number is required",
            code: "USPS_INVALID_TRACKING_NUMBER",
          });
        }
        if (trackingNumber.length > 40) {
          return res.status(400).json({
            message: "Tracking number is too long",
            code: "USPS_INVALID_TRACKING_NUMBER",
          });
        }
        const result = await trackPackage(trackingNumber);
        res.json(result);
      } catch (error) {
        if (error instanceof UspsError) {
          return res.status(error.status).json({
            message: error.message,
            code: error.code,
          });
        }
        console.error("USPS tracking error:", error);
        res.status(500).json({ message: "Failed to track package" });
      }
    },
  );

  // Standardize and validate a US address with the USPS Addresses REST API.
  const verifyAddressSchema = z.object({
    address1: z.string().max(100).optional(),
    address2: z.string().min(1, "Street address is required").max(100),
    city: z.string().min(1, "City is required").max(50),
    state: z
      .string()
      .regex(/^[A-Za-z]{2}$/, "Use the 2-letter state code"),
    zip5: z.string().regex(/^\d{5}$/, "Enter a valid 5-digit ZIP code").optional(),
    zip4: z.string().regex(/^\d{4}$/, "Enter a valid ZIP+4 extension").optional(),
  });

  app.post(
    "/api/usps/verify-address",
    uspsRateLimit,
    async (req, res) => {
      try {
        const data = verifyAddressSchema.parse(req.body);
        const address = await verifyAddress(data);
        res.json({ address });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: error.errors[0]?.message ?? "Invalid address",
          });
        }
        if (error instanceof UspsError) {
          return res.status(error.status).json({
            message: error.message,
            code: error.code,
          });
        }
        console.error("USPS address verification error:", error);
        res.status(500).json({ message: "Failed to verify address" });
      }
    },
  );

}
