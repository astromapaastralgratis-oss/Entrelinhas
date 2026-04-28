alter table public.generated_posts
  add column if not exists prompt_tokens_estimate integer not null default 0,
  add column if not exists completion_tokens_estimate integer not null default 0,
  add column if not exists total_tokens_estimate integer not null default 0,
  add column if not exists estimated_cost numeric(10, 6) not null default 0;

create table if not exists public.ai_generation_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  generated_post_id uuid references public.generated_posts(id) on delete set null,
  generation_date date not null default current_date,
  model text not null,
  prompt_tokens_estimate integer not null default 0,
  completion_tokens_estimate integer not null default 0,
  total_tokens_estimate integer not null default 0,
  estimated_cost numeric(10, 6) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.user_generation_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  daily_cost_limit numeric(10, 6) not null default 1.00,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_generation_usage_user_date_idx
  on public.ai_generation_usage(user_id, generation_date desc);

alter table public.ai_generation_usage enable row level security;
alter table public.user_generation_limits enable row level security;

create policy "ai_generation_usage_select_own" on public.ai_generation_usage for select using (auth.uid() = user_id);
create policy "ai_generation_usage_insert_own" on public.ai_generation_usage for insert with check (auth.uid() = user_id);
create policy "ai_generation_usage_update_own" on public.ai_generation_usage for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ai_generation_usage_delete_own" on public.ai_generation_usage for delete using (auth.uid() = user_id);

create policy "user_generation_limits_select_own" on public.user_generation_limits for select using (auth.uid() = user_id);
create policy "user_generation_limits_insert_own" on public.user_generation_limits for insert with check (auth.uid() = user_id);
create policy "user_generation_limits_update_own" on public.user_generation_limits for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_generation_limits_delete_own" on public.user_generation_limits for delete using (auth.uid() = user_id);
