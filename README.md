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
- [x] Services management — create, edit, delete services
- [x] Staff management
- [x] Settings page — business info, hours, slot interval, branding, share tools
- [x] Slug field locked (read-only) after signup
- [x] Empty services page shows "Load starter templates" button — opens category picker modal, seeds services instantly

### Auth & Signup
- [x] **2-step signup flow:**
  - Step 1: name, business name, booking URL (auto-generated slug), email, password
  - Step 2: business category picker (7 categories, icon grid) — pre-seeds matching services on account creation
  - Skip option available — lands on blank dashboard with "Load starter templates" fallback
- [x] After signup → `/signup/confirm` — "Check your inbox" page before login
- [x] Email confirmation via Supabase Auth — account active only after clicking link
- [x] After clicking email link → `/verify-email` success page
- [x] Slug auto-generated from business name, permanent after signup
- [x] Forgot password flow (`/forgot-password` → email → `/reset-password`)

### Industry Template Onboarding
- [x] `src/lib/service-templates.ts` — 7 categories, 44 ready-to-use services
- [x] Categories: 💅 Nail Salon · ✂️ Hair Salon · ✨ Beauty & Aesthetics · 🏋️ Personal Trainer · 🪒 Barbershop · 💆 Massage & Spa · 🍽️ Restaurant / Café
- [x] Services seeded on signup via `/api/auth/signup` (reads `businessCategory` from request body)
- [x] Standalone seed endpoint: `POST /api/services/seed` — authenticated, seeds any category for existing users
- [x] Admin empty-state fallback: "Load starter templates" button when services list is empty

### Landing Page
- [x] Hero with email CTA
- [x] Features section
- [x] Pricing section — 7-day free trial
- [x] Testimonials
- [x] Footer with Privacy and Terms links

### Legal
- [x] Privacy Policy at `/privacy` (GDPR-compliant, EU-focused)
- [x] Terms of Service at `/terms` (Latvian governing law)

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── [locale]/                  ← ALL public-facing pages live here (locale-prefixed)
│   │   ├── layout.tsx
│   │   ├── page.tsx               ← Landing page
│   │   └── signup/
│   │       ├── page.tsx           ← 2-step signup form (THE active signup page)
│   │       └── confirm/
│   │           └── page.tsx       ← "Check your inbox" email confirmation gate
│   ├── signup/                    ← DEAD stubs only — re-exports from [locale]/signup
│   ├── admin/                     ← All admin panel pages (auth-gated via middleware)
│   │   ├── login/
│   │   ├── _components/
│   │   ├── overview/
│   │   ├── bookings/
│   │   ├── services/              ← Includes empty-state template picker
│   │   ├── staff/
│   │   └── settings/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/            ← Creates account + seeds services from template
│   │   │   └── login/
│   │   ├── services/
│   │   │   └── seed/              ← POST — seeds template services for authenticated user
│   │   ├── book/
│   │   ├── slots/
│   │   ├── cancel/
│   │   └── debug-biz/            ← REMOVE before public launch
│   ├── auth/
│   │   ├── callback/              ← Supabase email confirmation callback
│   │   └── confirm/
│   ├── book/[slug]/               ← Public booking wizard
│   ├── verify-email/              ← Post-confirmation success page
│   ├── forgot-password/
│   ├── reset-password/
│   ├── privacy/
│   └── terms/
├── lib/
│   ├── service-templates.ts       ← 7 business categories, 44 service templates (pure static data)
│   ├── slots.ts
│   └── supabase/
│       ├── queries.ts
│       └── middleware.ts
├── i18n/
│   ├── en.ts                      ← Public pages translations (source of truth for PublicDict)
│   ├── lv.ts
│   ├── ru.ts
│   └── admin/                     ← Admin panel translations
│       ├── en.ts  lv.ts  ru.ts    ← Barrel files
│       └── sections/              ← Per-section translation files
│           ├── nav/  overview/  bookings/  services/  staff/
│           ├── schedule/  branding/  share/  settings/  common/
├── hooks/
│   ├── useAdminLang.ts
│   └── useToast.ts
└── middleware.ts                   ← Locale detection + admin auth guard
```

### ⚠️ Important: Locale routing rule

All public pages (landing, signup, booking) are served from `src/app/[locale]/`. The middleware detects the user's locale and redirects `/signup` → `/en/signup` (or `/lv/signup`, `/ru/signup`). **Any changes to public pages must go into `src/app/[locale]/`, not `src/app/` directly.**

The `src/app/signup/` folder contains dead stubs only and exists for reference. Do not edit them.

---

## 🌍 Internationalisation (i18n)

The app has **two separate translation systems** — one for the public booking pages, one for the admin panel. Do not mix them up.

### System 1 — Public pages (landing, signup, booking)

**Supported locales:** `lv` (default) · `en` · `ru`

**Files:** `src/i18n/en.ts`, `lv.ts`, `ru.ts`

**How it works:** Server Components call `getDictionary(locale)` from `src/i18n/index.ts`. The locale comes from the URL segment (`/[locale]/...`). The `PublicDict` type in `en.ts` is the source of truth — TypeScript will error if a key is missing in `lv.ts` or `ru.ts`.

### System 2 — Admin panel

**How it works:** Client-side hook `useAdminLang()` reads locale from `localStorage`.

```ts
const { t } = useAdminLang()
// t.services.title, t.settings.save, etc.
```

**To update an admin translation:** Edit only the relevant section file:
- Staff label → `src/i18n/admin/sections/staff/lv.ts`
- Settings label → `src/i18n/admin/sections/settings/lv.ts`

---

## 🏗️ Architecture — business isolation rules

Every query **must** be scoped to a single business:

| Layer | Isolation method |
|---|---|
| Admin API routes | `user_id` from Supabase session cookie |
| Public slot API (`/api/slots`) | `user_id` resolved from `business_settings` via `businessId` param |
| Public queries | `user_id` resolved from `business_settings` via `businessId` |
| Booking creation (`/api/book`) | `business_id` verified against DB before insert |
| Supabase RLS | Last line of defence — all tables have RLS policies |

**Key rules:**
- Staff hours are always clamped inside business hours. Business `open_time`/`close_time` is the hard outer boundary.
- `slot_interval` is always cast with `Number()` before use — Supabase returns numeric columns as strings.

---

## 📋 Backlog

### High priority
- [ ] Stripe integration — trial expiry, subscription billing
- [ ] Remove `src/app/api/debug-biz/route.ts` before public launch
- [ ] Demo booking page (live example on landing page)
- [ ] Mobile responsiveness audit
- [ ] i18n audit — public booking pages (`lv.ts`, `ru.ts`) not fully audited since Settings page expansion

### Medium priority
- [ ] Analytics dashboard (booking volume, revenue over time)
- [ ] SMS reminders
- [ ] Custom domain support

### Nice to have
- [ ] White-label / Agency plan
- [ ] API access for Agency plan
- [ ] Waitlist / invite-only mode

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
