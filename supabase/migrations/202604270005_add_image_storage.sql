insert into storage.buckets (id, name, public)
values
  ('posts', 'posts', true),
  ('stories', 'stories', true),
  ('carousels', 'carousels', true),
  ('reels-covers', 'reels-covers', true),
  ('exports', 'exports', true)
on conflict (id) do nothing;

alter table public.generated_posts
  drop constraint if exists generated_posts_export_status_check;

alter table public.generated_posts
  add constraint generated_posts_export_status_check
  check (export_status in ('not_exported', 'ready', 'image_generated', 'exported', 'failed'));

create table if not exists public.generated_post_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  generated_post_id uuid not null references public.generated_posts(id) on delete cascade,
  format text not null check (format in ('feed', 'carrossel', 'stories', 'reels', 'tiktok')),
  ratio text not null check (ratio in ('1:1', '9:16')),
  card_index integer not null default 1,
  bucket text not null,
  storage_path text not null,
  image_url text not null,
  prompt text not null,
  negative_prompt text not null,
  provider text not null,
  estimated_cost numeric(10, 6) not null default 0,
  export_status text not null default 'image_generated' check (export_status in ('not_exported', 'ready', 'image_generated', 'exported', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.generated_post_images enable row level security;

create policy "generated_post_images_select_own" on public.generated_post_images for select using (auth.uid() = user_id);
create policy "generated_post_images_insert_own" on public.generated_post_images for insert with check (auth.uid() = user_id);
create policy "generated_post_images_update_own" on public.generated_post_images for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "generated_post_images_delete_own" on public.generated_post_images for delete using (auth.uid() = user_id);

create index if not exists generated_post_images_post_idx on public.generated_post_images(generated_post_id, card_index);
create index if not exists generated_post_images_user_created_idx on public.generated_post_images(user_id, created_at desc);

create policy "storage_read_public_astral_assets"
  on storage.objects for select
  using (bucket_id in ('posts', 'stories', 'carousels', 'reels-covers', 'exports'));

create policy "storage_insert_own_astral_assets"
  on storage.objects for insert
  with check (
    bucket_id in ('posts', 'stories', 'carousels', 'reels-covers', 'exports')
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage_update_own_astral_assets"
  on storage.objects for update
  using (
    bucket_id in ('posts', 'stories', 'carousels', 'reels-covers', 'exports')
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id in ('posts', 'stories', 'carousels', 'reels-covers', 'exports')
    and auth.uid()::text = (storage.foldername(name))[1]
  );
