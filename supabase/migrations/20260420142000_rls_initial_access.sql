create type public.access_role as enum (
  'visitor',
  'contributor',
  'moderator',
  'admin'
);

alter table public.profiles
  alter column role drop default;

alter table public.profiles
  alter column role type public.access_role
  using case role::text
    when 'admin' then 'admin'
    when 'moderador' then 'moderator'
    when 'colaborador' then 'contributor'
    else 'visitor'
  end::public.access_role;

alter table public.profiles
  alter column role set default 'contributor';

alter table public.property_documents
  add column if not exists is_public boolean not null default false;

create or replace function public.current_access_role()
returns public.access_role
language sql
stable
as $$
  select coalesce(
    (
      select p.role
      from public.profiles p
      where p.id = auth.uid()
    ),
    'visitor'::public.access_role
  );
$$;

create or replace function public.can_moderate()
returns boolean
language sql
stable
as $$
  select public.current_access_role() in ('moderator', 'admin');
$$;

create or replace function public.can_admin()
returns boolean
language sql
stable
as $$
  select public.current_access_role() = 'admin';
$$;

drop policy if exists "public can read neighborhoods" on public.neighborhoods;
drop policy if exists "public can read public properties" on public.properties;
drop policy if exists "public can read property images" on public.property_images;
drop policy if exists "public can read property documents" on public.property_documents;
drop policy if exists "public can read property timeline" on public.property_timeline;
drop policy if exists "public can read approved property reports" on public.property_reports;
drop policy if exists "public can read property actions" on public.property_actions;
drop policy if exists "public can read reuse proposals" on public.reuse_proposals;
drop policy if exists "authenticated users can read their own profile" on public.profiles;
drop policy if exists "authenticated users can insert their own profile" on public.profiles;
drop policy if exists "authenticated users can update their own profile" on public.profiles;

create policy "public can read neighborhoods"
on public.neighborhoods
for select
to anon, authenticated
using (true);

create policy "admins manage neighborhoods"
on public.neighborhoods
for insert
to authenticated
with check (public.can_admin());

create policy "admins update neighborhoods"
on public.neighborhoods
for update
to authenticated
using (public.can_admin())
with check (public.can_admin());

create policy "admins delete neighborhoods"
on public.neighborhoods
for delete
to authenticated
using (public.can_admin());

create policy "public can read published properties"
on public.properties
for select
to anon, authenticated
using (is_public = true);

create policy "moderators and admins read all properties"
on public.properties
for select
to authenticated
using (public.can_moderate());

create policy "moderators and admins manage properties"
on public.properties
for insert
to authenticated
with check (public.can_moderate());

create policy "moderators and admins update properties"
on public.properties
for update
to authenticated
using (public.can_moderate())
with check (public.can_moderate());

create policy "moderators and admins delete properties"
on public.properties
for delete
to authenticated
using (public.can_moderate());

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

create policy "moderators and admins read property images"
on public.property_images
for select
to authenticated
using (public.can_moderate());

create policy "moderators and admins manage property images"
on public.property_images
for insert
to authenticated
with check (public.can_moderate());

create policy "moderators and admins update property images"
on public.property_images
for update
to authenticated
using (public.can_moderate())
with check (public.can_moderate());

create policy "moderators and admins delete property images"
on public.property_images
for delete
to authenticated
using (public.can_moderate());

create policy "public can read published property documents"
on public.property_documents
for select
to anon, authenticated
using (
  is_public = true
  and exists (
    select 1
    from public.properties
    where properties.id = property_documents.property_id
      and properties.is_public = true
  )
);

create policy "moderators and admins read property documents"
on public.property_documents
for select
to authenticated
using (public.can_moderate());

create policy "moderators and admins manage property documents"
on public.property_documents
for insert
to authenticated
with check (public.can_moderate());

create policy "moderators and admins update property documents"
on public.property_documents
for update
to authenticated
using (public.can_moderate())
with check (public.can_moderate());

create policy "moderators and admins delete property documents"
on public.property_documents
for delete
to authenticated
using (public.can_moderate());

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

create policy "moderators and admins read property timeline"
on public.property_timeline
for select
to authenticated
using (public.can_moderate());

create policy "moderators and admins manage property timeline"
on public.property_timeline
for insert
to authenticated
with check (public.can_moderate());

create policy "moderators and admins update property timeline"
on public.property_timeline
for update
to authenticated
using (public.can_moderate())
with check (public.can_moderate());

create policy "moderators and admins delete property timeline"
on public.property_timeline
for delete
to authenticated
using (public.can_moderate());

create policy "public can read approved property reports"
on public.property_reports
for select
to anon, authenticated
using (
  moderation_status = 'aprovado'
  and property_id is not null
  and exists (
    select 1
    from public.properties
    where properties.id = property_reports.property_id
      and properties.is_public = true
  )
);

create policy "authenticated users can read own reports"
on public.property_reports
for select
to authenticated
using (profile_id = auth.uid());

create policy "moderators and admins read all reports"
on public.property_reports
for select
to authenticated
using (public.can_moderate());

create policy "authenticated users can submit reports"
on public.property_reports
for insert
to authenticated
with check (
  moderation_status = 'pendente'
  and (profile_id is null or profile_id = auth.uid())
);

create policy "report authors can update pending reports"
on public.property_reports
for update
to authenticated
using (profile_id = auth.uid() and moderation_status = 'pendente')
with check (profile_id = auth.uid() and moderation_status = 'pendente');

create policy "moderators and admins moderate reports"
on public.property_reports
for update
to authenticated
using (public.can_moderate())
with check (public.can_moderate());

create policy "moderators and admins manage property actions"
on public.property_actions
for select
to authenticated
using (public.can_moderate());

create policy "public can read published property actions"
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

create policy "moderators and admins create property actions"
on public.property_actions
for insert
to authenticated
with check (public.can_moderate());

create policy "moderators and admins update property actions"
on public.property_actions
for update
to authenticated
using (public.can_moderate())
with check (public.can_moderate());

create policy "moderators and admins delete property actions"
on public.property_actions
for delete
to authenticated
using (public.can_moderate());

create policy "public can read published reuse proposals"
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

create policy "moderators and admins read reuse proposals"
on public.reuse_proposals
for select
to authenticated
using (public.can_moderate());

create policy "moderators and admins manage reuse proposals"
on public.reuse_proposals
for insert
to authenticated
with check (public.can_moderate());

create policy "moderators and admins update reuse proposals"
on public.reuse_proposals
for update
to authenticated
using (public.can_moderate())
with check (public.can_moderate());

create policy "moderators and admins delete reuse proposals"
on public.reuse_proposals
for delete
to authenticated
using (public.can_moderate());

create policy "authenticated users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "moderators and admins read all profiles"
on public.profiles
for select
to authenticated
using (public.can_moderate());

create policy "users can create own contributor profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id and role = 'contributor');

create policy "admins can create profiles"
on public.profiles
for insert
to authenticated
with check (public.can_admin());

create policy "users can update own profile without role escalation"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id and role = public.current_access_role());

create policy "admins can update any profile"
on public.profiles
for update
to authenticated
using (public.can_admin())
with check (public.can_admin());
