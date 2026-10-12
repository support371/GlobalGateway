import assert from "node:assert/strict";
import { once } from "node:events";
import type { AddressInfo } from "node:net";

// This smoke test must not touch a live database, purchase postage or ship goods.
delete process.env.DATABASE_URL;
process.env.SHIPITO_MODE = "manual";
process.env.SHIPITO_API_ENABLED = "false";

const { createApp } = await import("../server/app.js");
const app = await createApp();
const server = app.listen(0, "127.0.0.1");
try {
  if (!server.listening) await once(server, "listening");
  const port = (server.address() as AddressInfo).port;
  const origin = `http://127.0.0.1:${port}`;

  const cfg = await fetch(`${origin}/api/warehouse/config`);
  assert.equal(cfg.status, 200, "Public warehouse config must remain readable");
  const warehouse = await cfg.json() as { suite?: string; mode?: string; apiEnabled?: boolean };
  assert.equal(warehouse.suite, "BZA842");
  assert.equal(warehouse.mode, "manual");
  assert.equal(warehouse.apiEnabled, false);

  const health = await fetch(`${origin}/api/health`);
  assert.equal(health.status, 503, "Missing storage must report degraded readiness");
  const healthBody = await health.json() as { code?: string };
  assert.equal(healthBody.code, "DATABASE_NOT_CONFIGURED");

  for (const path of ["/api/forwarding-orders", "/api/shipments/calculate"]) {
    const result = await fetch(`${origin}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });
    assert.equal(result.status, 503, `${path} must be disabled when no database exists`);
  }
  console.log("API smoke PASS: public config works, storage-dependent writes fail closed");
} finally {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
