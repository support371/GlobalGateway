/** Safe public warehouse configuration; does not connect to any customer database. */
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
