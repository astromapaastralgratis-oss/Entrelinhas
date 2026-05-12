create table if not exists public.executive_presence_feedback (
  id uuid primary key default gen_random_uuid(),
  result_id uuid not null references public.executive_presence_results(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  most_real_part text,
  generic_part text,
  would_share boolean,
  would_return boolean,
  created_at timestamptz not null default now()
);

alter table public.executive_presence_feedback enable row level security;

drop policy if exists "Users can read own executive presence feedback" on public.executive_presence_feedback;
create policy "Users can read own executive presence feedback"
  on public.executive_presence_feedback for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own executive presence feedback" on public.executive_presence_feedback;
create policy "Users can insert own executive presence feedback"
  on public.executive_presence_feedback for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.executive_presence_results result
      where result.id = result_id
        and result.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update own executive presence feedback" on public.executive_presence_feedback;
create policy "Users can update own executive presence feedback"
  on public.executive_presence_feedback for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.executive_presence_results result
      where result.id = result_id
        and result.user_id = auth.uid()
    )
  );

create unique index if not exists executive_presence_feedback_result_user_idx
  on public.executive_presence_feedback(result_id, user_id);

create index if not exists executive_presence_feedback_user_created_idx
  on public.executive_presence_feedback(user_id, created_at desc);
