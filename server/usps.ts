type JsonRecord = Record<string, any>;

/**
 * USPS REST API integration.
 *
 * The legacy Web Tools XML endpoints were retired in January 2026. This module
 * uses the current USPS v3 REST APIs with OAuth 2.0 client credentials.
 *
 * Required environment variables:
 *   USPS_CLIENT_ID
 *   USPS_CLIENT_SECRET
 *
 * Optional environment variables:
 *   USPS_API_ENV=production|test
 *   USPS_API_BASE_URL=https://apis.usps.com
 *   USPS_OAUTH_URL=https://apis.usps.com/oauth2/v3/token
 */

const isTestEnvironment = process.env.USPS_API_ENV === "test";
const defaultBaseUrl = isTestEnvironment
  ? "https://apis-tem.usps.com"
  : "https://apis.usps.com";
const USPS_API_BASE_URL = (process.env.USPS_API_BASE_URL || defaultBaseUrl).replace(
  /\/+$/,
  "",
);
const USPS_OAUTH_URL =
  process.env.USPS_OAUTH_URL || `${USPS_API_BASE_URL}/oauth2/v3/token`;
const USPS_CLIENT_ID = process.env.USPS_CLIENT_ID?.trim();
const USPS_CLIENT_SECRET = process.env.USPS_CLIENT_SECRET?.trim();

let tokenCache: { accessToken: string; expiresAt: number } | null = null;

export class UspsError extends Error {
  constructor(
    message: string,
    public readonly code = "USPS_ERROR",
    public readonly status = 502,
  ) {
    super(message);
    this.name = "UspsError";
  }
}

function extractErrorMessage(payload: any, fallback: string): string {
  const candidates = [
    payload?.error_description,
    payload?.message,
    payload?.error?.message,
    payload?.error?.description,
    payload?.apiError?.message,
    payload?.apiError?.errorMessage,
    payload?.errors?.[0]?.message,
    payload?.errors?.[0]?.description,
    payload?.response?.message,
  ];

  const match = candidates.find(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
  return match ? match.trim() : fallback;
}

async function readJsonResponse(response: Response): Promise<any> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text.slice(0, 500) };
  }
}

function requireCredentials(): asserts USPS_CLIENT_ID is string {
  if (!USPS_CLIENT_ID || !USPS_CLIENT_SECRET) {
    throw new UspsError(
      "USPS live services are not configured. Add USPS_CLIENT_ID and USPS_CLIENT_SECRET to the deployment environment.",
      "USPS_NOT_CONFIGURED",
      503,
    );
  }
}

async function getAccessToken(): Promise<string> {
  requireCredentials();

  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }

  let response: Response;
  try {
    response = await fetch(USPS_OAUTH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: USPS_CLIENT_ID,
        client_secret: USPS_CLIENT_SECRET,
      }),
    });
  } catch (error: any) {
    throw new UspsError(
      `Unable to reach USPS OAuth: ${error?.message || "network error"}`,
      "USPS_NETWORK_ERROR",
      502,
    );
  }

  const payload = await readJsonResponse(response);
  if (!response.ok || !payload?.access_token) {
    const code =
      response.status === 401
        ? "USPS_AUTH_FAILED"
        : response.status === 403
          ? "USPS_ACCESS_DENIED"
          : "USPS_OAUTH_ERROR";
    const status = response.status === 401 || response.status === 403 ? 503 : 502;
    throw new UspsError(
      extractErrorMessage(payload, `USPS OAuth failed (${response.status})`),
      code,
      status,
    );
  }

  const expiresInSeconds = Number(payload.expires_in || 28_800);
  tokenCache = {
    accessToken: String(payload.access_token),
    // Refresh at least one minute before expiry.
    expiresAt: Date.now() + Math.max(60, expiresInSeconds - 60) * 1000,
  };

  return tokenCache.accessToken;
}

