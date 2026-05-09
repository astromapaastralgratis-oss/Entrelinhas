create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  "current_role" text,
  industry text,
  career_goal text,
  preferred_style text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.generated_scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  situation text not null,
  context text,
  desired_outcome text,
  people_involved text,
  tone text,
  ai_response text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  situation text,
  tone text,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.generated_scripts enable row level security;
alter table public.saved_scripts enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can read own generated scripts" on public.generated_scripts;
create policy "Users can read own generated scripts"
  on public.generated_scripts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own generated scripts" on public.generated_scripts;
create policy "Users can insert own generated scripts"
  on public.generated_scripts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own saved scripts" on public.saved_scripts;
create policy "Users can read own saved scripts"
  on public.saved_scripts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own saved scripts" on public.saved_scripts;
create policy "Users can insert own saved scripts"
  on public.saved_scripts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own saved scripts" on public.saved_scripts;
create policy "Users can update own saved scripts"
  on public.saved_scripts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own saved scripts" on public.saved_scripts;
create policy "Users can delete own saved scripts"
  on public.saved_scripts for delete
  using (auth.uid() = user_id);

create index if not exists generated_scripts_user_created_idx on public.generated_scripts(user_id, created_at desc);
create index if not exists saved_scripts_user_created_idx on public.saved_scripts(user_id, created_at desc);
