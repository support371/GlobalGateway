# Global Gateway V2 — Migration Report

**Generated:** 2026-03-20
**Branch:** `claude/v2-nextjs-migration`
**Status:** In Progress — V2 built in parallel, legacy preserved

---

## 1. Current (Legacy) Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 |
| Router (client) | wouter 3 |
| Router (server) | Express 4 |
| Language | TypeScript 5.6, strict mode |
| ORM | Drizzle + Neon (serverless Postgres) |
| Auth | Replit OIDC (openid-client + passport) |
| Build output | `dist/public/` (Vite) + `dist/index.js` (esbuild) |
| Deployment | Vercel serverless, `api/index.ts` entrypoint |
| Session | connect-pg-simple / memorystore |
| Payments | Mock-only (no real SDK calls) |
| CI | `.github/workflows/ci.yml` — Node 20, `tsc` + `vite build` |

---

## 2. V2 Target Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Router | Next.js file-system routing |
| Language | TypeScript 5.6, strict mode |
| ORM | Prisma 5 + PostgreSQL |
| Auth | jose JWT (access + refresh rotation), edge-compatible |
| Build output | `.next/` (standard Next.js) |
| Deployment | Vercel (Next.js framework preset) |
| Rate limiting | Upstash Redis (with in-memory fallback for dev) |
| Payments | Adapter interface — Stripe + Klarna (stubs ready) |
| CI | `.github/workflows/v2-ci.yml` — typecheck + lint + build |

---

## 3. Completed Work

### Phase 0 — Legacy Stabilization
- [x] Fixed duplicate `Header`/`Footer` rendering on `Landing.tsx`
- [x] Resolved 100+ TypeScript errors (useAuth, storage, dashboards, forms)
- [x] Added 3 missing admin PATCH endpoints (`/api/shipments/:id`, `/api/lease-requests/:id`, `/api/legal-requests/:id`)
- [x] Mock-flagged `server/payments.ts` with env var pattern
- [x] Replaced Deno CI with Node.js CI workflow
- [x] Added `engines: {node: ">=20"}` to `package.json`
- [x] Verified `npm run check` (0 errors) and `npm run build` (✓)

### Phase 1 — V2 Scaffold
- [x] `apps/web-v2/` directory — isolated from legacy
- [x] `package.json` — Next.js 14, TypeScript strict, jose, zod, Prisma
- [x] `tsconfig.json` — strict, bundler resolution, Next.js plugin
- [x] `next.config.ts` — security headers, no `X-Powered-By`
- [x] `.env.example` — all required env vars documented and separated (server vs public)

### Phase 2 — Marketing Shell
- [x] `app/globals.css` — full CSS custom property token system (colors, spacing, type, shadows, radii)
- [x] `app/layout.tsx` — single `<Nav>` mount, metadata API, Open Graph
- [x] `components/nav/Nav.tsx` + `Nav.module.css` — sticky nav, brand, primary links, sign-in CTA
- [x] `app/page.tsx` — Hero, Stats bar, Capabilities grid, Regions, CTA section
- [x] `app/page.module.css` — all landing page styles

### Phase 3 — Security Baseline
- [x] `middleware.ts` — JWT guard on `/portal/*`, request ID injection on `/api/*`
- [x] `lib/jwt.ts` — `signAccessToken`, `verifyAccessToken`, `signRefreshToken`, `verifyRefreshToken`, cookie helpers
- [x] `lib/ratelimit.ts` — Upstash Redis adapter + in-memory fallback, named presets (`api`, `auth`, `strict`)
- [x] `components/ui/ErrorBoundary.tsx` — class-based React error boundary with retry
- [x] `.env.example` — server-only vs `NEXT_PUBLIC_` separation documented

