alter table public.executive_presence_results
add column if not exists methodology_version text,
add column if not exists subdimension_scores jsonb,
add column if not exists executive_dynamic_scores jsonb,
add column if not exists trait_intensities jsonb,
add column if not exists behavior_signals jsonb,
add column if not exists conditional_insights jsonb,
add column if not exists context_snapshot jsonb;

alter table public.profiles
add column if not exists seniority text,
add column if not exists main_challenge text;
