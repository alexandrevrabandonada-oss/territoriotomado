alter table public.property_reports
  add column if not exists editorial_destination text,
  add column if not exists rejection_reason text,
  add column if not exists reviewed_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'property_reports_editorial_destination_check'
  ) then
    alter table public.property_reports
      add constraint property_reports_editorial_destination_check
      check (
        editorial_destination is null
        or editorial_destination in ('relato_publico', 'timeline', 'media')
      );
  end if;
end $$;

update public.property_reports
set editorial_destination = 'relato_publico'
where moderation_status = 'aprovado'
  and editorial_destination is null;

alter table public.property_timeline
  add column if not exists source_report_id uuid references public.property_reports(id) on delete set null;

alter table public.property_images
  add column if not exists source_report_id uuid references public.property_reports(id) on delete set null;

alter table public.property_documents
  add column if not exists source_report_id uuid references public.property_reports(id) on delete set null;

create index if not exists property_reports_moderation_queue_idx
  on public.property_reports (moderation_status, reviewed_at desc, created_at desc);

create index if not exists property_timeline_source_report_id_idx
  on public.property_timeline (source_report_id);

create index if not exists property_images_source_report_id_idx
  on public.property_images (source_report_id);

create index if not exists property_documents_source_report_id_idx
  on public.property_documents (source_report_id);

drop policy if exists "public can read approved property reports" on public.property_reports;

create policy "public can read approved public reports"
on public.property_reports
for select
to anon, authenticated
using (
  moderation_status = 'aprovado'
  and coalesce(editorial_destination, 'relato_publico') = 'relato_publico'
  and property_id is not null
  and exists (
    select 1
    from public.properties
    where properties.id = property_reports.property_id
      and properties.is_public = true
  )
);
