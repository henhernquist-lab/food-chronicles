-- ─────────────────────────────────────────────────────────────────────────────
-- article_generation_logs
-- Tracks every attempt to auto-generate a daily article.
-- Used by the 06:30 AM retry cron job to skip if today already succeeded.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists article_generation_logs (
  id                   uuid        primary key default gen_random_uuid(),
  attempted_at         timestamptz default now(),
  success              boolean     not null,
  article_title        text,
  food_name            text,
  error_message        text,
  subscribers_notified integer     default 0
);

-- Index for the retry job's date check
create index if not exists idx_gen_logs_attempted_at
  on article_generation_logs (attempted_at desc);

-- Index for quick success lookups
create index if not exists idx_gen_logs_success
  on article_generation_logs (success, attempted_at desc);
