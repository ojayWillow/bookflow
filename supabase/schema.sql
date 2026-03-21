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
  cancellation_window_hours integer not null default 24,
  require_approval     boolean not null default false,
  primary_color        text not null default '#6366f1',
  slug                 text unique not null default 'demo',
  logo_url             text not null default '',
  cover_url            text not null default '',
  instagram_url        text not null default '',
  facebook_url         text not null default '',
  tiktok_url           text not null default '',
  website_url          text not null default '',
  google_maps_url      text not null default '',
    restaurant_mode boolean not null default false,
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
-- MIGRATIONS — run these in Supabase SQL Editor for existing DBs
-- ─────────────────────────────────────────────────────────────
-- alter table business_settings add column if not exists cancellation_window_hours integer not null default 24;
-- alter table business_settings add column if not exists require_approval boolean not null default false;
-- alter table business_settings add column if not exists google_maps_url text not null default '';

-- alter table business_settings add column if not exists restaurant_mode boolean not null default false;

-- ─────────────────────────────────────────────────────────────
-- MENU CATEGORIES
-- ─────────────────────────────────────────────────────────────
create table if not exists menu_categories (
  id          uuid primary key default uuid_generate_v4(),
  business_id uuid not null references business_settings(id) on delete cascade,
  name        text not null,
  sort_order  integer not null default 0
);

alter table menu_categories enable row level security;

create policy "menu_categories: owner can select"
  on menu_categories for select
  using (business_id in (select id from business_settings where user_id = auth.uid()));

create policy "menu_categories: owner can insert"
  on menu_categories for insert
  with check (business_id in (select id from business_settings where user_id = auth.uid()));

create policy "menu_categories: owner can update"
  on menu_categories for update
  using (business_id in (select id from business_settings where user_id = auth.uid()))
  with check (business_id in (select id from business_settings where user_id = auth.uid()));

create policy "menu_categories: owner can delete"
  on menu_categories for delete
  using (business_id in (select id from business_settings where user_id = auth.uid()));

create policy "menu_categories: public can select"
  on menu_categories for select
  using (true);

-- ─────────────────────────────────────────────────────────────
-- MENU ITEMS
-- ─────────────────────────────────────────────────────────────
create table if not exists menu_items (
  id          uuid primary key default uuid_generate_v4(),
  category_id uuid not null references menu_categories(id) on delete cascade,
  name        text not null,
  description text not null default '',
  price       numeric(10,2) not null default 0,
  available   boolean not null default true,
  image_url   text not null default ''
);

alter table menu_items enable row level security;

create policy "menu_items: owner can select"
  on menu_items for select
  using (category_id in (select mc.id from menu_categories mc join business_settings bs on bs.id = mc.business_id where bs.user_id = auth.uid()));

create policy "menu_items: owner can insert"
  on menu_items for insert
  with check (category_id in (select mc.id from menu_categories mc join business_settings bs on bs.id = mc.business_id where bs.user_id = auth.uid()));

create policy "menu_items: owner can update"
  on menu_items for update
  using (category_id in (select mc.id from menu_categories mc join business_settings bs on bs.id = mc.business_id where bs.user_id = auth.uid()))
  with check (category_id in (select mc.id from menu_categories mc join business_settings bs on bs.id = mc.business_id where bs.user_id = auth.uid()));

create policy "menu_items: owner can delete"
  on menu_items for delete
  using (category_id in (select mc.id from menu_categories mc join business_settings bs on bs.id = mc.business_id where bs.user_id = auth.uid()));

create policy "menu_items: public can select available"
  on menu_items for select
  using (available = true);

-- ─────────────────────────────────────────────────────────────
-- BOOKING MENU SELECTIONS
-- ─────────────────────────────────────────────────────────────
create table if not exists booking_menu_selections (
  id           uuid primary key default uuid_generate_v4(),
  booking_id   uuid not null references bookings(id) on delete cascade,
  menu_item_id uuid not null references menu_items(id) on delete set null,
  course       text not null check (course in ('starter','main','dessert','drink','extra')),
  quantity     integer not null default 1,
  guest_index  integer not null default 1
);

alter table booking_menu_selections enable row level security;

create policy "booking_menu_selections: owner can select"
  on booking_menu_selections for select
  using (booking_id in (select b.id from bookings b join business_settings bs on bs.id = b.business_id where bs.user_id = auth.uid()));

create policy "booking_menu_selections: public can insert"
  on booking_menu_selections for insert
  with check (true);

create policy "booking_menu_selections: public can select"
  on booking_menu_selections for select
  using (true);

create index if not exists idx_menu_categories_biz     on menu_categories(business_id);
create index if not exists idx_menu_items_category     on menu_items(category_id);
create index if not exists idx_menu_selections_booking on booking_menu_selections(booking_id);
