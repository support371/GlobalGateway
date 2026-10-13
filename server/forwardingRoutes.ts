import type { Express, RequestHandler } from "express";
import { z } from "zod";
import { isAuthenticated } from "./replitAuth";
import { storage } from "./storage";
import {
  FORWARDING_ACTIONS,
  FORWARDING_STATUSES,
  createForwardingOrder,
  getForwardingOrderForCustomer,
  getWarehouseConfig,
  listForwardingOrders,
  updateForwardingOrder,
} from "./forwarding";

type RateLimitBucket = { count: number; resetAt: number };
const forwardingBuckets = new Map<string, RateLimitBucket>();
const FORWARDING_WINDOW_MS = 10 * 60_000;
const FORWARDING_MAX_REQUESTS = 12;

const forwardingRateLimit: RequestHandler = (req, res, next) => {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const existing = forwardingBuckets.get(key);

  if (!existing || now >= existing.resetAt) {
    forwardingBuckets.set(key, {
      count: 1,
      resetAt: now + FORWARDING_WINDOW_MS,
    });
  } else if (existing.count >= FORWARDING_MAX_REQUESTS) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    res.setHeader("Retry-After", String(retryAfter));
    return res.status(429).json({
      message: "Too many forwarding requests. Please wait and try again.",
      code: "FORWARDING_RATE_LIMITED",
    });
  } else {
    existing.count += 1;
  }

  if (forwardingBuckets.size > 2_000) {
    for (const [bucketKey, bucket] of forwardingBuckets) {
      if (now >= bucket.resetAt) forwardingBuckets.delete(bucketKey);
    }
  }
  next();
};

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(max).optional(),
  );

const createOrderSchema = z.object({
  customerName: z.string().trim().min(2, "Customer name is required").max(120),
  customerEmail: z.string().trim().email("Enter a valid email address").max(254),
  merchantName: optionalText(160),
  merchantOrderNumber: optionalText(120),
  inboundTrackingNumber: optionalText(120),
  itemDescription: z
    .string()
    .trim()
    .min(3, "Describe the item being sent")
    .max(1_000),
  quantity: z.coerce.number().int().min(1).max(1_000).default(1),
  declaredValue: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number().min(0).max(1_000_000).optional(),
  ),
  currency: z.string().trim().length(3).default("USD"),
  requestedAction: z.enum(FORWARDING_ACTIONS).default("hold"),
  recipientName: optionalText(120),
  recipientAddress1: optionalText(200),
  recipientAddress2: optionalText(200),
  recipientCity: optionalText(100),
  recipientState: optionalText(100),
  recipientPostalCode: optionalText(32),
  recipientCountry: optionalText(100),
  notes: optionalText(2_000),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the forwarding instructions" }),
  }),
  website: optionalText(1),
});

const customerLookupSchema = z.object({
  email: z.string().trim().email("Enter the email used for the order"),
});

const updateOrderSchema = z
  .object({
    status: z.enum(FORWARDING_STATUSES).optional(),
    requestedAction: z.enum(FORWARDING_ACTIONS).optional(),
    inboundTrackingNumber: optionalText(120),
    warehousePackageId: optionalText(120),
    outboundCarrier: optionalText(120),
    outboundTrackingNumber: optionalText(120),
    notes: optionalText(2_000),
  })
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: "At least one update field is required",
  });

function validationError(error: z.ZodError) {
  return {
    message: error.errors[0]?.message || "Invalid forwarding request",
    issues: error.errors.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  };
}

export function registerForwardingRoutes(app: Express): void {
  app.get("/api/warehouse/config", (_req, res) => {
    res.json(getWarehouseConfig());
  });

  app.post(
    "/api/forwarding-orders",
    forwardingRateLimit,
    async (req, res) => {
      try {
        const parsed = createOrderSchema.parse(req.body);
        if (parsed.website) {
          return res.status(400).json({ message: "Invalid request" });
        }

        const { termsAccepted: _termsAccepted, website: _website, ...input } = parsed;
        const order = await createForwardingOrder(input);
        const warehouse = getWarehouseConfig();

        res.status(201).json({
          order,
          warehouse,
          nextSteps: [
            `Use the exact warehouse address and include Suite #${warehouse.suite}.`,
            `Keep GlobalGateway reference ${order.reference} with your receipt.`,
            "Add the merchant tracking number when available.",
            "The warehouse team will review the order manually while API access is pending.",
          ],
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json(validationError(error));
        }
        console.error("Error creating forwarding order:", error);
        res.status(500).json({
          message: "Unable to create the forwarding order. Please try again.",
          code: "FORWARDING_CREATE_FAILED",
        });
      }
    },
  );

  app.get(
    "/api/forwarding-orders/:reference",
    forwardingRateLimit,
    async (req, res) => {
      try {
        const { email } = customerLookupSchema.parse(req.query);
        const reference = z
          .string()
          .trim()
          .regex(/^GGW-[A-Z0-9-]{8,40}$/i, "Enter a valid GlobalGateway reference")
          .parse(req.params.reference);
        const order = await getForwardingOrderForCustomer(reference, email);
        if (!order) {
          return res.status(404).json({
            message: "No forwarding order matched that reference and email address.",
            code: "FORWARDING_ORDER_NOT_FOUND",
          });
        }
        res.json({ order, warehouse: getWarehouseConfig() });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json(validationError(error));
        }
        console.error("Error looking up forwarding order:", error);
        res.status(500).json({ message: "Unable to look up the forwarding order." });
      }
    },
  );

  app.get(
    "/api/admin/forwarding-orders",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const user = await storage.getUser(req.user.claims.sub);
        if (user?.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
        const limit = z.coerce.number().int().min(1).max(250).default(100).parse(req.query.limit);
        const orders = await listForwardingOrders(limit);
        res.json({ orders, warehouse: getWarehouseConfig() });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json(validationError(error));
        }
        console.error("Error listing forwarding orders:", error);
        res.status(500).json({ message: "Unable to load forwarding orders." });
      }
    },
  );

  app.patch(
    "/api/admin/forwarding-orders/:id",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const user = await storage.getUser(req.user.claims.sub);
        if (user?.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
        const input = updateOrderSchema.parse(req.body);
        const order = await updateForwardingOrder(req.params.id, input);
        if (!order) {
          return res.status(404).json({ message: "Forwarding order not found" });
        }
        res.json({ order });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json(validationError(error));
        }
        console.error("Error updating forwarding order:", error);
        res.status(500).json({ message: "Unable to update the forwarding order." });
      }
    },
  );
}
