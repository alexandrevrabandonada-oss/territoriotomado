alter table public.properties
  add column if not exists historical_context text not null default '',
  add column if not exists social_use_potential text not null default '';

update public.properties
set
  historical_context = case slug
    when 'antigo-clube-csn-santa-cecilia' then 'Espaco de sociabilidade operaria ligado a memoria coletiva do bairro e ao ciclo industrial.'
    when 'galpao-logistico-aterrado' then 'Estrutura de uso flexivel em corredor urbano de alta pressao imobiliaria.'
    when 'casa-tecnica-conforto' then 'Edificacao administrativa de apoio, com baixo grau de transparencia sobre sua funcao atual.'
    else historical_context
  end,
  social_use_potential = case slug
    when 'antigo-clube-csn-santa-cecilia' then 'Centro de memoria, cultura e apoio territorial para usos publicos.'
    when 'galpao-logistico-aterrado' then 'Hub comunitario, feira, servicos urbanos e mobilidade.'
    when 'casa-tecnica-conforto' then 'Base tecnica para coletivos, acervo e suporte a lutas urbanas.'
    else social_use_potential
  end
where historical_context = '' or social_use_potential = '';
