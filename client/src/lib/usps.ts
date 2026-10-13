// Client helpers for the USPS REST API endpoints exposed by our server.

export interface UspsRate {
  service: string;
  rate: number;
  currency: string;
  commitment?: string;
  zone?: string;
}

export interface UspsTrackEvent {
  event: string;
  date?: string;
  time?: string;
  city?: string;
  state?: string;
  zip?: string;
  raw: string;
}

export interface UspsTrackResult {
  trackingNumber: string;
  summary: string;
  status?: string;
  expectedDelivery?: string;
  events: UspsTrackEvent[];
}

export interface UspsVerifiedAddress {
  address1?: string;
  address2: string;
  city: string;
  state: string;
  zip5: string;
  zip4?: string;
  returnText?: string;
}

const USPS_SETUP_CODES = new Set([
  "USPS_NOT_CONFIGURED",
  "USPS_AUTH_FAILED",
  "USPS_ACCESS_DENIED",
]);

export class UspsRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "UspsRequestError";
  }

  get isAccessPending() {
    return Boolean(this.code && USPS_SETUP_CODES.has(this.code));
  }
}

async function uspsFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    ...init,
  });

  let body: any = null;
  try {
    body = await response.json();
  } catch {
    // The status and fallback message below handle non-JSON responses.
  }

  if (!response.ok) {
    throw new UspsRequestError(
      body?.message || `Request failed (${response.status})`,
      response.status,
      body?.code,
    );
  }

  return body as T;
}

export function getUspsRates(input: {
  originZip: string;
  destinationZip: string;
  weightLbs: number;
  length?: number;
  width?: number;
  height?: number;
  service?: string;
  priceType?: "RETAIL" | "COMMERCIAL";
}): Promise<{ rates: UspsRate[] }> {
  return uspsFetch("/api/usps/rates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function trackUspsPackage(
  trackingNumber: string,
): Promise<UspsTrackResult> {
  return uspsFetch(`/api/usps/track/${encodeURIComponent(trackingNumber)}`);
}

export function verifyUspsAddress(input: {
  address1?: string;
  address2: string;
  city: string;
  state: string;
  zip5?: string;
  zip4?: string;
}): Promise<{ address: UspsVerifiedAddress }> {
  return uspsFetch("/api/usps/verify-address", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
