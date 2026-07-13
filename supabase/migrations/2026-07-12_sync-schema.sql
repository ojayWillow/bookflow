-- Migration: sync live DB with application code (2026-07-12)
-- Run in Supabase Dashboard → SQL Editor. Safe to re-run (idempotent).
--
-- Adds columns the app already reads/writes but which were missing
-- from schema.sql, and drops the unused booking_menu_selections table
-- (preorders are stored on bookings.preorder_items as jsonb instead).

-- bookings: restaurant preorders — { "<menu_item_id>": quantity }
alter table bookings        add column if not exists preorder_items jsonb not null default '{}'::jsonb;

-- staff: avatar + lunch-break window (HH:MM, null = no break)
alter table staff           add column if not exists avatar_url  text;
alter table staff           add column if not exists break_start text;
alter table staff           add column if not exists break_end   text;

-- menu_categories: description + image shown in the booking preorder step
alter table menu_categories add column if not exists description text not null default '';
alter table menu_categories add column if not exists image_url   text not null default '';

-- Dead table — never read or written by the app (replaced by bookings.preorder_items)
drop table if exists booking_menu_selections;

-- ─────────────────────────────────────────────────────────────
-- MANUAL STEP (once, not SQL):
-- Create a PUBLIC storage bucket named 'business-assets'
-- (Dashboard → Storage → New bucket → Public).
-- Required by /api/upload-asset (logo/cover) and staff avatar upload.
-- ─────────────────────────────────────────────────────────────
