# 📅 BookFlow

Universal white-label booking SaaS. Works for any business that takes appointments.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Pages

- `/` — Marketing landing page
- `/book/demo` — Customer booking flow (fully interactive)
- `/admin` — Admin dashboard overview
- `/admin/bookings` — Manage bookings (confirm/cancel)
- `/admin/services` — Add/edit/delete services
- `/admin/settings` — Business info, schedule, booking rules

## No database required

Stage 1 uses mock data in `src/data/mock.ts`. All UI is fully interactive.
Stage 2 will wire up Supabase + real auth.