### Phase 4 — API Layer
- [x] `app/api/health/route.ts` — `GET /api/health` with DB ping and status
- [x] `app/api/auth/login/route.ts` — `POST /api/auth/login` — rate limit, zod validation, token issuance
- [x] `app/api/auth/refresh/route.ts` — `POST /api/auth/refresh` — token rotation
- [x] `app/api/auth/logout/route.ts` — `POST /api/auth/logout` — revocation + cookie clear
- [x] `app/api/payments/initiate/route.ts` — `POST /api/payments/initiate` — auth, rate limit, adapter stub
- [x] `app/api/payments/history/route.ts` — `GET /api/payments/history` — paginated, auth guarded
- [x] `app/api/kyc/status/route.ts` — `GET /api/kyc/status` — auth guarded, stub
- [x] `lib/validation.ts` — Zod schemas for auth, payments, pagination
- [x] `lib/response.ts` — typed `ok`, `created`, `badRequest`, `unauthorized`, `forbidden`, `tooManyRequests`, `serverError`

### Phase 5 — Data Layer
- [x] `prisma/schema.prisma` — models: `Client`, `RefreshToken`, `ApiKey`, `KycDocument`, `Transaction`, `LedgerEntry`, `Webhook`
- [x] Enums: `ClientRole`, `KycStatus`, `KycDocumentType`, `TransactionStatus`, `TransactionMethod`, `WebhookEvent`
- [x] All models include created/updated timestamps, indexed foreign keys

### Phase 6 — Portal Shell
- [x] `app/portal/layout.tsx` — portal shell layout with `PortalSidebar`
- [x] `components/portal/PortalSidebar.tsx` — sectioned nav (Operations, Compliance, Account), sign out
- [x] `app/portal/page.tsx` — Overview: metrics row, rail status cards, recent transactions placeholder
- [x] `app/portal/transfers/page.tsx` — multi-step transfer flow: step progress, Amount & Currency form
- [x] `app/portal/history/page.tsx` — Transaction history (stub)
- [x] `app/portal/compliance/page.tsx` — KYC document checklist
- [x] `app/portal/settings/page.tsx` — stub
- [x] `app/portal/team/page.tsx` — stub

### Phase 7 — Deployment & CI
- [x] `apps/web-v2/vercel.json` — Next.js framework, security headers, API cache headers
- [x] `apps/web-v2/.eslintrc.json` — `eslint-config-next`
- [x] `.github/workflows/v2-ci.yml` — typecheck + lint + build for V2; legacy build check

---

## 4. Remaining Gaps Before Production Cutover

### Critical
| Gap | Description | Effort |
|---|---|---|
| Real auth integration | `authenticateUser` stub in `/api/auth/login` returns null. Needs Prisma user lookup + bcrypt password verification | 1 day |
| Real refresh token store | `getRefreshTokenRecord` / `revokeRefreshToken` are stubs. Needs Prisma `RefreshToken` CRUD | 0.5 day |
| Prisma migrations | `prisma migrate dev` has not been run. Schema exists but no migration files | 0.5 day |
| Prisma client generation | `npx prisma generate` must run before build in CI and on Vercel | 1 hr |
| Stripe/Klarna integration | `initiatePayment` is a stub. Needs real SDK calls | 2–3 days |
| File upload for KYC | KYC document upload UI and Azure Blob/S3 integration not built | 2 days |
| Email verification | `isEmailVerified` field exists; verification flow not built | 1 day |

### Portal / UI
| Gap | Description |
|---|---|
| Transfer step 2–4 | Recipient details, payment method selection, and review/confirm forms are not built |
| Transaction table | History page shows empty state; needs real data binding via Server Components |
| Settings form | Profile update, password change, API key management not built |
| Team management | Role assignment, invite flows not built |
| Responsive mobile nav | Desktop nav hidden on mobile; no hamburger menu yet |

### Infrastructure
| Gap | Description |
|---|---|
| Upstash Redis | Rate limiting falls back to in-memory in dev/CI; Redis must be provisioned for production |
| Session cookie domain | `cookieOptions` must set `domain` for production multi-subdomain setup |
| Error monitoring | `ErrorBoundary.componentDidCatch` logs to console; needs Sentry or equivalent |
| Password hashing | No `bcrypt` / `argon2` dependency yet; needed for `authenticateUser` |

