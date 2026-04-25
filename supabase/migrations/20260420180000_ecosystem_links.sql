alter table if exists public.properties
  add column if not exists mission_url text,
  add column if not exists community_url text,
  add column if not exists dossier_url text,
  add column if not exists external_reference_url text;

alter table if exists public.property_actions
  add column if not exists mission_url text,
  add column if not exists community_url text,
  add column if not exists dossier_url text,
  add column if not exists external_reference_url text;
