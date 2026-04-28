create table if not exists public.automation_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  daily_generation_limit integer not null default 12,
  weekly_generation_limit integer not null default 60,
  monthly_cost_limit numeric(10, 2) not null default 50,
  mode text not null default 'economico' check (mode in ('economico', 'padrao', 'crescimento')),
  automatic_generation_enabled boolean not null default false,
  locked_weekly_themes text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.generation_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cache_key text not null,
  mode text not null check (mode in ('economico', 'padrao', 'crescimento')),
  plan_fingerprint text not null,
  generated_payload jsonb not null,
  prompt_tokens_estimate integer not null default 0,
  completion_tokens_estimate integer not null default 0,
  total_tokens_estimate integer not null default 0,
  estimated_cost numeric(10, 6) not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, cache_key)
);

alter table public.automation_settings enable row level security;
alter table public.generation_cache enable row level security;

drop policy if exists "Users manage own automation settings" on public.automation_settings;
create policy "Users manage own automation settings"
  on public.automation_settings
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own generation cache" on public.generation_cache;
create policy "Users manage own generation cache"
  on public.generation_cache
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists generation_cache_user_mode_idx
  on public.generation_cache(user_id, mode, created_at desc);
