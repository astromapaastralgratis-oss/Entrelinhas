alter table public.generation_history
  add column if not exists prompt_tokens_estimate integer not null default 0,
  add column if not exists completion_tokens_estimate integer not null default 0,
  add column if not exists total_tokens_estimate integer not null default 0,
  add column if not exists estimated_cost numeric(10, 6) not null default 0,
  add column if not exists generation_source text not null default 'unknown';

create index if not exists generation_history_user_cost_idx
  on public.generation_history(user_id, created_at desc, estimated_cost);
