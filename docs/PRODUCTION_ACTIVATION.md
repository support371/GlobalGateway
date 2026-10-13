# GlobalGateway — production activation gates

This release keeps GlobalGateway as a separate logistics, forwarding and business-services application within the GEM Enterprise network. **A green build is not authorization to accept shipments, hold customer payments, or process carrier labels.**

## Current architecture

- Frontend: React/Vite deployed to Vercel, with an Express serverless API.
- Database: PostgreSQL using `pg` and `drizzle-orm/node-postgres`, compatible with a dedicated Supabase PostgreSQL project.
- Warehouse: Shipito **manual-only** receiving and forwarding workflow. Suite BZA842 is an account-assigned address, **not evidence of owned or operated physical warehouse premises**.
- USPS: OAuth 2.0 REST rate, address and tracking proxies; no label purchasing is implemented. All business access and API scope approvals must be separately confirmed.
- GEM Enterprise: independent business-line draft PR #433; keep customer identity, order records and payment permissions separated.

## Required configuration — no secret values in Git

All variables below are **server-side**, configured in Vercel project `globalgateway-1` with the correct Preview and Production scopes. Never place database credentials in `VITE_*`, `NEXT_PUBLIC_*`, or source control.

| Variable | Required for | Notes |
| --- | --- | --- |
| `DATABASE_URL` | New order storage | Dedicated PostgreSQL database; use provider's TLS-enabled URI. |
| `SESSION_SECRET` | Authenticated sessions | Strong random value of 32+ characters; rotate if disclosed. |
| `USPS_CLIENT_ID`, `USPS_CLIENT_SECRET` | Live USPS REST API | Modern USPS Developer Portal application and approved scopes, not retired Web Tools credentials. |
| `SHIPITO_MODE=manual` | Forwarding | Never switch to API without explicit vendor approval and tested adapter. |
| `SHIPITO_API_ENABLED=false` | Forwarding | A Shipito API integration has not been deployed. |
| `SHIPITO_SUITE=BZA842` | Warehouse address | Verify authorized suite is still current before customer notices. |
| `REPLIT_DOMAINS`, `REPL_ID` | Replit-specific login only | Do not set these to fake values for Vercel. Real sign-in requires an approved identity-provider migration. |
| `PUBLIC_LOGIN_ENABLED` | Login navigation visibility | Leave unset/false until identity integration is independently tested. |

**Cost gate:** Before creating a dedicated Supabase project, choose the appropriate Free-plan organization, retrieve its exact project-creation cost, and complete the required explicit cost confirmation. Never attach this logistics application to GEM Sentinel, the crypto bot, or unrelated database projects just to avoid a setup step.

## Preview test checklist

1. Run `npm ci && npm run check && npm run build && npm run smoke:api`; these tests don't purchase postage.
2. Confirm `GET /api/platform/capabilities` returns no secrets and `loginPublished=false` until auth approval.
3. Confirm `GET /api/warehouse/config` returns a manual-mode warehouse, correct suite and current account address.
4. Without database, `GET /api/health` must return HTTP 503 with `DATABASE_NOT_CONFIGURED`; customer order intake must be disabled.
5. Without USPS OAuth credentials, `POST /api/usps/rates` with syntactically valid input must return `USPS_NOT_CONFIGURED`, HTTP 503.
6. After a dedicated database and session secret are configured, verify `GET /api/health` performs a real `SELECT 1`; run schema migrations, test one explicitly authorized synthetic forwarding order, customer lookup, and cleanup.
7. Verify staff authentication and role enforcement. Do not expose the admin queue until login, session storage and authorization have passed integration tests.
8. Use verified provider credentials only in secret scopes, confirm USPS rate/address/tracking calls, and inspect responses for missing permissions.
9. Confirm real shipping rates are identified as quotes, never pretend that an internal booking is a carrier-issued tracking number, and don't automatically purchase a label.
10. Only after passing all gates review and merge GlobalGateway PR #19; separately review GEM Enterprise PR #433, point the gated business-line link to an approved public production URL, then validate production health.

## Operational safety

When no database is available, the public site and warehouse instructions may render, but **no new shipping order is accepted**. When the USPS integration lacks OAuth credentials, no upstream request is made. Carrier tracking is separate from internal reference numbers. Customer payment information and package addresses must never be printed to application logs.

**Deployment access issue:** the connected Vercel integration previously returned 403 for reading and writing environment variables. Require the project owner's access approval or an authorized project-scoped CLI connection before adding credentials.
