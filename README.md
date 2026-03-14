# 📅 BookFlow

Universal white-label booking SaaS. Works for any business that takes appointments.

## Stack

- **Next.js 14** (App Router)
- **Supabase** — database + auth
- **Tailwind CSS**
- **TypeScript**

## Run locally

### 1. Clone & install

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your keys from **Supabase → Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> `SUPABASE_SERVICE_ROLE_KEY` is server-only — never expose it client-side.

### 3. Set up the database

1. Open your Supabase project → **SQL Editor → New query**
2. Paste the contents of `supabase/schema.sql` and run it
3. This creates all tables, RLS policies, and indexes

> **Seed data:** The schema no longer includes automatic seed inserts because
> `services` and `staff` require a `user_id`. After creating your admin user
> (step 4), you can add services and staff from the admin panel.

### 4. Create an admin user

1. Go to **Supabase → Authentication → Users → Add user**
2. Enter your email and password
3. Use those credentials to log in at `/admin/login`

> The signup flow at `/signup` will also create your business settings row
> automatically.

### 5. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Useful scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run typecheck    # TypeScript type-check (no emit)
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier format all files
npm run format:check # Check formatting without writing
```

## Pages

- `/` — Marketing landing page
- `/book/[slug]` — Customer booking flow
- `/admin/login` — Admin login
- `/admin` — Dashboard overview
- `/admin/bookings` — Manage bookings
- `/admin/services` — Add/edit/delete services
- `/admin/staff` — Manage staff
- `/admin/settings` — Business info, schedule, booking rules

## Branch protection (recommended)

After cloning, protect `main` so the CI pipeline gates all merges:

1. GitHub → **Settings → Branches → Add branch protection rule**
2. Branch name pattern: `main`
3. Enable: **Require status checks to pass** → add `ci`
4. Enable: **Require a pull request before merging**
5. Enable: **Do not allow bypassing the above settings**

## Stages

| Stage | Status | Description |
|-------|--------|-------------|
| Stage 1 | ✅ Done | Visual prototype with mock data |
| Stage 2 | ✅ Done | Supabase database + auth |
| Stage 3 | 🔜 Next | Multi-tenancy + real availability engine |
| Stage 4 | 📋 Planned | Email notifications + Stripe payments |
| Stage 5 | 📋 Planned | Polish, responsive admin, deploy |
