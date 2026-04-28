create extension if not exists "pgcrypto";

create table if not exists public.content_calendar (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  moment_of_day text not null check (moment_of_day in ('manhã', 'tarde', 'noite')),
  platform text not null check (platform in ('instagram', 'tiktok')),
  format text not null check (format in ('feed', 'carrossel', 'stories', 'reels', 'tiktok')),
  objective text not null check (objective in ('ganhar seguidores', 'engajar', 'levar para app', 'educar', 'gerar autoridade')),
  science_base text not null check (science_base in ('astrologia', 'tarot', 'numerologia', 'elemento', 'cor', 'cristal', 'energia emocional', 'trânsito astral')),
  theme text not null,
  hook_type text not null check (hook_type in ('identificação emocional', 'verdade desconfortável', 'quebra de padrão', 'curiosidade', 'pergunta direta', 'microensinamento', 'alerta simbólico')),
  cta_type text not null check (cta_type in ('seguir página', 'salvar', 'compartilhar', 'comentar', 'acessar link na bio', 'gerar relatório no app')),
  strategic_reason text not null,
  status text not null default 'planned' check (status in ('planned', 'drafted', 'approved', 'exported', 'published', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.visual_styles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  background text not null,
  palette jsonb not null default '[]'::jsonb,
  elements jsonb not null default '[]'::jsonb,
  typography text not null,
  mood text not null,
  prompt_fragment text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.generated_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  calendar_id uuid references public.content_calendar(id) on delete set null,
  date date not null,
  moment_of_day text not null check (moment_of_day in ('manhã', 'tarde', 'noite')),
  platform text not null check (platform in ('instagram', 'tiktok')),
  format text not null check (format in ('feed', 'carrossel', 'stories', 'reels', 'tiktok')),
  objective text not null check (objective in ('ganhar seguidores', 'engajar', 'levar para app', 'educar', 'gerar autoridade')),
  science_base text not null check (science_base in ('astrologia', 'tarot', 'numerologia', 'elemento', 'cor', 'cristal', 'energia emocional', 'trânsito astral')),
  theme text not null,
  hook_type text not null check (hook_type in ('identificação emocional', 'verdade desconfortável', 'quebra de padrão', 'curiosidade', 'pergunta direta', 'microensinamento', 'alerta simbólico')),
  title text,
  subtitle text,
  body text,
  caption text,
  hashtags text[] not null default '{}',
  cta text,
  pinned_comment text,
  image_prompt text,
  visual_style_id uuid references public.visual_styles(id) on delete set null,
  image_url text,
  export_status text not null default 'not_exported' check (export_status in ('not_exported', 'ready', 'exported', 'failed')),
  created_at timestamptz not null default now()
);

create table if not exists public.content_themes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  science_base text not null check (science_base in ('astrologia', 'tarot', 'numerologia', 'elemento', 'cor', 'cristal', 'energia emocional', 'trânsito astral')),
  emotional_angle text not null,
  recommended_formats text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.ctas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('seguir página', 'salvar', 'compartilhar', 'comentar', 'acessar link na bio', 'gerar relatório no app')),
  text text not null,
  objective text not null check (objective in ('ganhar seguidores', 'engajar', 'levar para app', 'educar', 'gerar autoridade')),
  intensity text not null check (intensity in ('leve', 'padrão', 'intensa')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.generation_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  generated_post_id uuid references public.generated_posts(id) on delete cascade,
  format text not null check (format in ('feed', 'carrossel', 'stories', 'reels', 'tiktok')),
  objective text not null check (objective in ('ganhar seguidores', 'engajar', 'levar para app', 'educar', 'gerar autoridade')),
  science_base text not null check (science_base in ('astrologia', 'tarot', 'numerologia', 'elemento', 'cor', 'cristal', 'energia emocional', 'trânsito astral')),
  theme text not null,
  hook_type text not null check (hook_type in ('identificação emocional', 'verdade desconfortável', 'quebra de padrão', 'curiosidade', 'pergunta direta', 'microensinamento', 'alerta simbólico')),
  cta_type text not null check (cta_type in ('seguir página', 'salvar', 'compartilhar', 'comentar', 'acessar link na bio', 'gerar relatório no app')),
  created_at timestamptz not null default now()
);

create index if not exists content_calendar_user_date_idx on public.content_calendar(user_id, date desc);
create index if not exists content_calendar_user_date_moment_idx on public.content_calendar(user_id, date, moment_of_day);
create index if not exists generated_posts_user_date_idx on public.generated_posts(user_id, date desc);
create index if not exists generated_posts_calendar_idx on public.generated_posts(calendar_id);
create index if not exists generation_history_user_created_idx on public.generation_history(user_id, created_at desc);
create index if not exists generation_history_user_theme_created_idx on public.generation_history(user_id, theme, created_at desc);
create index if not exists ctas_user_active_idx on public.ctas(user_id, active) where active = true;
create index if not exists content_themes_user_active_idx on public.content_themes(user_id, active) where active = true;
create index if not exists visual_styles_user_active_idx on public.visual_styles(user_id, active) where active = true;

alter table public.content_calendar enable row level security;
alter table public.generated_posts enable row level security;
alter table public.content_themes enable row level security;
alter table public.visual_styles enable row level security;
alter table public.ctas enable row level security;
alter table public.generation_history enable row level security;

create policy "content_calendar_select_own" on public.content_calendar for select using (auth.uid() = user_id);
create policy "content_calendar_insert_own" on public.content_calendar for insert with check (auth.uid() = user_id);
create policy "content_calendar_update_own" on public.content_calendar for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "content_calendar_delete_own" on public.content_calendar for delete using (auth.uid() = user_id);

create policy "generated_posts_select_own" on public.generated_posts for select using (auth.uid() = user_id);
create policy "generated_posts_insert_own" on public.generated_posts for insert with check (auth.uid() = user_id);
create policy "generated_posts_update_own" on public.generated_posts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "generated_posts_delete_own" on public.generated_posts for delete using (auth.uid() = user_id);

create policy "content_themes_select_own" on public.content_themes for select using (auth.uid() = user_id);
create policy "content_themes_insert_own" on public.content_themes for insert with check (auth.uid() = user_id);
create policy "content_themes_update_own" on public.content_themes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "content_themes_delete_own" on public.content_themes for delete using (auth.uid() = user_id);

create policy "visual_styles_select_own" on public.visual_styles for select using (auth.uid() = user_id);
create policy "visual_styles_insert_own" on public.visual_styles for insert with check (auth.uid() = user_id);
create policy "visual_styles_update_own" on public.visual_styles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "visual_styles_delete_own" on public.visual_styles for delete using (auth.uid() = user_id);

create policy "ctas_select_own" on public.ctas for select using (auth.uid() = user_id);
create policy "ctas_insert_own" on public.ctas for insert with check (auth.uid() = user_id);
create policy "ctas_update_own" on public.ctas for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ctas_delete_own" on public.ctas for delete using (auth.uid() = user_id);

create policy "generation_history_select_own" on public.generation_history for select using (auth.uid() = user_id);
create policy "generation_history_insert_own" on public.generation_history for insert with check (auth.uid() = user_id);
create policy "generation_history_update_own" on public.generation_history for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "generation_history_delete_own" on public.generation_history for delete using (auth.uid() = user_id);
