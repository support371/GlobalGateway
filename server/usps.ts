import { XMLParser } from "fast-xml-parser";

/**
 * USPS Web Tools API integration.
 *
 * Docs: https://www.usps.com/business/web-tools-apis/documentation-updates.htm
 * Endpoint: https://secure.shippingapis.com/ShippingAPI.dll
 *
 * Requests are sent as GET calls with two query params:
 *   - API:  the API name (e.g. RateV4, TrackV2, Verify)
 *   - XML:  a URL-encoded XML request document containing the USERID
 *
 * The USERID authenticates the request. It is read from the USPS_USERID env
 * var, falling back to the credential supplied in the integration README so
 * the feature works out of the box.
 */

const USPS_ENDPOINT =
  process.env.USPS_ENDPOINT ||
  "https://secure.shippingapis.com/ShippingAPI.dll";

// Provided Web Tools USERID (see integration README). Prefer the env var.
const USPS_USERID = process.env.USPS_USERID || "1C953GEMCY337";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: true,
  trimValues: true,
});

export class UspsError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "UspsError";
  }
}

function escapeXml(value: string): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Send an XML request to the USPS Web Tools API and return the parsed body. */
async function callUsps(api: string, xml: string): Promise<any> {
  const url = `${USPS_ENDPOINT}?API=${encodeURIComponent(
    api,
  )}&XML=${encodeURIComponent(xml)}`;

  let res: Response;
  try {
    res = await fetch(url, { method: "GET" });
  } catch (err: any) {
    throw new UspsError(
      `Unable to reach USPS Web Tools: ${err?.message ?? "network error"}`,
    );
  }

  const body = await res.text();
  const parsed = parser.parse(body);

  // A top-level <Error> means the whole request failed (bad USERID, unknown
  // API, malformed XML, etc.).
  if (parsed?.Error) {
    throw new UspsError(
      String(parsed.Error.Description ?? "USPS request failed").trim(),
      parsed.Error.Number ? String(parsed.Error.Number) : undefined,
    );
  }

  return parsed;
}

/* -------------------------------------------------------------------------- */
/* RateV4 — domestic package price calculator                                 */
/* -------------------------------------------------------------------------- */

export interface RateRequest {
  originZip: string;
  destinationZip: string;
  /** Total package weight in pounds (can be fractional). */
  weightLbs: number;
  /** USPS service, e.g. "PRIORITY", "PRIORITY MAIL EXPRESS", "FIRST CLASS", "PARCEL SELECT GROUND". */
  service?: string;
  /** Container type, defaults to VARIABLE. */
  container?: string;
}

export interface RateResult {
  service: string;
  rate: number;
  currency: "USD";
  commitment?: string;
  zone?: string;
}

// Split a fractional pound weight into whole pounds + ounces for USPS.
function splitWeight(weightLbs: number): { pounds: number; ounces: number } {
  const safe = Math.max(weightLbs, 0);
  const pounds = Math.floor(safe);
  const ounces = Math.round((safe - pounds) * 16 * 10) / 10;
  return { pounds, ounces };
}

