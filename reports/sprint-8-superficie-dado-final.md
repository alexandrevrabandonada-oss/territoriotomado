# Sprint 8 - Superficie ligada ao dado final

Data: 2026-06-01

## Objetivo

Conectar ficha, mapa, bairros e circulacao a uma camada final coerente de dados fiscais e territoriais, reduzindo divergencia entre UI publica, administracao, revisao e materiais compartilhaveis.

## Fonte final escolhida

A fonte operacional final passa a ser a camada `property_fiscal_signals` no Supabase quando ela existir e tiver registros persistidos.

Como a migration de persistencia ainda precisa ser aplicada no banco remoto, o sistema mantem compatibilidade usando `C:\Users\Micro\OneDrive\Documentos\Estudo renda mediana histórica\data\output\base_csn_final_unificada.csv` como cobertura completa de transicao.

A regra implementada e:

- carregar a base final unificada como cobertura completa;
- carregar `property_fiscal_signals` quando disponivel;
- mesclar os dois conjuntos por `inscricao_imobiliaria`;
- preferir o registro persistido do Supabase quando houver conflito;
- manter o CSV final como fallback para linhas ainda nao persistidas.

## Campos consolidados

A camada final normaliza e expõe:

- `iptu_2019_lancado` como IPTU 2019;
- `iptu_2025_observado` como IPTU 2025;
- `valor_venal_estimado`;
- `valor_venal_status`;
- `confianca_valor_venal`;
- `localizacao_status_final`;
- `pronto_para_mapa`;
- `prioridade_revisao`;
- `latitude` e `longitude` para mapa.

## Superficies conectadas

### Ficha de imovel

`/imoveis/[slug]` agora recebe os sinais finais em `getPublishedPropertyBundle`, antes da renderizacao da ficha. A tela usa os mesmos campos finais exibidos nas outras superficies:

- IPTU 2019;
- IPTU 2025;
- valor venal estimado;
- status e confianca do valor venal;
- status final de localizacao;
- pronto para mapa;
- prioridade de revisao.

A copia foi ajustada para evitar a ideia de "em integracao" quando o dado ja vem da camada final. Quando faltar vinculo especifico, a ficha continua distinguindo dado oficial, estimado e revisao.

### Mapa

`/mapa` usa `getPublishedProperties` e `getPublishedMapProperties`, agora enriquecidos pela mesma camada final antes dos filtros de:

- bairro;
- pronto para mapa;
- prioridade de revisao;
- status de localizacao.

Isso evita divergencia entre a legenda territorial e a ficha.

### Bairros

`/bairros` e `/bairros/[slug]` passam a usar estatisticas agregadas da camada final:

- total de registros do bairro;
- quantidade pronta para mapa;
- quantidade com revisao alta;
- totais fiscais agregaveis.

Os dados editoriais continuam existindo, mas a leitura quantitativa territorial passa a vir da base final.

### Circulacao politica

`/circulacao` deixou de depender dos arquivos de ranking exportados separadamente. Os rankings agora sao derivados de `getFinalSignalRows()`:

- top IPTU 2025;
- top valor venal estimado;
- bairros com maior concentracao;
- revisao prioritaria.

Os cards compartilhaveis de ranking tambem usam essa camada.

## Compatibilidade e transicao

A transicao foi feita sem redesenhar a UI e sem exigir que o Supabase remoto ja esteja migrado.

Enquanto `property_fiscal_signals` nao existir ou estiver vazio, o app continua lendo a base final unificada local. Quando a tabela existir, os registros persistidos passam a sobrescrever as linhas equivalentes por inscricao imobiliaria.

Observacao importante: as fichas editoriais ainda nao possuem inscricao imobiliaria propria em todos os casos. Nesses casos, o vinculo com a camada final usa correspondencia por bairro, endereco, titulo e proximidade geografica. Para fechamento pleno, a proxima melhoria de dados deve persistir a inscricao oficial em cada imovel editorial.

## Ajustes tecnicos realizados

- Criada `src/lib/data/final-signals.ts` como ponto unico de leitura e normalizacao dos sinais finais.
- Atualizadas queries publicas em `src/lib/data/public-queries.ts`.
- Atualizada circulacao em `src/lib/data/circulation.ts`.
- Ajustada ficha em `src/components/properties/property-detail.tsx`.
- Rotas OG/share que dependem de leitura de arquivo local foram mantidas em runtime Node.
- Migration de persistencia recebeu latitude e longitude em `property_fiscal_signals`.
- Persistencia de revisao administrativa passou a salvar latitude e longitude quando disponiveis.

## Validacao

Comandos executados:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Resultado: todos passaram.

Rotas verificadas em build de producao local (`http://127.0.0.1:3003`):

- `/imoveis/galpao-logistico-aterrado` - 200
- `/mapa` - 200
- `/bairros` - 200
- `/circulacao` - 200
- `/circulacao/share/ranking/top-iptu-2025/1x1` - 200, `image/png`

## Estado final

A superficie publica passa a ler uma camada final comum para sinais fiscais e territoriais. O projeto fica pronto para trocar gradualmente a cobertura CSV pela persistencia Supabase sem quebrar a UI atual.
