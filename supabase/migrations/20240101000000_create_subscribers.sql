-- ─────────────────────────────────────────────────────────────────────────────
-- Weekly Digest: subscribers table
-- Run this in your Supabase SQL editor or via `supabase db push`
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.subscribers (
  id                uuid primary key default gen_random_uuid(),
  email             text not null unique,
  is_active         boolean not null default true,
  unsubscribe_token uuid not null default gen_random_uuid(),
  created_at        timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.subscribers enable row level security;

-- Allow the service role (used by the Edge Function) full access
create policy "service_role_full_access"
  on public.subscribers
  for all
  to service_role
  using (true)
  with check (true);

-- Allow anonymous INSERT only (for the subscribe form)
create policy "anon_insert"
  on public.subscribers
  for insert
  to anon
  with check (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Schedule the weekly digest via pg_cron (enable the pg_cron extension first
-- in Supabase Dashboard → Database → Extensions)
-- ─────────────────────────────────────────────────────────────────────────────

-- select cron.schedule(
--   'weekly-digest',
--   '0 8 * * 0',   -- Every Sunday at 08:00 UTC
--   $$
--   select net.http_post(
--     url := 'https://[YOUR_PROJECT_REF].supabase.co/functions/v1/send-weekly-digest',
--     headers := jsonb_build_object(
--       'Content-Type', 'application/json',
--       'Authorization', 'Bearer [YOUR_SERVICE_ROLE_KEY]'
--     )
--   );
--   $$
-- );
