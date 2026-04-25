# Estado da Nacao: DS Refactor Concreto Frio

## Objetivo

Consolidar a direcao Concreto Frio no design system real do app, reduzindo intervencoes pagina por pagina e movendo a linguagem para componentes reutilizaveis.

## Componentes Refatorados

- `SectionHeader`: recebeu marca lateral amarela, contraste mineral e suporte a `className`.
- `Badge`: consolidado sobre `tt-chip`, com suporte a `className`.
- `ButtonLink`: centralizado nas variantes globais `tt-button-*`.
- `EmptyState`: passou a usar `tt-panel`, linha de alerta e superficie mineral.
- `PropertyCard`: reforcado como `tt-card`, com foco `shadow-tt-signal` e CTA alinhado aos botoes globais.
- `MetricCard`: ganhou `className` e tom `steel`.

## Componentes Criados

- `PanelCard`: painel operacional reutilizavel.
- `SidebarPanel`: painel lateral para filtros, legendas e atalhos.
- `FilterGroup`: wrapper para grupos de filtro com `tt-input`.
- `ActionCard`: card reutilizavel para frentes de acao.

## Aplicacao Inicial

- `/mapa`: passou a usar `PanelCard`, `SidebarPanel` e `FilterGroup` nos blocos de foco, filtros e apoio.
- `/agir`: passou a usar `PanelCard` para grupos por imovel e `ActionCard` para frentes de acao.
- `/admin`: passou a usar `PanelCard` e `SidebarPanel` nos blocos centrais.
- Cards de imovel e componentes compartilhados propagam a nova linguagem para home, bairros, listagens e detalhes que ja usam esses componentes.

## Resultado

A nova identidade ficou menos dependente de classes soltas em cada pagina. O app continua com a alma VR Abandonada, mas agora a base visual tem mais massa mineral, vidro azulado, cinza-chumbo e amarelo de alerta aplicado por componentes.

## Risco Residual

Ainda existem pontos antigos em telas profundas, como alguns detalhes de imovel e managers admin, usando combinacoes manuais de `border-paper/10`, `bg-paper/5` e `bg-ink`. Eles podem ser migrados gradualmente para `PanelCard`, `SidebarPanel`, `FilterGroup` e `ActionCard` sem alterar arquitetura.

## Verificacao

- `npm run lint`
- `npm run typecheck`
- `npm run build`
