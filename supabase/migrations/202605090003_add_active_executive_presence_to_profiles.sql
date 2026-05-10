alter table public.profiles
add column if not exists active_executive_presence_result_id uuid references public.executive_presence_results(id) on delete set null,
add column if not exists executive_presence_profile_id text,
add column if not exists executive_presence_completed_at timestamptz;

create index if not exists profiles_active_executive_presence_idx
  on public.profiles(active_executive_presence_result_id);
