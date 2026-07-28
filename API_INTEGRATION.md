# API Integration Map

GearUp's frontend consumes the `gearup-backend` Express API directly (base
URL: `NEXT_PUBLIC_API_URL`, e.g. `http://localhost:5000/api`). All requests
go through `src/lib/api/client.ts`, a thin `fetch` wrapper that attaches
`Authorization: Bearer <token>` from the zustand auth store and normalizes
the backend's `{ success, message, data, errorDetails }` envelope into a
typed `ApiError` on failure. One module per backend router lives in
`src/lib/api/*.ts`; TanStack Query hooks in `src/hooks/*.ts` wrap those for
components (queries for reads, mutations for writes, with cache
invalidation on success and toast-on-error).

## Auth (`/api/auth`)

| Frontend | Endpoint | Notes |
|---|---|---|
| `src/app/auth/register/page.tsx` | `POST /api/auth/register` | Public role picker restricted to Customer/Provider (see below) |
| `src/app/auth/login/page.tsx` | `POST /api/auth/login` | Redirects to `?redirect=` target or the role's dashboard |
| `src/hooks/use-auth.ts` (`useMe`) | `GET /api/auth/me` | Re-validates the session on every dashboard load |

**Deviation:** the register form only offers `CUSTOMER`/`PROVIDER`, even
though the backend's validator technically accepts `role: "ADMIN"` in the
payload. Exposing that in a public signup form would be a privilege
escalation hole; the seeded admin account is the only way in.

## Gear (`/api/gear`, `/api/categories`)

| Frontend | Endpoint |
|---|---|
| `src/app/page.tsx` (home, featured gear) | `GET /api/gear?limit=8&sortBy=createdAt&sortOrder=desc` |
| `src/app/gear/page.tsx` + `components/gear/gear-filters.tsx` | `GET /api/gear` (category/price/brand/availability/search/sort, driven by URL search params) |
| `src/app/gear/page.tsx` | `GET /api/categories` |
| `src/app/gear/[id]/page.tsx` | `GET /api/gear/:id` (includes reviews, provider, category) |

## Rentals (`/api/rentals`)

| Frontend | Endpoint |
|---|---|
| `components/gear/rent-now-panel.tsx` | `GET /api/rentals/availability` (live check as dates are picked) |
| `components/gear/rent-now-panel.tsx` | `POST /api/rentals` (creates the order, `PLACED` status) |
| `src/app/dashboard/customer/page.tsx` | `GET /api/rentals` (order history) |
| `src/app/dashboard/customer/orders/[id]/page.tsx` + `.../pay/page.tsx` | `GET /api/rentals/:id` |
| Cancel action on the customer dashboard | `PATCH /api/rentals/:id/cancel` |

## Payments (`/api/payments`) — Stripe

| Frontend | Endpoint |
|---|---|
| `src/app/dashboard/customer/orders/[id]/pay/page.tsx` | `POST /api/payments/create` → `{ clientSecret }` for a Stripe `PaymentIntent` |
| `components/payments/stripe-checkout-form.tsx` | Stripe.js `confirmCardPayment(clientSecret)` (client-side, talks to Stripe directly) |
| same component, on success | `POST /api/payments/confirm` (syncs `Payment`/`RentalOrder` status to `PAID` server-side) |
| `src/app/dashboard/customer/page.tsx` (Payments tab) | `GET /api/payments` |

**Deviation:** the backend only ever creates a Stripe **PaymentIntent**
(`stripeService.createPaymentIntent`), never a Checkout **Session**, and
doesn't opt into `automatic_payment_methods`. So the frontend uses Stripe
**Elements' `CardElement`** + `confirmCardPayment` rather than a
Checkout-session redirect or the newer `PaymentElement` — both of which the
current backend can't support. `/payment/success` and `/payment/cancel`
are plain frontend routes the checkout form navigates to itself (there's
no hosted Stripe redirect to return from), reading `?rentalId=` to show
the outcome. A `POST /api/payments/webhook` endpoint exists server-side
but isn't reachable from local dev without a public URL, which is why the
frontend calls `/api/payments/confirm` directly after Stripe succeeds.

## Reviews (`/api/reviews`)

| Frontend | Endpoint |
|---|---|
| `src/app/gear/[id]/page.tsx` (`gear.reviews`) | included in `GET /api/gear/:id`, no separate call |
| `components/gear/review-form.tsx` (on a `RETURNED` order) | `POST /api/reviews` |

## Provider (`/api/provider`) — role-gated

| Frontend | Endpoint |
|---|---|
| `src/app/dashboard/provider/page.tsx` | `GET /api/provider/stats` |
| `src/app/dashboard/provider/gear/page.tsx` | `GET /api/provider/gear` |
| `components/provider/gear-form.tsx` (new) | `POST /api/provider/gear` |
| `components/provider/gear-form.tsx` (edit), availability Switch | `PUT /api/provider/gear/:id` |
| Delete dialog on the inventory table | `DELETE /api/provider/gear/:id` |
| `src/app/dashboard/provider/orders/page.tsx` | `GET /api/provider/orders` |
| Status action buttons (Confirm / Mark Picked Up / Mark Returned / Cancel) | `PATCH /api/provider/orders/:id` |

**Note:** gear images are a `string[]` of URLs validated with `isURL()` —
there's no file-upload endpoint, so the gear form has a repeatable
**image URL** field, not a binary uploader.

## Admin (`/api/admin`) — role-gated

| Frontend | Endpoint |
|---|---|
| `src/app/dashboard/admin/page.tsx` | `GET /api/admin/dashboard/stats` |
| `src/app/dashboard/admin/users/page.tsx` | `GET /api/admin/users` |
| Suspend / Activate actions | `PATCH /api/admin/users/:id/status` |
| `src/app/dashboard/admin/gear/page.tsx` | `GET /api/admin/gear` |
| Remove-listing dialog | `DELETE /api/admin/gear/:id` |
| `src/app/dashboard/admin/rentals/page.tsx` | `GET /api/admin/rentals` |
| Status override select | `PATCH /api/admin/rentals/:id/status` |

## Auth & route protection

- JWT returned at login/register is kept in a zustand store (`src/lib/auth-store.ts`)
  and mirrored into two plain cookies (`gearup_token`, `gearup_role`) via
  `js-cookie` so `src/proxy.ts` (Next.js's renamed `middleware.ts`) can
  gate `/dashboard/:path*` at the edge: no token → redirect to login;
  token present but wrong role segment → redirect to the user's own
  dashboard.
- These cookies are **not** httpOnly (the backend never sets them — it
  only returns the token in the JSON body), so they only drive
  client-side/proxy routing, not real security. Actual authorization is
  still enforced server-side on every request via `authMiddleware` /
  `roleMiddleware` in `gearup-backend`.
