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
- [x] Emails use business’s own `business_settings.email` — fully multi-tenant
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
