create unique index if not exists content_calendar_no_duplicate_plan_item
on public.content_calendar (user_id, date, moment_of_day, platform);

create table if not exists public.performance_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  published_date date not null,
  format text not null,
  platform text not null,
  theme text not null,
  science_base text not null,
  objective text not null,
  visual_style text,
  views integer not null default 0,
  likes integer not null default 0,
  comments integer not null default 0,
  saves integer not null default 0,
  shares integer not null default 0,
  new_followers integer not null default 0,
  bio_clicks integer not null default 0,
  qualitative_note text,
  performance_score numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.operation_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  event text not null,
  message text not null,
  level text not null default 'info',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.performance_metrics enable row level security;
alter table public.operation_logs enable row level security;

drop policy if exists "performance_metrics_own" on public.performance_metrics;
create policy "performance_metrics_own"
on public.performance_metrics for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "operation_logs_own" on public.operation_logs;
create policy "operation_logs_own"
on public.operation_logs for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
