# BookFlow

Multi-tenant SaaS booking platform. Each business gets their own public booking page at `/book/[slug]`. Customers book online, business owners manage everything from an admin panel, and both sides get email confirmations.

**Stack:** Next.js 14 · Supabase · Resend · Tailwind CSS · Vercel

---

## ✅ Completed

### Core Booking Flow
- [x] Public booking page at `/book/[slug]` — multi-step wizard (service → staff → date/time → details → confirm)
- [x] Booking saved to Supabase via `/api/book`
- [x] Customer confirmation email sent via Resend on booking
- [x] Business owner alert email sent to their registered email on every new booking
- [x] Emails use business's own `business_settings.email` — fully multi-tenant, no shared inbox

### Admin Panel
- [x] Login / logout with Supabase Auth
- [x] Overview page — day/week calendar view with booking grid
- [x] Calendar grid auto-expands to show bookings outside business hours (no clipping)
- [x] Notification bell — shows 10 most recent bookings, polls every 30s, red badge for unseen
- [x] Bookings page
- [x] Services management
- [x] Staff management
- [x] Settings page (business info, hours, branding)
- [x] Slug field will be locked (permanent) — in progress

### Auth & Signup
- [x] Signup collects: first name, last name, business name, booking URL slug, email, password
- [x] Slug auto-generated from business name, editable before signup
- [x] Permanent URL warning shown clearly at signup (lock icon + amber notice)
- [x] Email pre-filled on `/signup` when coming from homepage CTA
- [x] First/last name stored in Supabase auth metadata

### Landing Page
- [x] Clean hero — centered headline, email CTA only, redirects to `/signup`
- [x] Product preview mockup (service list + today's bookings)
- [x] Features section
- [x] Pricing section — 3 plans (€19 / €49 / €99), 7-day free trial on all plans
- [x] Consistent trial messaging throughout (nav, hero, pricing, footer CTA)
- [x] Footer with working links only
- [x] Testimonials removed (placeholder data)

---

## 🔧 In Progress
- [ ] Lock slug field in Settings (read-only after signup)
- [ ] Mobile responsiveness audit

---

## 📋 Backlog

### High priority
- [ ] Stripe integration — trial expiry, subscription billing per plan
- [ ] Booking management — cancel/reschedule from admin
- [ ] Booking status updates (confirm/complete/cancel) in admin
- [ ] Demo booking page (live example for landing page CTA)

### Medium priority
- [ ] SMS reminders (Pro plan feature)
- [ ] Customer-facing cancellation link in confirmation email
- [ ] Analytics dashboard (booking volume, revenue over time)
- [ ] Custom domain support (Pro plan)
- [ ] Password reset flow

### Nice to have
- [ ] White-label / Agency plan features
- [ ] API access for Agency plan
- [ ] Waitlist / invite-only mode before public launch
- [ ] Privacy Policy and Terms of Service pages

---

## Env Variables

See `.env.example` for all required keys:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
RESEND_API_KEY
RESEND_FROM_DOMAIN   # domain verified in Resend, e.g. kolab.lv
```

---

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.
