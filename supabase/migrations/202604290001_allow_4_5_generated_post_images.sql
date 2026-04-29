alter table public.generated_post_images
  drop constraint if exists generated_post_images_ratio_check;

alter table public.generated_post_images
  add constraint generated_post_images_ratio_check
  check (ratio in ('1:1', '4:5', '9:16'));
