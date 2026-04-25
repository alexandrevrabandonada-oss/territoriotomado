# Estado da Nacao: Hardening da Base

Data: 2026-04-20

## Objetivo

Executar uma limpeza leve e um endurecimento estrutural antes de abrir novas frentes de feature, preservando a estetica VR Abandonada e mantendo o projeto pronto para o tijolo do mapa.

## Resumo executivo

- O fluxo principal foi consolidado em torno de `AppShell`, `SectionHeader` e `Badge`.
- Componentes duplicados, legados ou ainda fora de uso foram retirados do tronco principal e movidos para `src/components/staging`.
- As rotas ativas foram alinhadas ao mesmo padrao visual de container e cabecalho de secao.
- Nenhuma rota pronta foi removida ou quebrada durante a limpeza.

## Auditoria dos componentes

### Fluxo principal mantido

- `src/components/layout/app-shell.tsx`
- `src/components/ui/section-header.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button-link.tsx`
- `src/components/ui/empty-state.tsx`
- `src/components/properties/property-card.tsx`
- `src/components/properties/property-detail.tsx`

### Componentes legados ou duplicados identificados

- `section-heading.tsx`
  Motivo: duplicava a responsabilidade de `SectionHeader`.
  Decisao: movido para staging.

- `status-badge.tsx`
  Motivo: duplicava a responsabilidade de `Badge`.
  Decisao: movido para staging e substituido por mapeamentos no proprio `badge.tsx`.

- `site-header.tsx` e `site-footer.tsx`
  Motivo: `AppShell` ja virou shell principal e absorve cabecalho e rodape.
  Decisao: movidos para staging.

### Componentes fora do fluxo principal

- `property-map.tsx`
- `map-page-shell.tsx`
- `property-filters.tsx`

Motivo: existem no repositorio, mas nao participam das rotas ativas do tijolo atual.

Decisao: movidos para staging. O mapa nao foi integrado ainda para evitar introduzir uma camada tecnica antes da hora. Os filtros tambem ficam reservados para quando a lista tiver busca/facetas reais.

## Convencoes adotadas

- `AppShell` e a shell unica da aplicacao.
- `SectionHeader` e o unico cabecalho de secao permitido nas rotas ativas.
- `Badge` e o unico componente de selo, status e criticidade.
- Componentes retirados do fluxo principal devem ir para `src/components/staging`, nao ser apagados sem contexto.
- A rota `/mapa` continua placeholder editorial ate o proximo tijolo do mapa.

## Mudancas executadas

### 1. Cabecalhos de secao

- `enviar/page.tsx` migrou de `SectionHeading` para `SectionHeader`.
- `admin/imoveis/page.tsx` migrou de `SectionHeading` para `SectionHeader`.

### 2. Badges e estados

- `Badge` agora centraliza os tons de:
  - status de imovel
  - criticidade
  - status de relato
- `property-card.tsx` foi simplificado para usar apenas `Badge`.
- `property-detail.tsx` foi simplificado para usar apenas `Badge`.
- `admin/imoveis/page.tsx` passou a renderizar status e criticidade com o mesmo componente visual do restante do sistema.

### 3. Limpeza estrutural

- Criada a pasta `src/components/staging`.
- Componentes fora do fluxo principal foram movidos para staging em vez de removidos.
- `README.md` foi atualizado com as convencoes de hardening.

## Decisoes sobre o mapa

Escolha: mover para staging.

Justificativa:

- A rota `/mapa` atual esta alinhada ao momento do produto: placeholder forte, editorial e leve.
- Integrar o Leaflet agora adicionaria superficie tecnica antes do proximo tijolo.
- Remover seria perda de contexto util.
- Staging preserva o experimento e reduz ruido no fluxo principal.

## Risco residual baixo

- `src/lib/data/queries.ts` ainda mantem a interface `PropertyFilters` para a futura camada de filtros.
- A pasta `src/components/staging` passa a ser o lugar explicito para componentes estacionados; convem evita-la crescer sem revisao.

## Validacao

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK

Notas:

- Build de producao concluido com sucesso em Next.js 15.5.15.
- Rotas validadas no build: `/`, `/mapa`, `/imoveis`, `/imoveis/[slug]`, `/agir`, `/enviar`, `/admin`, `/admin/imoveis` e manifesto.
