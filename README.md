# BookFlow

Multi-tenant SaaS booking platform. Each business gets their own public booking page at `/book/[slug]`. Customers book online, business owners manage everything from an admin panel, and both sides get email confirmations.

**Stack:** Next.js 14 · Supabase · Resend · Tailwind CSS · Vercel

---

## ✅ Completed

### Core Booking Flow
- [x] Public booking page at `/book/[slug]` — multi-step wizard (service → staff → date/time → details → confirm)
- [x] Booking saved to Supabase via `/api/book` with full Zod validation
- [x] Customer confirmation email sent via Resend on booking
- [x] Business owner alert email sent on every new booking
- [x] Emails use business's own `business_settings.email` — fully multi-tenant
- [x] Customer self-serve cancellation link in confirmation email (HMAC-signed, no DB token needed)

### Admin Panel
- [x] Login / logout with Supabase Auth (rate-limited, lockout after failed attempts)
- [x] Overview page — day/week calendar view with booking grid
- [x] Notification bell — polls every 30s, red badge for unseen, persisted in localStorage
- [x] Bookings page — filter, search, reschedule modal, cancel, restore, mark complete
- [x] Services management
- [x] Staff management
- [x] Settings page — business info, hours, branding, share tools
- [x] Slug field locked (read-only) after signup

### Auth & Signup
- [x] Signup with confirm password field and client-side validation
- [x] Slug auto-generated from business name, permanent after signup
- [x] Forgot password flow (`/forgot-password` → email → `/reset-password`)

### Landing Page
- [x] Hero with email CTA
- [x] Features section
- [x] Pricing section — 3 plans (€19 / €49 / €99), 7-day free trial
- [x] Footer with Privacy and Terms links

### Legal
- [x] Privacy Policy at `/privacy` (GDPR-compliant, EU-focused)
- [x] Terms of Service at `/terms` (Latvian governing law)

---

## 🔧 Session fixes — 16 Mar 2026

Four bugs found and fixed in this session. All are deployed to `main`.

### 1. Business isolation leak in `/api/slots` — CRITICAL
**File:** `src/app/api/slots/route.ts`

The "Anyone available" staff query had **no `user_id` or `business_id` filter**. It fetched active staff from ALL businesses that shared a `service_id`, meaning one business's staff hours (e.g. `work_start = 03:00`) would bleed into every other business's booking page.

**Fix:** Fetch `user_id` from `business_settings` first, then scope both the specific-staff and anyone-staff queries with `.eq('user_id', biz.user_id)`.

### 2. Staff hours not clamped to business hours
**File:** `src/lib/slots.ts` → `getSlotsForDate()`

Staff `work_start` / `work_end` were used **raw** with no clamping. A staff member with `work_start = 03:00` would show 03:00 slots even if the business opens at 09:00.

**Fix:** Clamp in both `getSlotsForDate` and `getUnionSlotsForDate`:
```ts
effectiveOpen  = Math.max(staff.workStart, biz.open_time)
effectiveClose = Math.min(staff.workEnd,   biz.close_time)
```
Staff can **never** be bookable outside the business window, regardless of their personal hours.

### 3. Booking page statically cached — settings changes not instant
**File:** `src/app/book/[slug]/page.tsx`

The Server Component had no `dynamic` export, so Next.js/Vercel cached the page at build time. Changes to `open_time`, `close_time`, `open_days` in business settings had no effect until the next deployment.

**Fix:** Added `export const dynamic = 'force-dynamic'` — every page load now fetches fresh from Supabase. Business settings changes are instant.

### 4. DayView time labels clipping
**File:** `src/app/admin/_components/DayView.tsx`

Time gutter labels were positioned at `absolute -top-2` (−8px above the row), which placed them outside the row's bounding box and got clipped by the `overflow-y-auto` scroll container.

**Fix:** Changed to `absolute top-1` (inside the row). Also added `padStart(2, '0')` so hours always render as `09:00` not `9:00`.

---

## 🏗️ Architecture — business isolation rules

Every query **must** be scoped to a single business. Here's how each layer enforces isolation:

| Layer | Isolation method |
|---|---|
| Admin API routes (`/api/staff`, `/api/services`, `/api/settings`) | `user_id` from Supabase session cookie |
| Public slot API (`/api/slots`) | `user_id` resolved from `business_settings` via `businessId` param |
| Public queries (`getServicesForBusiness`, `getStaffForBusiness`) | `user_id` resolved from `business_settings` via `businessId` |
| Booking creation (`/api/book`) | `business_id` verified against DB before insert |
| Supabase RLS | Last line of defence — all tables have RLS policies |

**Key rule:** Staff hours are always clamped inside business hours. A staff member working `07:00–20:00` at a business open `09:00–18:00` will only show slots `09:00–18:00`. Business `open_time`/`close_time` is the hard outer boundary.

---

## 📋 Backlog

### High priority
- [ ] Stripe integration — trial expiry, subscription billing per plan
- [ ] Demo booking page (live example on landing page)
- [ ] Mobile responsiveness audit

### Medium priority
- [ ] Analytics dashboard (booking volume, revenue over time)
- [ ] SMS reminders (Pro plan feature)
- [ ] Custom domain support (Pro plan)

### Nice to have
- [ ] White-label / Agency plan features
- [ ] API access for Agency plan
- [ ] Waitlist / invite-only mode before public launch

---

## Env Variables

See `.env.example` for all required keys:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
RESEND_API_KEY
RESEND_FROM_DOMAIN        # domain verified in Resend, e.g. kolab.lv
CANCEL_TOKEN_SECRET       # optional — defaults to SUPABASE_SERVICE_ROLE_KEY if not set
```

---

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.