---

## 5. Cutover Plan (Zero-Downtime)

```
Week 1: Resolve critical gaps
  - Wire Prisma auth (login, refresh, logout)
  - Run prisma migrate on staging DB
  - Wire Stripe payment initiate + webhook handler
  - Deploy V2 to Vercel preview URL (not production)

Week 2: Parallel run
  - Legacy app remains live at globalgateway.com
  - V2 deployed at v2.globalgateway.com (Vercel separate project)
  - Internal QA against V2 preview
  - Test: auth flow, transfer initiation, KYC upload, health endpoint

Week 3: Soft launch
  - DNS: v2.globalgateway.com becomes globalgateway.com
  - Legacy kept live at legacy.globalgateway.com for rollback
  - Monitor error rates, latency, auth token validity

Week 4: Full cutover
  - Legacy decommed after 2-week clean run
  - Remove Replit OIDC dependency from codebase
  - Archive legacy/ or move to packages/legacy-express
```

---

## 6. Rollback Plan

1. If V2 deployment is bad: Vercel instant rollback via dashboard (previous deployment)
2. If DB migration breaks: Prisma shadow DB — `prisma migrate diff` to detect, `prisma migrate resolve --rolled-back` to mark
3. If DNS cutover fails: TTL pre-lowered to 60s; repoint A record back to legacy Vercel deployment in < 2 min

---

## 7. Vercel Deploy Steps

### V2 (new project)
1. Create new Vercel project → **Import from GitHub** → select `support371/GlobalGateway`
2. Set **Root Directory** to `apps/web-v2`
3. Framework preset: **Next.js** (auto-detected)
4. Add all environment variables from `.env.example` (see §8)
5. Click **Deploy**

### Legacy (existing project — no changes needed)
- Still builds from repo root with `npm run build` → `dist/public/`
- No action required during parallel phase

---

## 8. Required Environment Variables

### Vercel → V2 Project → Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | **Critical** | Neon Postgres pooled connection string |
| `JWT_SECRET` | **Critical** | Min 32 random bytes — generate with `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | **Critical** | Different from JWT_SECRET |
| `SESSION_COOKIE_NAME` | Optional | Defaults to `gg_access` |
| `UPSTASH_REDIS_REST_URL` | Production | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Production | Upstash Redis token |
| `STRIPE_SECRET_KEY` | Payments | `sk_live_...` |
| `KLARNA_ACCOUNT_NUMBER` | Payments | When Klarna is wired |
| `KLARNA_ROUTING_NUMBER` | Payments | When Klarna is wired |
| `NEXT_PUBLIC_APP_URL` | SEO | `https://globalgateway.com` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Payments UI | `pk_live_...` |
| `KYC_PROVIDER_API_KEY` | KYC | When KYC provider is selected |

---

## 9. Azure Dependencies (Production)

| Service | Purpose | SKU Recommendation |
|---|---|---|
| **Azure PostgreSQL Flexible Server** | Primary DB (alternative to Neon) | General Purpose, 4 vCores |
| **Azure Blob Storage** | KYC document storage | Standard LRS, private container |
| **Azure Key Vault** | Secret management (JWT_SECRET etc.) | Standard tier |
| **Azure Front Door** | Global CDN + WAF | Standard tier |
| **Azure Container Registry** | If self-hosting Next.js server | Basic |
| **Azure AD B2C** | Enterprise SSO (optional, replaces JWT-only auth) | Free tier to start |
| **Azure Monitor + App Insights** | Logging, traces, error monitoring | Pay-as-you-go |

> **Note:** All Azure services are optional if staying on Vercel + Neon. Azure becomes necessary for enterprise clients requiring data residency in specific regions (EU, APAC) or when contractual requirements mandate non-US cloud hosting.