export async function getRates(req: RateRequest): Promise<RateResult[]> {
  const { pounds, ounces } = splitWeight(req.weightLbs);
  const service = (req.service || "ALL").toUpperCase();
  const container = req.container || "VARIABLE";

  const xml =
    `<RateV4Request USERID="${escapeXml(USPS_USERID)}">` +
    `<Revision>2</Revision>` +
    `<Package ID="1">` +
    `<Service>${escapeXml(service)}</Service>` +
    `<ZipOrigination>${escapeXml(req.originZip)}</ZipOrigination>` +
    `<ZipDestination>${escapeXml(req.destinationZip)}</ZipDestination>` +
    `<Pounds>${pounds}</Pounds>` +
    `<Ounces>${ounces}</Ounces>` +
    `<Container>${escapeXml(container)}</Container>` +
    `<Width></Width><Length></Length><Height></Height><Girth></Girth>` +
    `<Machinable>true</Machinable>` +
    `</Package>` +
    `</RateV4Request>`;

  const parsed = await callUsps("RateV4", xml);
  const pkg = parsed?.RateV4Response?.Package;

  if (!pkg) {
    throw new UspsError("USPS returned no rate information.");
  }

  // A per-package <Error> can be nested even when the request succeeds.
  if (pkg.Error) {
    throw new UspsError(
      String(pkg.Error.Description ?? "USPS could not rate this package").trim(),
      pkg.Error.Number ? String(pkg.Error.Number) : undefined,
    );
  }

  const postageList = Array.isArray(pkg.Postage)
    ? pkg.Postage
    : pkg.Postage
      ? [pkg.Postage]
      : [];

  const decodeMailService = (s: unknown) =>
    String(s ?? "")
      .replace(/&lt;\/?sup&gt;.*?&lt;\/sup&gt;/g, "")
      .replace(/<\/?sup>.*?<\/sup>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();

  return postageList.map((p: any): RateResult => ({
    service: decodeMailService(p.MailService),
    rate: Number(p.Rate ?? 0),
    currency: "USD",
    commitment: p.CommitmentName ? String(p.CommitmentName) : undefined,
    zone: pkg.Zone ? String(pkg.Zone) : undefined,
  }));
}

/* -------------------------------------------------------------------------- */
/* TrackV2 — package tracking                                                 */
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

function normalizeTrackEvent(detail: any): TrackEvent {
  const parts = [
    detail?.Event,
    [detail?.EventCity, detail?.EventState, detail?.EventZIPCode]
      .filter(Boolean)
      .join(", "),
    [detail?.EventDate, detail?.EventTime].filter(Boolean).join(" "),
  ].filter(Boolean);

  return {
    event: detail?.Event ? String(detail.Event) : "",
    date: detail?.EventDate ? String(detail.EventDate) : undefined,
    time: detail?.EventTime ? String(detail.EventTime) : undefined,
    city: detail?.EventCity ? String(detail.EventCity) : undefined,
    state: detail?.EventState ? String(detail.EventState) : undefined,
    zip: detail?.EventZIPCode ? String(detail.EventZIPCode) : undefined,
    raw: parts.join(" — "),
  };
}

export async function trackPackage(
  trackingNumber: string,
): Promise<TrackResult> {
  const clean = trackingNumber.replace(/\s+/g, "");
  const xml =
    `<TrackFieldRequest USERID="${escapeXml(USPS_USERID)}">` +
    `<Revision>1</Revision>` +
    `<ClientIp>127.0.0.1</ClientIp>` +
    `<SourceId>GlobalGateway</SourceId>` +
    `<TrackID ID="${escapeXml(clean)}"></TrackID>` +
    `</TrackFieldRequest>`;

  const parsed = await callUsps("TrackV2", xml);
  const info = parsed?.TrackResponse?.TrackInfo;

  if (!info) {
    throw new UspsError("USPS returned no tracking information.");
  }

  if (info.Error) {
    throw new UspsError(
      String(info.Error.Description ?? "Tracking information not found").trim(),
      info.Error.Number ? String(info.Error.Number) : undefined,
    );
  }

  const detailList = Array.isArray(info.TrackDetail)
    ? info.TrackDetail
    : info.TrackDetail
      ? [info.TrackDetail]
      : [];

  const events: TrackEvent[] = [];
  if (info.TrackSummary) {
    events.push(
      normalizeTrackEvent(
        typeof info.TrackSummary === "object"
          ? info.TrackSummary
          : { Event: String(info.TrackSummary) },
      ),
    );
  }
  for (const d of detailList) {
    events.push(normalizeTrackEvent(d));
  }

  const summary =
    typeof info.TrackSummary === "object"
      ? String(info.TrackSummary.Event ?? "")
      : String(info.TrackSummary ?? "");

  return {
    trackingNumber: String(info["@_ID"] ?? clean),
    summary,
    status: info.Status ? String(info.Status) : undefined,
    expectedDelivery: info.ExpectedDeliveryDate
      ? String(info.ExpectedDeliveryDate)
      : undefined,
    events: events.filter((e) => e.raw),
  };
}

/* -------------------------------------------------------------------------- */
/* Verify — address standardization / validation                             */
/* -------------------------------------------------------------------------- */

export interface AddressInput {
  address1?: string; // apt/suite (USPS Address1)
  address2: string; // street address (USPS Address2)
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
  const xml =
    `<AddressValidateRequest USERID="${escapeXml(USPS_USERID)}">` +
    `<Revision>1</Revision>` +
    `<Address ID="0">` +
    `<Address1>${escapeXml(input.address1 ?? "")}</Address1>` +
    `<Address2>${escapeXml(input.address2)}</Address2>` +
    `<City>${escapeXml(input.city)}</City>` +
    `<State>${escapeXml(input.state)}</State>` +
    `<Zip5>${escapeXml(input.zip5 ?? "")}</Zip5>` +
    `<Zip4>${escapeXml(input.zip4 ?? "")}</Zip4>` +
    `</Address>` +
    `</AddressValidateRequest>`;

  const parsed = await callUsps("Verify", xml);
  const address = parsed?.AddressValidateResponse?.Address;

  if (!address) {
    throw new UspsError("USPS returned no address information.");
  }

  if (address.Error) {
    throw new UspsError(
      String(address.Error.Description ?? "Address could not be verified").trim(),
      address.Error.Number ? String(address.Error.Number) : undefined,
    );
  }

  return {
    address1: address.Address1 ? String(address.Address1) : undefined,
    address2: String(address.Address2 ?? ""),
    city: String(address.City ?? ""),
    state: String(address.State ?? ""),
    zip5: String(address.Zip5 ?? ""),
    zip4: address.Zip4 ? String(address.Zip4) : undefined,
    returnText: address.ReturnText ? String(address.ReturnText) : undefined,
  };
}

export const uspsConfig = {
  endpoint: USPS_ENDPOINT,
  hasUserId: Boolean(USPS_USERID),
};
