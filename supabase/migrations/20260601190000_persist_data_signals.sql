alter table if exists public.properties
  add column if not exists localizacao_status_final text,
  add column if not exists pronto_para_mapa boolean,
  add column if not exists prioridade_revisao text,
  add column if not exists sinais_revisados_em timestamptz,
  add column if not exists sinais_revisados_por text;

create or replace function public.current_access_role()
returns public.access_role
language sql
stable
security definer
set search_path = public
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

alter table if exists public.properties
  drop constraint if exists properties_localizacao_status_final_check,
  add constraint properties_localizacao_status_final_check
    check (
      localizacao_status_final is null
      or localizacao_status_final in ('confirmada', 'aproximada', 'ambigua', 'pendente')
    ),
  drop constraint if exists properties_prioridade_revisao_check,
  add constraint properties_prioridade_revisao_check
    check (
      prioridade_revisao is null
      or prioridade_revisao in ('alta', 'media', 'baixa')
    );

update public.properties
set
  pronto_para_mapa = coalesce(pronto_para_mapa, latitude is not null and longitude is not null),
  prioridade_revisao = coalesce(prioridade_revisao, criticality::text),
  localizacao_status_final = coalesce(
    localizacao_status_final,
    case
      when latitude is null or longitude is null then 'pendente'
      when criticality = 'alta' then 'ambigua'
      else 'aproximada'
    end
  )
where pronto_para_mapa is null
  or prioridade_revisao is null
  or localizacao_status_final is null;

create index if not exists properties_pronto_para_mapa_idx
  on public.properties (pronto_para_mapa);

create index if not exists properties_prioridade_revisao_idx
  on public.properties (prioridade_revisao);

create index if not exists properties_localizacao_status_final_idx
  on public.properties (localizacao_status_final);

create table if not exists public.property_fiscal_signals (
  inscricao_imobiliaria text primary key,
  property_id uuid references public.properties(id) on delete set null,
  endereco_oficial text,
  bairro_oficial text,
  latitude double precision,
  longitude double precision,
  iptu_2019_lancado numeric,
  iptu_2025_observado numeric,
  valor_venal_estimado numeric,
  valor_venal_status text,
  confianca_valor_venal text,
  localizacao_status_final text,
  pronto_para_mapa boolean,
  prioridade_revisao text,
  fonte text not null default 'data_output',
  revisado_em timestamptz,
  revisado_por text,
  observacao text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint property_fiscal_signals_localizacao_status_check
    check (
      localizacao_status_final is null
      or localizacao_status_final in (
        'localizacao_confirmada',
        'localizacao_aproximada',
        'localizacao_aproximada_bairro',
        'localizacao_ambigua',
        'localizacao_pendente',
        'confirmada',
        'aproximada',
        'ambigua',
        'pendente'
      )
    ),
  constraint property_fiscal_signals_prioridade_revisao_check
    check (
      prioridade_revisao is null
      or prioridade_revisao in ('alta', 'media', 'baixa')
    )
);

alter table public.property_fiscal_signals
  drop constraint if exists property_fiscal_signals_localizacao_status_check,
  add constraint property_fiscal_signals_localizacao_status_check
    check (
      localizacao_status_final is null
      or localizacao_status_final in (
        'localizacao_confirmada',
        'localizacao_aproximada',
        'localizacao_aproximada_bairro',
        'localizacao_ambigua',
        'localizacao_pendente',
        'confirmada',
        'aproximada',
        'ambigua',
        'pendente'
      )
    ),
  drop constraint if exists property_fiscal_signals_prioridade_revisao_check,
  add constraint property_fiscal_signals_prioridade_revisao_check
    check (
      prioridade_revisao is null
      or prioridade_revisao in ('alta', 'media', 'baixa')
    );

create index if not exists property_fiscal_signals_property_id_idx
  on public.property_fiscal_signals (property_id);

create index if not exists property_fiscal_signals_prioridade_idx
  on public.property_fiscal_signals (prioridade_revisao);

create index if not exists property_fiscal_signals_localizacao_idx
  on public.property_fiscal_signals (localizacao_status_final);

create index if not exists property_fiscal_signals_valor_venal_status_idx
  on public.property_fiscal_signals (valor_venal_status);

drop trigger if exists set_property_fiscal_signals_updated_at on public.property_fiscal_signals;
create trigger set_property_fiscal_signals_updated_at
before update on public.property_fiscal_signals
for each row
execute function public.set_updated_at();

create table if not exists public.property_signal_reviews (
  id uuid primary key default gen_random_uuid(),
  inscricao_imobiliaria text not null references public.property_fiscal_signals(inscricao_imobiliaria) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  previous_payload jsonb not null default '{}'::jsonb,
  next_payload jsonb not null default '{}'::jsonb,
  decision text not null,
  reviewer text,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists property_signal_reviews_inscricao_idx
  on public.property_signal_reviews (inscricao_imobiliaria, created_at desc);

create index if not exists property_signal_reviews_property_id_idx
  on public.property_signal_reviews (property_id, created_at desc);

alter table public.property_fiscal_signals enable row level security;
alter table public.property_signal_reviews enable row level security;

drop policy if exists "public can read fiscal signals" on public.property_fiscal_signals;
create policy "public can read fiscal signals"
on public.property_fiscal_signals
for select
to anon, authenticated
using (
  property_id is null
  or exists (
    select 1
    from public.properties
    where properties.id = property_fiscal_signals.property_id
      and properties.is_public = true
  )
);

drop policy if exists "moderators and admins manage fiscal signals" on public.property_fiscal_signals;
create policy "moderators and admins manage fiscal signals"
on public.property_fiscal_signals
for all
to authenticated
using (public.can_moderate())
with check (public.can_moderate());

drop policy if exists "moderators and admins read signal reviews" on public.property_signal_reviews;
create policy "moderators and admins read signal reviews"
on public.property_signal_reviews
for select
to authenticated
using (public.can_moderate());

drop policy if exists "moderators and admins create signal reviews" on public.property_signal_reviews;
create policy "moderators and admins create signal reviews"
on public.property_signal_reviews
for insert
to authenticated
with check (public.can_moderate());
