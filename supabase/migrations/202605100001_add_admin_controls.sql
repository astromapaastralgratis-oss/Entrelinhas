alter table public.profiles
add column if not exists account_status text not null default 'active',
add column if not exists disabled_at timestamptz,
add column if not exists disabled_reason text;

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists public.user_script_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  daily_ai_script_limit int,
  updated_at timestamptz default now()
);

alter table public.app_settings enable row level security;
alter table public.user_script_limits enable row level security;

drop policy if exists "Users can read own script limit" on public.user_script_limits;
create policy "Users can read own script limit"
  on public.user_script_limits for select
  using (auth.uid() = user_id);

create index if not exists profiles_account_status_idx
  on public.profiles(account_status);

insert into public.app_settings(key, value)
values ('signup_limits', '{"max_active_users": null}'::jsonb)
on conflict (key) do nothing;
