create extension if not exists "pgcrypto";

create type public.current_status as enum (
  'ocupado',
  'vazio',
  'em-disputa',
  'uso-institucional'
);

create type public.criticality as enum (
  'alta',
  'media',
  'baixa'
);

create type public.property_type as enum (
  'clube',
  'galpao',
  'casa-tecnica',
  'terreno',
  'outro'
);

create type public.report_type as enum (
  'relato',
  'foto',
  'documento',
  'denuncia',
  'memoria'
);

create type public.app_role as enum (
  'admin',
  'moderador',
  'colaborador'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.neighborhoods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  neighborhood_id uuid not null references public.neighborhoods(id) on delete restrict,
  slug text not null unique,
  title text not null,
  address text not null,
  excerpt text,
  description text,
  current_use text,
  area_estimate text,
  current_status public.current_status not null,
  criticality public.criticality not null,
  property_type public.property_type not null default 'outro',
  latitude double precision not null,
  longitude double precision not null,
  legal_notes text[] not null default '{}',
  tags text[] not null default '{}',
  is_public boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint properties_latitude_range check (latitude between -90 and 90),
  constraint properties_longitude_range check (longitude between -180 and 180)
);

create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  image_url text not null,
  alt_text text not null,
  credit text,
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.property_documents (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  title text not null,
  summary text,
  document_url text,
  document_type text not null,
  published_year integer,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint property_documents_published_year_check check (
    published_year is null or published_year between 1800 and 2100
  )
);

create table public.property_timeline (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  event_year integer,
  title text not null,
  description text not null,
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint property_timeline_event_year_check check (
    event_year is null or event_year between 1800 and 2100
  )
);

create table public.property_actions (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  title text not null,
  kind text not null check (kind in ('abaixo-assinado', 'ato', 'oficina', 'mutirao')),
  cta_label text not null,
  href text not null,
  description text,
  position integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.reuse_proposals (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  title text not null,
  description text not null,
  supporters_count integer not null default 0 check (supporters_count >= 0),
  is_public boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'colaborador',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.property_reports (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  profile_id uuid references public.profiles(id) on delete set null,
  report_type public.report_type not null default 'relato',
  author_name text,
  contact text,
  title text,
  content text not null,
  source_url text,
  moderation_status text not null default 'pendente' check (moderation_status in ('pendente', 'aprovado', 'rejeitado')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index properties_slug_idx on public.properties (slug);
create index properties_neighborhood_id_idx on public.properties (neighborhood_id);
create index properties_current_status_idx on public.properties (current_status);
create index properties_criticality_idx on public.properties (criticality);
create index properties_public_listing_idx on public.properties (is_public, neighborhood_id, current_status, criticality);

create index property_images_property_id_idx on public.property_images (property_id, position);
create index property_documents_property_id_idx on public.property_documents (property_id);
create index property_timeline_property_id_idx on public.property_timeline (property_id, position);
create index property_reports_property_id_idx on public.property_reports (property_id, moderation_status, created_at desc);
create index property_reports_profile_id_idx on public.property_reports (profile_id);
create index property_actions_property_id_idx on public.property_actions (property_id, position);
create index reuse_proposals_property_id_idx on public.reuse_proposals (property_id, supporters_count desc);
create index neighborhoods_slug_idx on public.neighborhoods (slug);
create index profiles_role_idx on public.profiles (role);

create trigger set_neighborhoods_updated_at
before update on public.neighborhoods
for each row
execute function public.set_updated_at();

create trigger set_properties_updated_at
before update on public.properties
for each row
execute function public.set_updated_at();

create trigger set_property_images_updated_at
before update on public.property_images
for each row
execute function public.set_updated_at();

create trigger set_property_documents_updated_at
before update on public.property_documents
for each row
execute function public.set_updated_at();

create trigger set_property_timeline_updated_at
before update on public.property_timeline
for each row
execute function public.set_updated_at();

create trigger set_property_reports_updated_at
before update on public.property_reports
for each row
execute function public.set_updated_at();

create trigger set_property_actions_updated_at
before update on public.property_actions
for each row
execute function public.set_updated_at();

create trigger set_reuse_proposals_updated_at
before update on public.reuse_proposals
for each row
execute function public.set_updated_at();

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

alter table public.neighborhoods enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.property_documents enable row level security;
alter table public.property_timeline enable row level security;
alter table public.property_reports enable row level security;
alter table public.property_actions enable row level security;
alter table public.reuse_proposals enable row level security;
alter table public.profiles enable row level security;

create policy "public can read neighborhoods"
on public.neighborhoods
for select
to anon, authenticated
using (true);

create policy "public can read public properties"
on public.properties
for select
to anon, authenticated
using (is_public = true);

create policy "public can read property images"
on public.property_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.properties
    where properties.id = property_images.property_id
      and properties.is_public = true
  )
);

create policy "public can read property documents"
on public.property_documents
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.properties
    where properties.id = property_documents.property_id
      and properties.is_public = true
  )
);

create policy "public can read property timeline"
on public.property_timeline
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.properties
    where properties.id = property_timeline.property_id
      and properties.is_public = true
  )
);

create policy "public can read approved property reports"
on public.property_reports
for select
to anon, authenticated
using (
  moderation_status = 'aprovado'
  and (
    property_id is null
    or exists (
      select 1
      from public.properties
      where properties.id = property_reports.property_id
        and properties.is_public = true
    )
  )
);

create policy "public can read property actions"
on public.property_actions
for select
to anon, authenticated
using (
  is_public = true
  and exists (
    select 1
    from public.properties
    where properties.id = property_actions.property_id
      and properties.is_public = true
  )
);

create policy "public can read reuse proposals"
on public.reuse_proposals
for select
to anon, authenticated
using (
  is_public = true
  and exists (
    select 1
    from public.properties
    where properties.id = reuse_proposals.property_id
      and properties.is_public = true
  )
);

create policy "authenticated users can read their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "authenticated users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "authenticated users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
