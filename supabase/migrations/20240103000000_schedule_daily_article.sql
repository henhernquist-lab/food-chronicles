-- ─────────────────────────────────────────────────────────────────────────────
-- pg_cron schedules for daily article generation
--
-- HOW TO RUN:
--   1. Go to Supabase Dashboard → SQL Editor
--   2. Replace [YOUR-PROJECT-REF] with your actual project reference ID
--      (found in Project Settings → General → Reference ID)
--   3. Run this entire script
--
-- SCHEDULE:
--   Primary job  — 10:00 UTC = 06:00 AM Eastern Time
--   Retry job    — 10:30 UTC = 06:30 AM Eastern Time (only if primary failed)
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable pg_cron extension (already enabled in most Supabase projects)
-- create extension if not exists pg_cron;

-- ── Primary job: generate article at 06:00 AM Eastern ────────────────────────
select cron.schedule(
  'daily-food-article',
  '0 10 * * *',
  $$
  select net.http_post(
    url     := 'https://[YOUR-PROJECT-REF].supabase.co/functions/v1/generate-daily-article',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    ),
    body    := '{}'::jsonb
  ) as request_id;
  $$
);

-- ── Retry job: 06:30 AM Eastern — only fires if no success log exists today ──
select cron.schedule(
  'daily-article-retry',
  '30 10 * * *',
  $$
  select net.http_post(
    url     := 'https://[YOUR-PROJECT-REF].supabase.co/functions/v1/generate-daily-article',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    ),
    body    := '{"retry": true}'::jsonb
  )
  where not exists (
    select 1
    from   article_generation_logs
    where  success      = true
    and    attempted_at::date = current_date
  );
  $$
);

-- ── Verify schedules were created ────────────────────────────────────────────
-- select * from cron.job where jobname in ('daily-food-article', 'daily-article-retry');
