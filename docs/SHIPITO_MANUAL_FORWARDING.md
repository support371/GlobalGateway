# Shipito manual forwarding mode

GlobalGateway can accept and track forwarding requests before Shipito for Business API credentials are approved.

## Current operating mode

```env
SHIPITO_MODE=manual
SHIPITO_API_ENABLED=false
SHIPITO_SUITE=BZA842
```

The application deliberately describes the workflow as manual. It does not claim that warehouse inventory, labels, carrier purchases, customs submissions, or package actions are automated.

## Customer workflow

1. Create a forwarding order at `/logistics/warehouse-forwarding` before the merchant dispatches the item.
2. Record the generated `GGW-...` reference.
3. Use the exact assigned Shipito address, including `Suite #BZA842`.
4. Add the incoming merchant tracking number when it becomes available.
5. Wait for the package to be matched and reviewed.
6. Request hold, inspection, consolidation, return, or final shipment.
7. Add outbound carrier and tracking details after the warehouse action is approved and paid.

## API routes

### Public

- `GET /api/warehouse/config` — returns the non-secret warehouse configuration and current manual/API mode.
- `POST /api/forwarding-orders` — creates a forwarding order and returns a high-entropy GlobalGateway reference.
- `GET /api/forwarding-orders/:reference?email=...` — protected customer lookup requiring both the reference and order email.

### Administrator

- `GET /api/admin/forwarding-orders` — lists the manual queue for authenticated administrators.
- `PATCH /api/admin/forwarding-orders/:id` — updates status, action, warehouse package ID, carrier, tracking, and notes.

## Data storage

The forwarding service creates the `forwarding_orders` PostgreSQL table on first use with `CREATE TABLE IF NOT EXISTS`. This keeps the pilot deployable without a separate migration run. A managed Drizzle migration should replace the bootstrap DDL before the data model is expanded further.

## Security controls

- Public creation and lookup routes are IP rate limited.
- Status lookup requires both the unpredictable reference and the matching customer email.
- Forwarding, warehouse, recipient, and carrier response bodies are excluded from application response logs.
- Shipito API keys remain server-only environment variables.
- Admin queue and update routes require an authenticated administrator.

## Activating the future Shipito API adapter

Do not switch to API mode merely by setting environment variables. First obtain written approval, documentation, and credentials from Shipito and implement the documented endpoints behind a provider adapter. After integration testing:

```env
SHIPITO_MODE=api
SHIPITO_API_ENABLED=true
SHIPITO_API_KEY=approved-server-side-key
SHIPITO_API_SECRET=approved-server-side-secret
```

Until then, manual mode is the truthful production setting.
