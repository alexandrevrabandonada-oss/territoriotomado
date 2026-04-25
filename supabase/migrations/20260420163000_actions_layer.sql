alter table public.property_actions
  drop constraint if exists property_actions_kind_check;

alter table public.property_actions
  add column if not exists is_priority boolean not null default false;

alter table public.property_actions
  add constraint property_actions_kind_check check (
    kind in (
      'campanha',
      'plenaria',
      'mutirao',
      'abaixo-assinado',
      'protocolo-requerimento',
      'reuniao-territorial',
      'ato',
      'oficina'
    )
  );

create index if not exists property_actions_priority_idx on public.property_actions (is_priority desc, position asc);

insert into public.property_actions (
  id,
  property_id,
  title,
  kind,
  cta_label,
  href,
  description,
  position,
  is_public,
  is_priority
)
values
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'Campanha pela reabertura popular',
    'campanha',
    'Entrar na campanha',
    '/enviar?imovel=antigo-clube-csn-santa-cecilia',
    'Pressao publica para transformar abandono em pauta coletiva e abrir caminho para uso social.',
    1,
    true,
    true
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'Mutirao de memoria e prova',
    'mutirao',
    'Levar prova e relato',
    '/enviar?imovel=antigo-clube-csn-santa-cecilia',
    'Chamada para reunir fotos, relatos e referencias documentais do antigo clube.',
    2,
    true,
    false
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    'Plenaria pelo reuso do galpao',
    'plenaria',
    'Ir para a plenaria',
    '/enviar?imovel=galpao-logistico-aterrado',
    'Convocacao para consolidar apoio territorial e disputas de uso comunitario do galpao.',
    1,
    true,
    true
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    'Abaixo-assinado por transparencia',
    'abaixo-assinado',
    'Assinar articulacao',
    '/enviar?imovel=galpao-logistico-aterrado',
    'Pressao para abrir informacao publica sobre contratos, uso e destinacao do imovel.',
    2,
    true,
    false
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    'Protocolo de requerimento territorial',
    'protocolo-requerimento',
    'Preparar requerimento',
    '/enviar?imovel=casa-tecnica-conforto',
    'Organiza a forma publica de exigir resposta e registro formal sobre a casa tecnica.',
    1,
    true,
    true
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    'Reuniao territorial com base local',
    'reuniao-territorial',
    'Marcar reuniao territorial',
    '/enviar?imovel=casa-tecnica-conforto',
    'Convoca vizinhanca, coletivos e apoiadores para alinhar proxima fase de disputa.',
    2,
    true,
    false
  )
on conflict (id) do update
set
  property_id = excluded.property_id,
  title = excluded.title,
  kind = excluded.kind,
  cta_label = excluded.cta_label,
  href = excluded.href,
  description = excluded.description,
  position = excluded.position,
  is_public = excluded.is_public,
  is_priority = excluded.is_priority,
  updated_at = timezone('utc', now());
