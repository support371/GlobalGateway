import { randomBytes, randomUUID } from "crypto";
import { pool } from "./db";

export const FORWARDING_STATUSES = [
  "expected",
  "received",
  "held",
  "inspection_requested",
  "consolidation_requested",
  "return_requested",
  "ready_to_ship",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const FORWARDING_ACTIONS = [
  "hold",
  "inspect",
  "consolidate",
  "return",
  "ship",
] as const;

export type ForwardingStatus = (typeof FORWARDING_STATUSES)[number];
export type ForwardingAction = (typeof FORWARDING_ACTIONS)[number];

export interface WarehouseConfig {
  provider: "shipito";
  mode: "manual" | "api";
  apiEnabled: boolean;
  accountName: string;
  suite: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  formattedAddress: string[];
  instructions: string[];
}

export interface CreateForwardingOrderInput {
  customerName: string;
  customerEmail: string;
  merchantName?: string;
  merchantOrderNumber?: string;
  inboundTrackingNumber?: string;
  itemDescription: string;
  quantity: number;
  declaredValue?: number;
  currency: string;
  requestedAction: ForwardingAction;
  recipientName?: string;
  recipientAddress1?: string;
  recipientAddress2?: string;
  recipientCity?: string;
  recipientState?: string;
  recipientPostalCode?: string;
  recipientCountry?: string;
  notes?: string;
}

export interface ForwardingOrder {
  id: string;
  reference: string;
  provider: string;
  providerSuite: string;
  customerName: string;
  customerEmail: string;
  merchantName: string | null;
  merchantOrderNumber: string | null;
  inboundTrackingNumber: string | null;
  itemDescription: string;
  quantity: number;
  declaredValue: string | null;
  currency: string;
  requestedAction: ForwardingAction;
  status: ForwardingStatus;
  recipientName: string | null;
  recipientAddress1: string | null;
  recipientAddress2: string | null;
  recipientCity: string | null;
  recipientState: string | null;
  recipientPostalCode: string | null;
  recipientCountry: string | null;
  notes: string | null;
  warehousePackageId: string | null;
  outboundCarrier: string | null;
  outboundTrackingNumber: string | null;
  receivedAt: string | null;
  shippedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ForwardingOrderRow {
  id: string;
  reference: string;
  provider: string;
  provider_suite: string;
  customer_name: string;
  customer_email: string;
  merchant_name: string | null;
  merchant_order_number: string | null;
  inbound_tracking_number: string | null;
  item_description: string;
  quantity: number;
  declared_value: string | null;
  currency: string;
  requested_action: ForwardingAction;
  status: ForwardingStatus;
  recipient_name: string | null;
  recipient_address_1: string | null;
  recipient_address_2: string | null;
  recipient_city: string | null;
  recipient_state: string | null;
  recipient_postal_code: string | null;
  recipient_country: string | null;
  notes: string | null;
  warehouse_package_id: string | null;
  outbound_carrier: string | null;
  outbound_tracking_number: string | null;
  received_at: Date | string | null;
  shipped_at: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

let tableReady: Promise<void> | null = null;

function optional(value?: string): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function iso(value: Date | string | null): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapRow(row: ForwardingOrderRow): ForwardingOrder {
  return {
    id: row.id,
    reference: row.reference,
    provider: row.provider,
    providerSuite: row.provider_suite,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    merchantName: row.merchant_name,
    merchantOrderNumber: row.merchant_order_number,
    inboundTrackingNumber: row.inbound_tracking_number,
    itemDescription: row.item_description,
    quantity: Number(row.quantity),
    declaredValue: row.declared_value,
    currency: row.currency,
    requestedAction: row.requested_action,
    status: row.status,
    recipientName: row.recipient_name,
    recipientAddress1: row.recipient_address_1,
    recipientAddress2: row.recipient_address_2,
    recipientCity: row.recipient_city,
    recipientState: row.recipient_state,
    recipientPostalCode: row.recipient_postal_code,
    recipientCountry: row.recipient_country,
    notes: row.notes,
    warehousePackageId: row.warehouse_package_id,
    outboundCarrier: row.outbound_carrier,
    outboundTrackingNumber: row.outbound_tracking_number,
    receivedAt: iso(row.received_at),
    shippedAt: iso(row.shipped_at),
    createdAt: iso(row.created_at)!,
    updatedAt: iso(row.updated_at)!,
  };
}

async function ensureForwardingOrdersTable(): Promise<void> {
  if (!tableReady) {
    tableReady = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS forwarding_orders (
          id varchar(64) PRIMARY KEY,
          reference varchar(48) UNIQUE NOT NULL,
          provider varchar(32) NOT NULL DEFAULT 'shipito',
          provider_suite varchar(32) NOT NULL,
          customer_name text NOT NULL,
          customer_email text NOT NULL,
          merchant_name text,
          merchant_order_number text,
          inbound_tracking_number text,
          item_description text NOT NULL,
          quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
          declared_value numeric(12, 2),
          currency varchar(3) NOT NULL DEFAULT 'USD',
          requested_action varchar(32) NOT NULL DEFAULT 'hold',
          status varchar(32) NOT NULL DEFAULT 'expected',
          recipient_name text,
          recipient_address_1 text,
          recipient_address_2 text,
          recipient_city text,
          recipient_state text,
          recipient_postal_code text,
          recipient_country text,
          notes text,
          warehouse_package_id text,
          outbound_carrier text,
          outbound_tracking_number text,
          received_at timestamptz,
          shipped_at timestamptz,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `);
      await pool.query(
        "CREATE INDEX IF NOT EXISTS forwarding_orders_email_idx ON forwarding_orders (lower(customer_email))",
      );
      await pool.query(
        "CREATE INDEX IF NOT EXISTS forwarding_orders_status_idx ON forwarding_orders (status, created_at DESC)",
      );
    })().catch((error) => {
      tableReady = null;
      throw error;
    });
  }
  await tableReady;
}

function makeReference(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const entropy = randomBytes(5).toString("hex").toUpperCase();
  return `GGW-${date}-${entropy}`;
}

export function getWarehouseConfig(): WarehouseConfig {
  const accountName = process.env.SHIPITO_ACCOUNT_NAME?.trim() || "Victoria Eleanor";
  const suite = process.env.SHIPITO_SUITE?.trim() || "BZA842";
  const address1 = process.env.SHIPITO_WAREHOUSE_ADDRESS_1?.trim() || "444 Alaska Avenue";
  const city = process.env.SHIPITO_WAREHOUSE_CITY?.trim() || "Torrance";
  const state = process.env.SHIPITO_WAREHOUSE_STATE?.trim() || "CA";
  const postalCode = process.env.SHIPITO_WAREHOUSE_POSTAL_CODE?.trim() || "90503";
  const country = process.env.SHIPITO_WAREHOUSE_COUNTRY?.trim() || "USA";
  const requestedApiMode = process.env.SHIPITO_MODE?.trim().toLowerCase() === "api";
  const apiEnabled =
    requestedApiMode &&
    process.env.SHIPITO_API_ENABLED === "true" &&
    Boolean(process.env.SHIPITO_API_KEY?.trim());

  return {
    provider: "shipito",
    mode: apiEnabled ? "api" : "manual",
    apiEnabled,
    accountName,
    suite,
    address1,
    city,
    state,
    postalCode,
    country,
    formattedAddress: [
      accountName,
      address1,
      `Suite #${suite}`,
      `${city}, ${state} ${postalCode}`,
      country,
    ],
    instructions: [
      `Always include Suite #${suite} on the merchant shipping label.`,
      "Create a forwarding order before the package arrives so it can be matched quickly.",
      "Warehouse actions are reviewed manually until Shipito API access is approved.",
      "Do not send prohibited or restricted items.",
    ],
  };
}

export async function createForwardingOrder(
  input: CreateForwardingOrderInput,
): Promise<ForwardingOrder> {
  await ensureForwardingOrdersTable();
  const config = getWarehouseConfig();
  const id = randomUUID();
  const reference = makeReference();
  const result = await pool.query<ForwardingOrderRow>(
    `
      INSERT INTO forwarding_orders (
        id, reference, provider, provider_suite, customer_name, customer_email,
        merchant_name, merchant_order_number, inbound_tracking_number,
        item_description, quantity, declared_value, currency, requested_action,
        status, recipient_name, recipient_address_1, recipient_address_2,
        recipient_city, recipient_state, recipient_postal_code, recipient_country,
        notes
      ) VALUES (
        $1, $2, 'shipito', $3, $4, $5,
        $6, $7, $8, $9, $10, $11, $12, $13,
        'expected', $14, $15, $16, $17, $18, $19, $20, $21
      )
      RETURNING *
    `,
    [
      id,
      reference,
      config.suite,
      input.customerName.trim(),
      input.customerEmail.trim().toLowerCase(),
      optional(input.merchantName),
      optional(input.merchantOrderNumber),
      optional(input.inboundTrackingNumber),
      input.itemDescription.trim(),
      input.quantity,
      input.declaredValue ?? null,
      input.currency.toUpperCase(),
      input.requestedAction,
      optional(input.recipientName),
      optional(input.recipientAddress1),
      optional(input.recipientAddress2),
      optional(input.recipientCity),
      optional(input.recipientState),
      optional(input.recipientPostalCode),
      optional(input.recipientCountry),
      optional(input.notes),
    ],
  );
  return mapRow(result.rows[0]);
}

export async function getForwardingOrderForCustomer(
  reference: string,
  customerEmail: string,
): Promise<ForwardingOrder | undefined> {
  await ensureForwardingOrdersTable();
  const result = await pool.query<ForwardingOrderRow>(
    `
      SELECT * FROM forwarding_orders
      WHERE upper(reference) = upper($1)
        AND lower(customer_email) = lower($2)
      LIMIT 1
    `,
    [reference.trim(), customerEmail.trim()],
  );
  return result.rows[0] ? mapRow(result.rows[0]) : undefined;
}

export async function listForwardingOrders(limit = 100): Promise<ForwardingOrder[]> {
  await ensureForwardingOrdersTable();
  const safeLimit = Math.max(1, Math.min(limit, 250));
  const result = await pool.query<ForwardingOrderRow>(
    "SELECT * FROM forwarding_orders ORDER BY created_at DESC LIMIT $1",
    [safeLimit],
  );
  return result.rows.map(mapRow);
}

export interface UpdateForwardingOrderInput {
  status?: ForwardingStatus;
  requestedAction?: ForwardingAction;
  inboundTrackingNumber?: string;
  warehousePackageId?: string;
  outboundCarrier?: string;
  outboundTrackingNumber?: string;
  notes?: string;
}

export async function updateForwardingOrder(
  id: string,
  input: UpdateForwardingOrderInput,
): Promise<ForwardingOrder | undefined> {
  await ensureForwardingOrdersTable();
  const current = await pool.query<ForwardingOrderRow>(
    "SELECT * FROM forwarding_orders WHERE id = $1 LIMIT 1",
    [id],
  );
  if (!current.rows[0]) return undefined;

  const existing = current.rows[0];
  const status = input.status ?? existing.status;
  const requestedAction = input.requestedAction ?? existing.requested_action;
  const receivedAt =
    status === "received" && !existing.received_at ? new Date() : existing.received_at;
  const shippedAt =
    status === "shipped" && !existing.shipped_at ? new Date() : existing.shipped_at;

  const result = await pool.query<ForwardingOrderRow>(
    `
      UPDATE forwarding_orders SET
        status = $2,
        requested_action = $3,
        inbound_tracking_number = $4,
        warehouse_package_id = $5,
        outbound_carrier = $6,
        outbound_tracking_number = $7,
        notes = $8,
        received_at = $9,
        shipped_at = $10,
        updated_at = now()
      WHERE id = $1
      RETURNING *
    `,
    [
      id,
      status,
      requestedAction,
      input.inboundTrackingNumber === undefined
        ? existing.inbound_tracking_number
        : optional(input.inboundTrackingNumber),
      input.warehousePackageId === undefined
        ? existing.warehouse_package_id
        : optional(input.warehousePackageId),
      input.outboundCarrier === undefined
        ? existing.outbound_carrier
        : optional(input.outboundCarrier),
      input.outboundTrackingNumber === undefined
        ? existing.outbound_tracking_number
        : optional(input.outboundTrackingNumber),
      input.notes === undefined ? existing.notes : optional(input.notes),
      receivedAt,
      shippedAt,
    ],
  );
  return result.rows[0] ? mapRow(result.rows[0]) : undefined;
}
