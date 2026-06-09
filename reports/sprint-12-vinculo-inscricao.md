# Sprint 12 - Vinculo entre imovel editorial e inscricao oficial

Data: 2026-06-01

## Objetivo

Reduzir matching heuristico entre fichas editoriais e camada fiscal final, fortalecendo a consistencia entre ficha publica, mapa, revisao e circulacao.

## Schema editorial

O schema editorial atual usa `public.properties` como entidade principal do imovel publico. Essa e a entidade correta para persistir o vinculo oficial porque:

- a ficha publica nasce de `properties`;
- mapa e bairros usam `properties`;
- admin edita `properties`;
- a camada fiscal final ja usa `property_fiscal_signals.inscricao_imobiliaria`.

## Campo persistido

Foi criada a migration:

- `supabase/migrations/20260601203000_link_properties_to_inscricao.sql`

Ela adiciona:

- `properties.inscricao_imobiliaria text`;
- indice unico parcial para impedir duas fichas com a mesma inscricao;
- indice de busca por inscricao;
- sincronizacao de `property_fiscal_signals.property_id` quando houver vinculo por inscricao.

Migration aplicada no Supabase remoto com sucesso.

## Fluxo admin

O editor de imoveis ganhou o campo `inscricao_imobiliaria oficial`.

Comportamento:

- permite atribuir inscricao;
- permite corrigir inscricao;
- mostra opcoes reais vindas de `property_fiscal_signals`;
- indica quando uma inscricao da lista ja esta vinculada;
- ao salvar, atualiza `properties.inscricao_imobiliaria`;
- ao salvar, sincroniza `property_fiscal_signals.property_id`;
- se a inscricao antiga mudar, o vinculo antigo e limpo.

O quadro `/admin/imoveis` agora mostra:

- total com inscricao;
- total sem vinculo;
- badge por imovel com a inscricao ou `sem vinculo oficial`.

## Camada publica

`public-queries` passou a ler `properties.inscricao_imobiliaria`.

Prioridade atual:

1. usar `property_fiscal_signals` por `property_id`;
2. usar `property_fiscal_signals` por `inscricao_imobiliaria`;
3. cair no matching final apenas quando nao houver vinculo oficial.

Isso reduz o uso de heuristica e torna a ficha publica mais confiavel sem redesenhar a UI.

## Validacao real

Foi vinculado o imovel editorial:

- `galpao-logistico-aterrado`

Com a inscricao oficial:

- `1.110.0007/000-0`

Confirmacoes remotas:

- `properties.inscricao_imobiliaria` existe;
- indice unico parcial existe;
- `property_fiscal_signals.property_id` aponta para o imovel vinculado;
- REST remoto le a nova coluna.

## Validacao da UI

Comandos executados:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Resultado: todos passaram.

Rotas verificadas em producao local (`http://127.0.0.1:3003`):

- `/admin/imoveis` - 200;
- `/admin/imoveis/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2` - 200;
- `/imoveis/galpao-logistico-aterrado` - 200;
- `/mapa` - 200;
- `/bairros/aterrado` - 200;
- `/circulacao` - 200.

Checagem textual:

- `/admin/imoveis` mostra a inscricao `1.110.0007/000-0`;
- `/admin/imoveis` mostra quais itens seguem sem vinculo oficial;
- editor do imovel mostra o campo `inscricao_imobiliaria oficial`;
- ficha publica mostra IPTU 2019, IPTU 2025, valor venal estimado e status vindos do registro fiscal vinculado.

## Estado final

O produto agora tem uma chave persistida entre imovel editorial e registro fiscal oficial. A heuristica permanece apenas como fallback para fichas ainda sem inscricao, e o admin mostra claramente o que falta vincular.