async function callUsps<T>(
  path: string,
  init: RequestInit = {},
  retryAfterUnauthorized = true,
): Promise<T> {
  const token = await getAccessToken();
  let response: Response;

  try {
    response = await fetch(`${USPS_API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...(init.headers || {}),
      },
    });
  } catch (error: any) {
    throw new UspsError(
      `Unable to reach USPS: ${error?.message || "network error"}`,
      "USPS_NETWORK_ERROR",
      502,
    );
  }

  if (response.status === 401 && retryAfterUnauthorized) {
    tokenCache = null;
    return callUsps<T>(path, init, false);
  }

  const payload = await readJsonResponse(response);
  if (!response.ok) {
    const code =
      response.status === 401
        ? "USPS_AUTH_FAILED"
        : response.status === 403
          ? "USPS_ACCESS_DENIED"
          : response.status === 404
            ? "USPS_NOT_FOUND"
            : response.status === 429
              ? "USPS_RATE_LIMITED"
              : response.status >= 500
                ? "USPS_UNAVAILABLE"
                : "USPS_REQUEST_REJECTED";

    const outwardStatus =
      response.status === 401 || response.status === 403
        ? 503
        : response.status === 404
          ? 404
          : response.status === 429
            ? 429
            : response.status >= 500
              ? 502
              : 422;

    throw new UspsError(
      extractErrorMessage(payload, `USPS request failed (${response.status})`),
      code,
      outwardStatus,
    );
  }

  return payload as T;
}

/* -------------------------------------------------------------------------- */
/* Domestic prices                                                            */
/* -------------------------------------------------------------------------- */

export interface RateRequest {
  originZip: string;
  destinationZip: string;
  weightLbs: number;
  length?: number;
  width?: number;
  height?: number;
  service?: string;
  priceType?: "RETAIL" | "COMMERCIAL";
}

export interface RateResult {
  service: string;
  rate: number;
  currency: "USD";
  commitment?: string;
  zone?: string;
}

const SERVICE_ALIASES: Record<string, string> = {
  PRIORITY: "PRIORITY_MAIL",
  "PRIORITY MAIL": "PRIORITY_MAIL",
  "PRIORITY MAIL EXPRESS": "PRIORITY_MAIL_EXPRESS",
  EXPRESS: "PRIORITY_MAIL_EXPRESS",
  "FIRST CLASS": "USPS_GROUND_ADVANTAGE",
  "FIRST-CLASS PACKAGE SERVICE": "USPS_GROUND_ADVANTAGE",
  "PARCEL SELECT GROUND": "USPS_GROUND_ADVANTAGE",
  "GROUND ADVANTAGE": "USPS_GROUND_ADVANTAGE",
};

function normalizeMailClass(service?: string): string {
  const normalized = String(service || "ALL").trim().toUpperCase();
  return SERVICE_ALIASES[normalized] || normalized;
}

function humanizeMailClass(value: unknown): string {
  return String(value || "USPS Service")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/Usps/g, "USPS");
}

export async function getRates(request: RateRequest): Promise<RateResult[]> {
  const mailClass = normalizeMailClass(request.service);
  const payload = {
    originZIPCode: request.originZip,
    destinationZIPCode: request.destinationZip,
    weight: request.weightLbs,
    length: request.length || 1,
    width: request.width || 1,
    height: request.height || 1,
    mailClasses: [mailClass],
    priceType: request.priceType || "RETAIL",
    mailingDate: new Date().toISOString().slice(0, 10),
  };

  const result = await callUsps<JsonRecord>(
    "/prices/v3/base-rates-list/search",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  const rateOptions = Array.isArray(result?.rateOptions)
    ? result.rateOptions
    : Array.isArray(result?.rates)
      ? [{ rates: result.rates, totalBasePrice: result.totalBasePrice }]
      : [];

  const rates: RateResult[] = [];
  for (const option of rateOptions) {
    const optionRates = Array.isArray(option?.rates) ? option.rates : [];
    for (const rate of optionRates) {
      const amount = Number(rate?.price ?? option?.totalBasePrice);
      if (!Number.isFinite(amount)) continue;
      rates.push({
        service: humanizeMailClass(
          rate?.mailClass || rate?.productName || rate?.description,
        ),
        rate: amount,
        currency: "USD",
        commitment:
          typeof rate?.description === "string" ? rate.description : undefined,
        zone: rate?.zone ? String(rate.zone) : undefined,
      });
    }
  }

  const seen = new Set<string>();
  return rates
    .filter((rate) => {
      const key = `${rate.service}|${rate.rate}|${rate.zone || ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.rate - b.rate);
}

/* -------------------------------------------------------------------------- */
/* Package tracking                                                           */
/* -------------------------------------------------------------------------- */

export interface TrackEvent {
  event: string;
  date?: string;
  time?: string;
  city?: string;
  state?: string;
  zip?: string;
  raw: string;
}

export interface TrackResult {
  trackingNumber: string;
  summary: string;
  status?: string;
  expectedDelivery?: string;
  events: TrackEvent[];
}

function splitTimestamp(value: unknown): { date?: string; time?: string } {
  if (!value) return {};
  const text = String(value);
  const match = text.match(/^(\d{4}-\d{2}-\d{2})[T ]([^Z+]+)?/);
  if (!match) return { date: text };
  return {
    date: match[1],
    time: match[2]?.replace(/\.\d+$/, ""),
  };
}

function normalizeTrackingEvent(event: JsonRecord): TrackEvent {
  const timestamp = splitTimestamp(event?.eventTimestamp || event?.GMTTimestamp);
  const city = event?.eventCity ? String(event.eventCity) : undefined;
  const state = event?.eventState ? String(event.eventState) : undefined;
  const zip = event?.eventZIPCode || event?.eventZIP;
  const label = String(event?.eventType || event?.event || "USPS update");
  const location = [city, state, zip].filter(Boolean).join(", ");
  const when = [timestamp.date, timestamp.time].filter(Boolean).join(" ");

  return {
    event: label,
    date: timestamp.date,
    time: timestamp.time,
    city,
    state,
    zip: zip ? String(zip) : undefined,
    raw: [label, location, when].filter(Boolean).join(" — "),
  };
}

export async function trackPackage(trackingNumber: string): Promise<TrackResult> {
  const clean = trackingNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (!clean) {
    throw new UspsError(
      "Tracking number is required.",
      "USPS_INVALID_TRACKING_NUMBER",
      400,
    );
  }

  const response = await callUsps<any[]>("/tracking/v3r2/tracking", {
    method: "POST",
    body: JSON.stringify([
      {
        trackingNumber: clean,
        includeVeriPoint: true,
      },
    ]),
  });

  const info: JsonRecord | undefined = Array.isArray(response)
    ? response[0]
    : (response as any);
  if (!info || info?.errors?.length) {
    throw new UspsError(
      extractErrorMessage(info, "USPS tracking information was not found."),
      "USPS_NOT_FOUND",
      404,
    );
  }

  const delivery = info?.deliveryDateExpectation || {};
  const rawEvents = Array.isArray(info?.trackingEvents)
    ? info.trackingEvents
    : [];

  return {
    trackingNumber: String(info?.trackingNumber || clean),
    summary: String(info?.statusSummary || info?.status || ""),
    status: info?.statusCategory
      ? String(info.statusCategory)
      : info?.status
        ? String(info.status)
        : undefined,
    expectedDelivery:
      delivery?.expectedDeliveryDate ||
      delivery?.predictedDeliveryDate ||
      delivery?.guaranteedDeliveryDate ||
      undefined,
    events: rawEvents.map(normalizeTrackingEvent),
  };
}

/* -------------------------------------------------------------------------- */
/* Address standardization                                                    */
/* -------------------------------------------------------------------------- */

export interface AddressInput {
  address1?: string;
  address2: string;
  city: string;
  state: string;
  zip5?: string;
  zip4?: string;
}

export interface VerifiedAddress {
  address1?: string;
  address2: string;
  city: string;
  state: string;
  zip5: string;
  zip4?: string;
  returnText?: string;
}

export async function verifyAddress(
  input: AddressInput,
): Promise<VerifiedAddress> {
  const query = new URLSearchParams({
    streetAddress: input.address2,
    state: input.state.toUpperCase(),
  });
  if (input.address1) query.set("secondaryAddress", input.address1);
  if (input.city) query.set("city", input.city);
  if (input.zip5) query.set("ZIPCode", input.zip5);
  if (input.zip4) query.set("ZIPPlus4", input.zip4);

  const result = await callUsps<JsonRecord>(
    `/addresses/v3/address?${query.toString()}`,
  );
  const address = result?.address;
  if (!address?.streetAddress) {
    throw new UspsError(
      "USPS did not return a standardized address.",
      "USPS_ADDRESS_NOT_FOUND",
      404,
    );
  }

  return {
    address1: address.secondaryAddress
      ? String(address.secondaryAddress)
      : undefined,
    address2: String(
      address.streetAddressAbbreviation || address.streetAddress || "",
    ),
    city: String(address.city || address.cityAbbreviation || ""),
    state: String(address.state || ""),
    zip5: String(address.ZIPCode || ""),
    zip4: address.ZIPPlus4 ? String(address.ZIPPlus4) : undefined,
    returnText:
      result?.additionalInfo?.returnCodeText ||
      result?.additionalInfo?.secondaryInfo ||
      undefined,
  };
}

export const uspsConfig = {
  provider: "USPS REST API v3",
  environment: isTestEnvironment ? "test" : "production",
  baseUrl: USPS_API_BASE_URL,
  configured: Boolean(USPS_CLIENT_ID && USPS_CLIENT_SECRET),
};
