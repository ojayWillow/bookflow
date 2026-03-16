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
- [x] Cancellation emails sent to both customer and business owner when a booking is cancelled
- [x] Slot interval (`slot_interval`) correctly read from `business_settings` and applied to booking time grid

### Admin Panel
- [x] Login / logout with Supabase Auth (rate-limited, lockout after failed attempts)
- [x] Overview page — day/week calendar view with booking grid
- [x] Notification bell — polls every 30s, red badge for unseen, persisted in localStorage
- [x] Cancelled bookings shown in notification bell with red styling
- [x] Bookings page — filter, search, reschedule modal, cancel, restore, mark complete
- [x] Services management
- [x] Staff management
- [x] Settings page — business info, hours, slot interval, branding, share tools
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

## 🔧 Session fixes — 16 Mar 2026 (evening)

### 5. `slot_interval` ignored — slots always 30 min
**Files:** `src/lib/slots.ts`, `src/app/api/slots/route.ts`

The `getSlotsForDate` and `getUnionSlotsForDate` functions both read `settings?.slot_interval ?? 30` but did not cast the value with `Number()`. Supabase returns all numeric columns as strings via the JS client, so `slot_interval` arrived as `"120"` (string). The `?? 30` fallback didn't fire because a non-empty string is truthy — but `m += "120"` is JS string concatenation, making `m` `NaN` and breaking the loop entirely.

**Fix:** Wrapped both reads with `Number()` and added a `|| 30` NaN guard:
```ts
const interval = Number(settings?.slot_interval ?? 30) || 30
```
Also added `Number(biz.slot_interval)` cast in `route.ts` before passing `biz` to the slot functions.

**Affected files:**
- `src/lib/slots.ts` — `getSlotsForDate` and `getUnionSlotsForDate`
- `src/app/api/slots/route.ts` — cast before passing `biz` to slot functions

### 6. Cancellation emails not sent
**File:** `src/app/api/cancel/route.ts` (or equivalent cancellation handler)

When a customer cancelled via the self-serve link, or an admin cancelled from the bookings page, no emails were dispatched to either party.

**Fix:** Added Resend email calls on cancellation — one to the customer confirming the cancellation, one to the business owner notifying them of the cancelled booking.

### 7. Cancelled bookings missing from notification bell
**File:** `src/app/admin/_components/NotificationBell.tsx` (or equivalent)

The notification bell only surfaced new bookings. Cancellations were silent — the owner had no in-app alert when a customer self-cancelled.

**Fix:** Cancelled bookings now appear in the notification bell dropdown with red styling to visually distinguish them from new bookings.

### 8. `open_days` null normalisation causing `slot_interval` save to fail
**File:** Settings section component

When `open_days` was `null` in the DB, the settings form crashed before saving, which also prevented `slot_interval` updates from being persisted correctly.

**Fix:** Normalised `open_days` to an empty array `[]` on load so the form always has a valid starting value.

---

## 🔧 Session fixes — 16 Mar 2026 (morning)

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

## 🌍 Internationalisation (i18n)

The app has **two separate translation systems** — one for the public booking pages, one for the admin panel. Do not mix them up.

### System 1 — Public booking pages

**Supported locales:** `lv` (default) · `en` · `ru`

**Files:**
```
src/i18n/
├── en.ts       ← English (PublicDict type is defined here)
├── lv.ts       ← Latvian
└── ru.ts       ← Russian
```

**How it works:** Server Components call `getDictionary(locale)` from `src/i18n/index.ts`. The locale comes from the URL segment (`/[locale]/...`). Each file is code-split and only loaded when needed.

**To update a public page translation:** Open the relevant locale file (e.g. `src/i18n/lv.ts`) and update the key. The `PublicDict` type in `en.ts` is the source of truth — TypeScript will error if a key is missing in `lv.ts` or `ru.ts`.

---

### System 2 — Admin panel

**Supported locales:** `lv` · `en` · `ru`

**How it works:** The admin panel uses a `useAdminLang()` hook (client-side, localStorage-based). The hook reads the saved locale from `localStorage` and returns a `t` object. Usage in any component:

```ts
const { t } = useAdminLang()
// then use t.staff.title, t.settings.save, etc.
```

**File structure — per-section (as of 16 Mar 2026):**
```
src/i18n/admin/
├── en.ts                        ← barrel file — assembles all sections into AdminDict
├── lv.ts                        ← barrel file — Latvian
├── ru.ts                        ← barrel file — Russian
└── sections/
    ├── nav/          en.ts · lv.ts · ru.ts
    ├── overview/     en.ts · lv.ts · ru.ts
    ├── bookings/     en.ts · lv.ts · ru.ts
    ├── services/     en.ts · lv.ts · ru.ts
    ├── staff/        en.ts · lv.ts · ru.ts
    ├── schedule/     en.ts · lv.ts · ru.ts
    ├── branding/     en.ts · lv.ts · ru.ts
    ├── share/        en.ts · lv.ts · ru.ts
    ├── settings/     en.ts · lv.ts · ru.ts
    └── common/       en.ts · lv.ts · ru.ts
```

**To update an admin translation:** Open only the section file you need, e.g.:
- Fixing a Staff page label → `src/i18n/admin/sections/staff/lv.ts`
- Fixing a Settings page label → `src/i18n/admin/sections/settings/lv.ts`
- Fixing a nav item → `src/i18n/admin/sections/nav/ru.ts`

**To add a new admin page:**
1. Create a new folder under `src/i18n/admin/sections/your-page/`
2. Add `en.ts`, `lv.ts`, `ru.ts` with your strings
3. Import and add to the barrel files `admin/en.ts`, `admin/lv.ts`, `admin/ru.ts`
4. The `AdminDict` type updates automatically — TypeScript will catch any missing keys in `lv` or `ru`

**Known issues / still to do:**
- [ ] Day name abbreviations in `ScheduleSection` (`Sun Mon Tue...`) are hardcoded in English — needs locale-aware day names
- [ ] `nav.share` in Latvian was `'Dalītājs'` (wrong — means "divider") — **fixed to `'Kopīgot'`** in the 16 Mar restructure
- [ ] Public booking pages (`src/i18n/lv.ts`, `ru.ts`) have not been audited for completeness since the Settings page was expanded — worth a pass before launch

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

**Slot interval rule:** `slot_interval` is always cast with `Number()` before use. Supabase returns numeric columns as strings — without the cast, `m += interval` becomes string concatenation and breaks the loop.

---

## 🛠️ Debug routes (temporary)

### `GET /api/debug-biz?businessId=<id>`
**File:** `src/app/api/debug-biz/route.ts`

Returns the raw `slot_interval` value, its `typeof`, and the `Number()` cast result for a given business. Used to diagnose the slot interval bug. **Remove before public launch.**

---

## 📋 Backlog

### High priority
- [ ] Stripe integration — trial expiry, subscription billing per plan
- [ ] Remove `src/app/api/debug-biz/route.ts` before public launch
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
