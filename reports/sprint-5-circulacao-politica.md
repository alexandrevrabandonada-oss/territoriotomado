# Sprint 5 - Circulacao politica

Data: 2026-06-01

## Objetivo

Transformar a base do Territorio Tomado em pacote politico de circulacao publica, com rankings, cards e resumos curtos para rede, imprensa e mobilizacao.

## Entregas

- Criada a pagina `/circulacao` como frente publica de rankings e cards, sem formato de dashboard.
- Criados quatro blocos principais de ranking:
  - Top IPTU 2025, marcado como dado oficial.
  - Top valor venal estimado, marcado como dado estimado.
  - Bairros com maior concentracao, marcado como leitura territorial.
  - Revisao prioritaria, marcada como dado em revisao.
- Criados resumos curtos automaticos por bairro a partir de:
  - quantidade de registros;
  - soma de IPTU 2025 observado;
  - soma de valor venal estimado;
  - leitura sintetica de concentracao.
- Criados cards compartilhaveis por ranking:
  - `/circulacao/share/ranking/top-iptu-2025/1x1`
  - `/circulacao/share/ranking/top-iptu-2025/9x16`
  - `/circulacao/share/ranking/valor-venal-estimado/1x1`
  - `/circulacao/share/ranking/concentracao-bairros/1x1`
  - `/circulacao/share/ranking/revisao-prioritaria/1x1`
- Criados cards compartilhaveis por bairro:
  - `/circulacao/share/bairro/[bairro]/1x1`
  - `/circulacao/share/bairro/[bairro]/9x16`
- Reforcados os cards compartilhaveis de imovel com campos de confianca territorial e prioridade de revisao quando disponiveis.
- Criado OG especifico para circulacao:
  - `/circulacao/opengraph-image`
- Adicionada entrada de navegacao para `Circulacao` no header e para `Cards` no menu movel.
- Adicionado CTA discreto na home para `Cards publicos`.

## Fonte de dados

Os rankings usam os CSVs exportados em:

`C:\Users\Micro\OneDrive\Documentos\Estudo renda mediana histórica\data\output`

Arquivos usados:

- `ranking_iptu_2025.csv`
- `ranking_valor_venal.csv`
- `ranking_bairros.csv`
- `revisao_prioritaria.csv`

## Separacao de leitura

- Oficial: IPTU 2025 observado e campos de origem cadastral/fiscal.
- Estimado: valor venal estimado e respectivo `valor_venal_status`.
- Revisao: `prioridade_revisao`, `localizacao_status_final` e filas de checagem.

## Arquivos alterados/criados

- `src/app/circulacao/page.tsx`
- `src/app/circulacao/opengraph-image.tsx`
- `src/app/circulacao/share/ranking/[kind]/[format]/route.ts`
- `src/app/circulacao/share/bairro/[bairro]/[format]/route.ts`
- `src/lib/data/circulation.ts`
- `src/lib/share-pack.tsx`
- `src/app/imoveis/[slug]/opengraph-image.tsx`
- `src/app/imoveis/[slug]/share/[format]/route.ts`
- `src/components/layout/app-shell.tsx`
- `src/app/page.tsx`

## Validacao

- `npm run lint` passou.
- `npm run typecheck` passou.
- `NEXT_PRIVATE_BUILD_WORKER=1 npm run build` passou.
- `/circulacao` respondeu 200 no servidor local `127.0.0.1:3002`.
- Cards testados com resposta 200:
  - `/circulacao/share/ranking/top-iptu-2025/1x1`
  - `/circulacao/share/ranking/revisao-prioritaria/9x16`
  - `/circulacao/share/bairro/santa-cecilia/1x1`
  - `/circulacao/opengraph-image`
- Verificacao visual no navegador embutido confirmou renderizacao da entrada de circulacao e links de share.
- Durante o build, os share packs foram ajustados para CSS compativel com `next/og`:
  - removido `display: inline-flex`;
  - removido `width: fit-content`.
