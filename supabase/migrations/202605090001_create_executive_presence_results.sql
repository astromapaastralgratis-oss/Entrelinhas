create table if not exists public.executive_presence_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id text not null,
  primary_trait text not null,
  secondary_trait text,
  confidence_level text,
  scores jsonb not null,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.executive_presence_results enable row level security;

drop policy if exists "Users can read own executive presence results" on public.executive_presence_results;
create policy "Users can read own executive presence results"
  on public.executive_presence_results for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own executive presence results" on public.executive_presence_results;
create policy "Users can insert own executive presence results"
  on public.executive_presence_results for insert
  with check (auth.uid() = user_id);

create index if not exists executive_presence_results_user_created_idx
  on public.executive_presence_results(user_id, created_at desc);
