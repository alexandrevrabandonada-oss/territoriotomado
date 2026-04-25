insert into public.neighborhoods (
  id,
  name,
  slug,
  description
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Vila Santa Cecilia',
    'vila-santa-cecilia',
    'Area central com forte marca operaria e concentracao de equipamentos historicos.'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Aterrado',
    'aterrado',
    'Eixo de servicos e vazios urbanos sob pressao imobiliaria e institucional.'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Conforto',
    'conforto',
    'Bairro estrategico na leitura da expansao industrial e dos lotes subutilizados.'
  )
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  updated_at = timezone('utc', now());

insert into public.properties (
  id,
  neighborhood_id,
  slug,
  title,
  address,
  excerpt,
  description,
  historical_context,
  social_use_potential,
  current_use,
  area_estimate,
  current_status,
  criticality,
  property_type,
  latitude,
  longitude,
  legal_notes,
  tags,
  is_public
)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '11111111-1111-1111-1111-111111111111',
    'antigo-clube-csn-santa-cecilia',
    'Antigo Clube CSN Santa Cecilia',
    'Rua 14, Vila Santa Cecilia, Volta Redonda',
    'Complexo ocioso em area consolidada, com memoria coletiva forte e potencial de uso publico.',
    'Imovel de grande porte, desativado ha anos, cercado por equipamentos urbanos e por relatos recorrentes de abandono, depredacao e perda de funcao social.',
    'Espaco de sociabilidade operaria ligado a memoria coletiva do bairro e ao ciclo industrial.',
    'Centro de memoria, cultura e apoio territorial para usos publicos.',
    'Sem uso regular identificado',
    '8.500 m2',
    'vazio',
    'alta',
    'clube',
    -22.5195,
    -44.1034,
    array['Documentacao fundiaria em consolidacao', 'Ha indicios de passivo de manutencao'],
    array['memoria operaria', 'vazio urbano', 'equipamento coletivo'],
    true
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    '22222222-2222-2222-2222-222222222222',
    'galpao-logistico-aterrado',
    'Galpao Logistico Aterrado',
    'Avenida Paulo de Frontin, Aterrado, Volta Redonda',
    'Galpao subutilizado em corredor urbano sensivel, alvo de debate entre reuso social e especulacao.',
    'Estrutura robusta, com localizacao privilegiada, cercada por vazios e fluxos intensos. O territorio aponta para uso misto com centralidade comunitaria.',
    'Estrutura de uso flexivel em corredor urbano de alta pressao imobiliaria.',
    'Hub comunitario, feira, servicos urbanos e mobilidade.',
    'Uso eventual para armazenamento',
    '5.100 m2',
    'em-disputa',
    'media',
    'galpao',
    -22.5248,
    -44.0992,
    array['Necessita verificar contratos ativos', 'Interesse publico mapeado por organizacoes locais'],
    array['reuso adaptativo', 'corredor urbano', 'disputa territorial'],
    true
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    '33333333-3333-3333-3333-333333333333',
    'casa-tecnica-conforto',
    'Casa Tecnica Conforto',
    'Rua Nossa Senhora da Conceicao, Conforto, Volta Redonda',
    'Imovel com uso residual e baixo grau de transparencia publica sobre sua funcao atual.',
    'Edificacao de menor escala, com valor documental e potencial de abrir debate sobre inventario completo dos ativos ligados a CSN.',
    'Edificacao administrativa de apoio, com baixo grau de transparencia sobre sua funcao atual.',
    'Base tecnica para coletivos, acervo e suporte a lutas urbanas.',
    'Apoio tecnico-administrativo',
    '680 m2',
    'uso-institucional',
    'baixa',
    'casa-tecnica',
    -22.5312,
    -44.1098,
    array['Necessario consolidar historico de destinacao do lote'],
    array['inventario', 'transparencia', 'uso institucional'],
    true
  )
on conflict (id) do update
set
  neighborhood_id = excluded.neighborhood_id,
  slug = excluded.slug,
  title = excluded.title,
  address = excluded.address,
  excerpt = excluded.excerpt,
  description = excluded.description,
  historical_context = excluded.historical_context,
  social_use_potential = excluded.social_use_potential,
  current_use = excluded.current_use,
  area_estimate = excluded.area_estimate,
  current_status = excluded.current_status,
  criticality = excluded.criticality,
  property_type = excluded.property_type,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  legal_notes = excluded.legal_notes,
  tags = excluded.tags,
  is_public = excluded.is_public,
  updated_at = timezone('utc', now());

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
