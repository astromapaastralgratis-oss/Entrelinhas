alter table public.generation_history
  add column if not exists provider_used text,
  add column if not exists model_used text,
  add column if not exists fallback_used boolean not null default false,
  add column if not exists error_message text;

alter table public.ai_generation_usage
  add column if not exists provider_used text,
  add column if not exists fallback_used boolean not null default false,
  add column if not exists error_message text;

create index if not exists generation_history_user_provider_created_idx
  on public.generation_history(user_id, provider_used, created_at desc);

create index if not exists ai_generation_usage_user_provider_date_idx
  on public.ai_generation_usage(user_id, provider_used, generation_date desc);
