alter table public.generated_scripts
  add column if not exists generation_mode text,
  add column if not exists fallback_used boolean default false,
  add column if not exists prompt_tokens_estimate int,
  add column if not exists completion_tokens_estimate int,
  add column if not exists total_tokens_estimate int;
