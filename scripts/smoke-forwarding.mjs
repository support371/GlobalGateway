const baseUrlValue = process.env.FORWARDING_BASE_URL?.trim();
const customerEmail = process.env.FORWARDING_SMOKE_EMAIL?.trim();
const confirmation = process.env.FORWARDING_SMOKE_CONFIRM?.trim();
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
const adminCookie = process.env.FORWARDING_ADMIN_COOKIE?.trim();

if (!baseUrlValue) {
  throw new Error("FORWARDING_BASE_URL is required");
}
if (!customerEmail) {
  throw new Error("FORWARDING_SMOKE_EMAIL is required");
}
if (confirmation !== "CREATE_SYNTHETIC_FORWARDING_ORDER") {
  throw new Error(
    "Set FORWARDING_SMOKE_CONFIRM=CREATE_SYNTHETIC_FORWARDING_ORDER to acknowledge that this test creates a database record",
  );
}

const baseUrl = new URL(baseUrlValue);

function endpoint(path) {
  const url = new URL(path, baseUrl);
  for (const [key, value] of baseUrl.searchParams.entries()) {
    if (!url.searchParams.has(key)) url.searchParams.set(key, value);
  }
  return url;
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("accept", "application/json");
  if (options.body) headers.set("content-type", "application/json");
  if (bypassSecret) {
    headers.set("x-vercel-protection-bypass", bypassSecret);
    headers.set("x-vercel-set-bypass-cookie", "true");
  }

  const response = await fetch(endpoint(path), {
    redirect: "follow",
    ...options,
    headers,
  });
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    const detail = typeof body === "string" ? body.slice(0, 500) : JSON.stringify(body);
    throw new Error(`${options.method || "GET"} ${path} failed with ${response.status}: ${detail}`);
  }
  return body;
}

const timestamp = new Date().toISOString();
const createResponse = await request("/api/forwarding-orders", {
  method: "POST",
  body: JSON.stringify({
    customerName: "GlobalGateway Smoke Test",
    customerEmail,
    merchantName: "GlobalGateway automated verification",
    merchantOrderNumber: `SMOKE-${Date.now()}`,
    itemDescription: `Synthetic verification record created ${timestamp}; no physical parcel exists`,
    quantity: 1,
    declaredValue: 0,
    currency: "USD",
    requestedAction: "hold",
    notes: "Automated smoke-test record. Cancel after API verification.",
    termsAccepted: true,
    website: "",
  }),
});

const order = createResponse?.order;
if (!order?.id || !order?.reference) {
  throw new Error("Create response did not contain a forwarding order ID and reference");
}
console.log(`Created synthetic forwarding order ${order.reference}`);

const lookupResponse = await request(
  `/api/forwarding-orders/${encodeURIComponent(order.reference)}?email=${encodeURIComponent(customerEmail)}`,
);
if (lookupResponse?.order?.id !== order.id) {
  throw new Error("Customer lookup returned a different forwarding order");
}
console.log("Customer create-and-lookup flow passed");

if (adminCookie) {
  const updateResponse = await request(`/api/admin/forwarding-orders/${encodeURIComponent(order.id)}`, {
    method: "PATCH",
    headers: { cookie: adminCookie },
    body: JSON.stringify({
      status: "cancelled",
      notes: "Synthetic smoke-test record; create, lookup, and administrator update verified.",
    }),
  });
  if (updateResponse?.order?.status !== "cancelled") {
    throw new Error("Administrator update did not return cancelled status");
  }
  console.log("Administrator update flow passed; synthetic record marked cancelled");
} else {
  console.log("Administrator update skipped because FORWARDING_ADMIN_COOKIE was not provided");
}

console.log("Forwarding smoke test completed successfully");
