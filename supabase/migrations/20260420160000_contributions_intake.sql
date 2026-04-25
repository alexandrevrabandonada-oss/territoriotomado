alter type public.report_type add value if not exists 'atualizacao';

alter table public.property_reports
  add column if not exists reference_hint text not null default '',
  add column if not exists attachment_path text,
  add column if not exists attachment_name text,
  add column if not exists attachment_mime_type text,
  add column if not exists attachment_size bigint;

insert into storage.buckets (id, name, public)
values ('report-attachments', 'report-attachments', false)
on conflict (id) do update
set public = false;
