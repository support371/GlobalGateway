// Client helpers for the USPS Web Tools endpoints exposed by our server.

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

// USPS "Authorization failure" — the USERID is valid but the Web Tools API
// has not yet been approved/activated by USPS for production use.
export const USPS_AUTH_PENDING_CODE = "80040B1A";

export class UspsRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "UspsRequestError";
  }

  /** True when USPS rejected the credentials (access not yet activated). */
  get isAccessPending() {
    return this.code === USPS_AUTH_PENDING_CODE;
  }
}

async function uspsFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    ...init,
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // ignore parse errors, handled below
  }

  if (!res.ok) {
    throw new UspsRequestError(
      body?.message || `Request failed (${res.status})`,
      res.status,
      body?.code,
    );
  }

  return body as T;
}

export function getUspsRates(input: {
  originZip: string;
  destinationZip: string;
  weightLbs: number;
  service?: string;
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
