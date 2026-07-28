# GearUp — Rent Sports & Outdoor Gear Instantly

A Next.js (App Router) frontend for GearUp, a sports/outdoor equipment
rental marketplace with three roles — Customer, Provider, Admin — backed
by the `gearup-backend` Express + Prisma + Stripe API.

See [API_INTEGRATION.md](./API_INTEGRATION.md) for the full mapping of
frontend components to backend endpoints.

## Tech stack

- **Next.js 16** (App Router, Server + Client Components), TypeScript, Tailwind CSS v4
- **shadcn/ui** (Base UI primitives in this generator version, not Radix)
- **TanStack Query** for server state/data fetching, **Zustand** for the auth store
- **React Hook Form + Zod** for every form, schemas mirroring the backend's validators
- **Stripe.js / `@stripe/react-stripe-js`** for payment (`CardElement` + `confirmCardPayment`)
- **js-cookie** to mirror the JWT into a cookie so `proxy.ts` (Next 16's renamed
  `middleware.ts`) can gate `/dashboard/**` routes

## Getting started

1. Have `gearup-backend` running locally (default `http://localhost:5000`),
   migrated and seeded (`npm run db:push && npm run db:seed` in that repo).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the env example and fill in your Stripe publishable key (must match
   the backend's `STRIPE_PUBLISHABLE_KEY`):
   ```bash
   cp .env.local.example .env.local
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Demo / admin credentials

Seeded by `gearup-backend`'s `prisma/seed.ts`:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@gearup.com` | `admin123456` |
| Provider | `provider@gearup.com` | `provider123` |
| Customer | `customer@gearup.com` | `customer123` |

## Testing payments

The pay page uses Stripe's test mode. Use card `4242 4242 4242 4242`, any
future expiry, any CVC. A rental order must be `CONFIRMED` by its provider
before it can be paid — as a customer, place an order, then (as the
provider who owns that gear) confirm it from `/dashboard/provider/orders`
before returning to pay.

## Project structure

```
src/
  app/                # routes (App Router)
    gear/              # public browse + detail pages (Server Components)
    auth/               # login/register (Client Components, RHF+Zod)
    dashboard/          # role-gated: customer/, provider/, admin/
    payment/            # success/cancel outcome pages
  components/
    ui/                # shadcn/ui primitives
    gear/, provider/, payments/, layout/, common/
  lib/
    api/               # one module per backend router + the fetch client
    validators/        # Zod schemas mirroring backend validation
    auth-store.ts       # zustand store, mirrored into cookies
  hooks/               # TanStack Query hooks per domain
  types/api.ts         # shared types mirroring the Prisma schema
  proxy.ts             # dashboard route protection (Next 16's middleware)
```

## Known constraints (see API_INTEGRATION.md for details)

- Public registration only offers Customer/Provider roles; admin is seed-only.
- Payment uses Stripe Elements (`CardElement`), not Checkout Sessions — the
  backend only creates PaymentIntents.
- Gear images are URLs (no file upload endpoint exists on the backend).
- Dashboard route guarding via cookies is for UX/routing only; real
  authorization is enforced server-side on every API request.
