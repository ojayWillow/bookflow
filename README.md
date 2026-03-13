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

```powershell
@"
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
"@ | Out-File -FilePath .env.local -Encoding utf8
```

Fill in your keys from **Supabase → Project Settings → API**.

### 3. Set up the database

1. Open your Supabase project → **SQL Editor → New query**
2. Paste the contents of `supabase/schema.sql` and run it
3. This creates all tables and seeds default data

### 4. Create an admin user

1. Go to **Supabase → Authentication → Users → Add user**
2. Enter your email and password
3. Use those credentials to log in at `/admin/login`

### 5. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Pages

- `/` — Marketing landing page
- `/book/demo` — Customer booking flow
- `/admin/login` — Admin login
- `/admin` — Dashboard overview
- `/admin/bookings` — Manage bookings
- `/admin/services` — Add/edit/delete services
- `/admin/staff` — Manage staff
- `/admin/settings` — Business info, schedule, booking rules

## Stages

| Stage | Status | Description |
|-------|--------|-------------|
| Stage 1 | ✅ Done | Visual prototype with mock data |
| Stage 2 | ✅ Done | Supabase database + auth |
| Stage 3 | 🔜 Next | Multi-tenancy + real availability engine |
| Stage 4 | 📋 Planned | Email notifications + Stripe payments |
| Stage 5 | 📋 Planned | Polish, responsive admin, deploy |
