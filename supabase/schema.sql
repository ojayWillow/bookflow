-- BookFlow Database Schema
-- Run this in your Supabase SQL editor: Dashboard → SQL Editor → New query

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- SERVICES
-- ─────────────────────────────────────────
create table if not exists services (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text not null default '',
  duration    integer not null default 60,  -- minutes
  price       numeric(10,2) not null default 0,
  currency    text not null default 'EUR',
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- STAFF
-- ─────────────────────────────────────────
create table if not exists staff (
  id          uuid primary key default uuid_generate_v4(),
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

-- ─────────────────────────────────────────
-- BUSINESS SETTINGS
-- ─────────────────────────────────────────
create table if not exists business_settings (
  id                   uuid primary key default uuid_generate_v4(),
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
  created_at           timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────
create table if not exists bookings (
  id                uuid primary key default uuid_generate_v4(),
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

-- ─────────────────────────────────────────
-- SEED — Default business settings
-- ─────────────────────────────────────────
insert into business_settings (
  name, tagline, address, phone, email, currency,
  open_days, open_time, close_time, slot_interval,
  lead_time_hours, max_advance_days, cancellation_policy, primary_color, slug
) values (
  'Glow Beauty Studio',
  'Premium beauty & wellness services in the heart of Riga',
  'Brīvības iela 45, Rīga, LV-1010',
  '+371 2612 3456',
  'hello@glowbeauty.lv',
  'EUR',
  '{1,2,3,4,5,6}',
  '09:00',
  '19:00',
  30,
  2,
  30,
  'Free cancellation up to 24 hours before your appointment.',
  '#6366f1',
  'demo'
) on conflict (slug) do nothing;

-- ─────────────────────────────────────────
-- SEED — Services
-- ─────────────────────────────────────────
insert into services (name, description, duration, price) values
  ('Classic Manicure', 'Shape, buff and polish for perfect nails', 45, 25),
  ('Gel Manicure', 'Long-lasting gel colour with UV finish', 60, 35),
  ('Full Body Wax', 'Smooth skin from head to toe', 90, 65),
  ('Eyebrow Shaping', 'Define and sculpt your brows', 30, 18),
  ('Lash Lift & Tint', 'Natural lash enhancement that lasts 6-8 weeks', 60, 45),
  ('Classic Facial', 'Deep cleanse, exfoliation and hydration mask', 60, 55)
on conflict do nothing;
