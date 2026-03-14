-- BookFlow Database Schema
-- Run this in your Supabase SQL editor: Dashboard → SQL Editor → New query

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- SERVICES
-- ─────────────────────────────────────────────────────────────
create table if not exists services (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  description text not null default '',
  duration    integer not null default 60,  -- minutes
  price       numeric(10,2) not null default 0,
  currency    text not null default 'EUR',
  created_at  timestamptz not null default now()
);

alter table services enable row level security;

create policy "services: owner can select"
  on services for select
  using (user_id = auth.uid());

create policy "services: owner can insert"
  on services for insert
  with check (user_id = auth.uid());

create policy "services: owner can update"
  on services for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "services: owner can delete"
  on services for delete
  using (user_id = auth.uid());

-- Public read — customers browsing a business's service list
create policy "services: public can select by business"
  on services for select
  using (true);

-- ─────────────────────────────────────────────────────────────
-- STAFF
-- ─────────────────────────────────────────────────────────────
create table if not exists staff (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  role        text not null default '',
  bio         text not null default '',
  service_ids uuid[] not null default '{}',
  work_days   integer[] not null default '{1,2,3,4,5}',  -- 0=Sun … 6=Sat
  work_start  text not null default '09:00',
  work_end    text not null default '18:00',
  active      boolean not null default true,
  color       text not null default '#6366f1',
  created_at  timestamptz not null default now()
);

alter table staff enable row level security;

create policy "staff: owner can select"
  on staff for select
  using (user_id = auth.uid());

create policy "staff: owner can insert"
  on staff for insert
  with check (user_id = auth.uid());

create policy "staff: owner can update"
  on staff for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "staff: owner can delete"
  on staff for delete
  using (user_id = auth.uid());

-- Public read — customers selecting a staff member during booking
create policy "staff: public can select active"
  on staff for select
  using (active = true);

-- ─────────────────────────────────────────────────────────────
-- BUSINESS SETTINGS
-- ─────────────────────────────────────────────────────────────
create table if not exists business_settings (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid unique not null references auth.users(id) on delete cascade,
  name                 text not null default 'My Business',
  tagline              text not null default '',
  address              text not null default '',
  phone                text not null default '',
  email                text not null default '',
  currency             text not null default 'EUR',
  open_days            integer[] not null default '{1,2,3,4,5}',
  open_time            text not null default '09:00',
  close_time           text not null default '18:00',
  slot_interval        integer not null default 30,
  lead_time_hours      integer not null default 2,
  max_advance_days     integer not null default 30,
  cancellation_policy  text not null default 'Free cancellation up to 24 hours before your appointment.',
  primary_color        text not null default '#6366f1',
  slug                 text unique not null default 'demo',
  logo_url             text not null default '',
  cover_url            text not null default '',
  instagram_url        text not null default '',
  facebook_url         text not null default '',
  tiktok_url           text not null default '',
  website_url          text not null default '',
  created_at           timestamptz not null default now()
);

alter table business_settings enable row level security;

create policy "business_settings: owner can select"
  on business_settings for select
  using (user_id = auth.uid());

create policy "business_settings: owner can update"
  on business_settings for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "business_settings: owner can insert"
  on business_settings for insert
  with check (user_id = auth.uid());

-- Public read — slug resolution for the booking page
create policy "business_settings: public can select by slug"
  on business_settings for select
  using (true);

-- ─────────────────────────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────────────────────────
create table if not exists bookings (
  id                uuid primary key default uuid_generate_v4(),
  business_id       uuid not null references business_settings(id) on delete cascade,
  ref               text unique not null,
  service_id        uuid references services(id) on delete set null,
  service_name      text not null,
  service_duration  integer not null,
  service_price     numeric(10,2) not null,
  staff_id          uuid references staff(id) on delete set null,
  staff_name        text not null default 'Anyone available',
  date              date not null,
  time              text not null,  -- HH:MM
  customer_name     text not null,
  customer_email    text not null,
  customer_phone    text not null,
  customer_notes    text not null default '',
  status            text not null default 'confirmed' check (status in ('confirmed','pending','cancelled','completed')),
  created_at        timestamptz not null default now()
);

alter table bookings enable row level security;

-- Admin: owner reads their own business's bookings via the business_settings join
create policy "bookings: owner can select"
  on bookings for select
  using (
    business_id in (
      select id from business_settings where user_id = auth.uid()
    )
  );

create policy "bookings: owner can update"
  on bookings for update
  using (
    business_id in (
      select id from business_settings where user_id = auth.uid()
    )
  );

-- Public insert — customers creating bookings (anon key, no session)
create policy "bookings: public can insert"
  on bookings for insert
  with check (true);

-- Public read — slot availability check (only time/duration/staff fields are selected)
create policy "bookings: public can select for availability"
  on bookings for select
  using (true);

-- ─────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────
create index if not exists idx_services_user_id    on services(user_id);
create index if not exists idx_staff_user_id       on staff(user_id);
create index if not exists idx_bookings_business   on bookings(business_id);
create index if not exists idx_bookings_date       on bookings(date);
create index if not exists idx_bookings_staff_date on bookings(staff_id, date);
create index if not exists idx_business_slug       on business_settings(slug);

-- ─────────────────────────────────────────────────────────────
-- SEED — Default business settings
-- NOTE: This seed is intended for manual use during local dev only.
-- In production, business rows are created via /api/auth/signup.
-- To seed locally: replace 'YOUR-USER-UUID-HERE' with your auth.users id
-- (Supabase Dashboard → Authentication → Users → copy UUID)
-- ─────────────────────────────────────────────────────────────
-- insert into business_settings (
--   user_id, name, tagline, address, phone, email, currency,
--   open_days, open_time, close_time, slot_interval,
--   lead_time_hours, max_advance_days, cancellation_policy, primary_color, slug
-- ) values (
--   'YOUR-USER-UUID-HERE',
--   'Glow Beauty Studio',
--   'Premium beauty & wellness services in the heart of Riga',
--   'Brīvības iela 45, Rīga, LV-1010',
--   '+371 2612 3456',
--   'hello@glowbeauty.lv',
--   'EUR',
--   '{1,2,3,4,5,6}',
--   '09:00',
--   '19:00',
--   30,
--   2,
--   30,
--   'Free cancellation up to 24 hours before your appointment.',
--   '#6366f1',
--   'demo'
-- ) on conflict (slug) do nothing;
