# GlobalGateway

A full-stack Vite + Express application for global logistics, property management, and legal services.

## Local Development

```bash
npm install
npm run dev       # starts Express + Vite dev server on port 5000
```

## Production Build

```bash
npm run build     # Vite builds frontend → dist/public, esbuild bundles server → dist/index.js
npm start         # runs dist/index.js (static mode)
```

---

## Vercel Deployment Fix

### Root Cause

The deployed site was showing Vercel's default "Congratulations" page instead of the real application due to three compounding issues:

1. **Missing `vercel.json`** — Vercel had no configuration, so it did not know the frontend build output lives in `dist/public` (not `dist` or the root). It served its own placeholder instead.
2. **No serverless API entrypoint** — The Express backend (`server/index.ts`) was a self-contained IIFE that called `server.listen()`. Vercel cannot import and reuse a process that starts its own TCP listener; it needs an exported handler function.
3. **Module-level throw in `server/replitAuth.ts`** — A top-level `throw new Error("REPLIT_DOMAINS not provided")` executed at import time, crashing the Vercel function before any request was served whenever that env var was absent.

### Files Changed

| File | Change |
|---|---|
| `vercel.json` | **Created.** Sets `outputDirectory: dist/public`, routes `/api/*` to the serverless function, and adds an SPA fallback rewrite so all non-file routes serve `index.html`. |
| `api/index.ts` | **Created.** Vercel serverless entrypoint — imports `createApp()`, caches the Express instance across warm invocations, and exports a default handler. |
| `server/app.ts` | **Created.** Extracted Express app creation (middleware + route registration) into an async `createApp()` factory, without calling `listen()`. |
| `server/index.ts` | **Refactored.** Now calls `createApp()` from `./app`, wraps it in an `http.Server`, and calls `listen()` — keeping local dev and `npm start` working exactly as before. |
| `server/replitAuth.ts` | **Fixed.** Moved the module-level `throw` for missing `REPLIT_DOMAINS` inside `setupAuth()`, so importing the module no longer crashes at load time. |
| `tsconfig.json` | **Updated.** Added `api/**/*` to `include` so TypeScript type-checks the new serverless entrypoint. |

### How to Redeploy on Vercel

1. Push this branch (`fix/vercel-deployment`) to GitHub.
2. In the Vercel dashboard, import the repository (or trigger a new deployment if already connected).
3. Vercel will auto-detect the configuration from `vercel.json` — no manual settings needed.
4. Set the required environment variables in **Project → Settings → Environment Variables**:
   - `DATABASE_URL` — PostgreSQL connection string
   - `SESSION_SECRET` — random secret for express-session
   - `REPLIT_DOMAINS` — comma-separated allowed domains (required for auth)
   - `REPL_ID` — Replit app ID (required for OIDC)
   - `STRIPE_SECRET_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` — payment keys
5. Click **Redeploy** (or push a new commit) to trigger a fresh build.
6. The frontend will be served from `dist/public`; API requests under `/api/*` are handled by the `api/index.ts` serverless function.
