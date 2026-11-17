begin;

alter table public.exercises
  add column if not exists instructions text,
  add column if not exists video_url text,
  add column if not exists photo_path text,
  add column if not exists default_sets integer,
  add column if not exists default_reps text,
  add column if not exists default_load numeric,
  add column if not exists default_rest integer;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'exercise-photos', 'exercise-photos', false, 8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'gymflow_exercise_photos_owner'
  ) then
    create policy gymflow_exercise_photos_owner on storage.objects
      for all to authenticated
      using (
        bucket_id = 'exercise-photos'
        and (storage.foldername(name))[1] = (select auth.uid())::text
      )
      with check (
        bucket_id = 'exercise-photos'
        and (storage.foldername(name))[1] = (select auth.uid())::text
      );
  end if;
end;
$$;

commit;
