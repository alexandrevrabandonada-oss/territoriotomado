alter table if exists public.properties
  add column if not exists inscricao_imobiliaria text;

create unique index if not exists properties_inscricao_imobiliaria_uidx
  on public.properties (inscricao_imobiliaria)
  where inscricao_imobiliaria is not null;

create index if not exists properties_inscricao_imobiliaria_idx
  on public.properties (inscricao_imobiliaria);

update public.property_fiscal_signals signals
set property_id = properties.id
from public.properties
where properties.inscricao_imobiliaria = signals.inscricao_imobiliaria
  and properties.inscricao_imobiliaria is not null
  and signals.property_id is distinct from properties.id;
