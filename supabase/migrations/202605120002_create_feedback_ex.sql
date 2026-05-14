drop table if exists public._x_beta_feedback cascade;
drop table if exists public.raio_x_beta_feedback cascade;
drop table if exists public.raiox_feedback cascade;

create table if not exists public.feedback_ex (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  result_id uuid not null references public.executive_presence_results(id) on delete cascade,
  profile_id text not null,
  personalization_rating text,
  depth_rating text,
  would_share text,
  would_return text,
  tone_rating text,
  most_real_part text,
  generic_part text,
  improvement_suggestion text,
  methodology_version text,
  created_at timestamptz not null default now(),
  constraint feedback_ex_personalization_check
    check (personalization_rating is null or personalization_rating in ('sim_muito', 'em_partes', 'pouco', 'nao')),
  constraint feedback_ex_depth_check
    check (depth_rating is null or depth_rating in ('superficial', 'adequado', 'profundo', 'profundo_demais_confuso')),
  constraint feedback_ex_share_check
    check (would_share is null or would_share in ('sim', 'talvez', 'nao')),
  constraint feedback_ex_return_check
    check (would_return is null or would_return in ('sim', 'talvez', 'nao')),
  constraint feedback_ex_tone_check
    check (tone_rating is null or tone_rating in ('humano_sofisticado', 'um_pouco_generico', 'muito_tecnico', 'muito_emocional'))
);

alter table public.feedback_ex enable row level security;

drop policy if exists "Users can read own feedback ex" on public.feedback_ex;
create policy "Users can read own feedback ex"
  on public.feedback_ex for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own feedback ex" on public.feedback_ex;
create policy "Users can insert own feedback ex"
  on public.feedback_ex for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.executive_presence_results results
      where results.id = result_id
        and results.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update own feedback ex" on public.feedback_ex;
create policy "Users can update own feedback ex"
  on public.feedback_ex for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.executive_presence_results results
      where results.id = result_id
        and results.user_id = auth.uid()
    )
  );

create unique index if not exists feedback_ex_result_user_idx
  on public.feedback_ex(result_id, user_id);

create index if not exists feedback_ex_created_idx
  on public.feedback_ex(created_at desc);

create index if not exists feedback_ex_user_created_idx
  on public.feedback_ex(user_id, created_at desc);
