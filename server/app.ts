import express, { type Request, Response, NextFunction } from "express";
import { getWarehouseConfig } from "./warehouseConfig.js";
import { registerUspsRoutes } from "./uspsRoutes.js";

function log(message: string) {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [express] ${message}`);
}

export async function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    // Never log API response bodies: they may contain customer, address, or payment data.
    res.on("finish", () => {
      if (path.startsWith("/api")) {
        log(`${req.method} ${path} ${res.statusCode} in ${Date.now() - start}ms`);
      }
    });
    next();
  });

  // Public USPS proxy is independent of database-backed customer orders.
  registerUspsRoutes(app);

  if (process.env.DATABASE_URL) {
    // Avoid importing database-backed routes before configuration is available.
    const [{ registerRoutes }, { registerForwardingRoutes }, { pool }] = await Promise.all([
      import("./routes.js"),
      import("./forwardingRoutes.js"),
      import("./db.js"),
    ]);
    await registerRoutes(app);
    registerForwardingRoutes(app);
    app.get("/api/health", async (_req, res) => {
      try {
        await pool.query("SELECT 1");
        res.set("Cache-Control", "no-store");
        res.json({ status: "ok", databaseConfigured: true, databaseReachable: true });
      } catch {
        res.set("Cache-Control", "no-store");
        res.status(503).json({
          status: "degraded", databaseConfigured: true,
          databaseReachable: false, code: "DATABASE_UNAVAILABLE",
        });
      }
    });
  } else {
    // Read-only warehouse details remain usable; never persist orders in memory
    // or claim checkout, rate purchase, or fulfillment can work without storage.
    app.get("/api/warehouse/config", (_req, res) => res.json(getWarehouseConfig()));
    app.get("/api/health", (_req, res) => {
      res.set("Cache-Control", "no-store");
      res.status(503).json({
        status: "degraded", databaseConfigured: false,
        databaseReachable: false, code: "DATABASE_NOT_CONFIGURED",
      });
    });
    app.use("/api", (_req, res) => res.status(503).json({
      code: "DATABASE_NOT_CONFIGURED",
      message: "This service is temporarily unavailable until secure storage is configured.",
    }));
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    console.error("[api] Unhandled request error:", err);
    if (!res.headersSent) {
      res.status(status).json({ message: status >= 500 ? "Internal Server Error" : err.message || "Request failed" });
    }
  });

  return app;
}
