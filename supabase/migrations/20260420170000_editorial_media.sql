alter table public.property_images
  add column if not exists caption text,
  add column if not exists storage_path text,
  add column if not exists is_public boolean not null default true,
  add column if not exists is_cover boolean not null default false;

alter table public.property_documents
  add column if not exists position integer not null default 0,
  add column if not exists storage_path text,
  add column if not exists file_name text,
  add column if not exists source_url text;

create index if not exists property_images_featured_idx on public.property_images (property_id, is_cover desc, position asc);
create index if not exists property_documents_property_id_public_idx on public.property_documents (property_id, is_public, position asc);

insert into storage.buckets (id, name, public)
values
  ('property-images', 'property-images', true),
  ('property-docs', 'property-docs', false)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public;
