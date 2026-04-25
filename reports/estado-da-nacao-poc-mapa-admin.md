# Estado da Nacao: POC Mapa + Admin

## Objetivo

Usar `/mapa` e `/admin` como prova de conceito da nova linguagem Concreto Frio antes de espalhar o ajuste fino para o resto do produto.

## `/mapa`

### Mudancas

- O cabeçalho deixou de ser hero-first e virou uma faixa operacional compacta.
- A largura maxima da rota foi ampliada para dar mais respiro horizontal ao mapa.
- A area util do mapa foi aumentada:
  - mobile: altura inicial maior
  - desktop: altura baseada em viewport, com minimo alto
- O layout passou a priorizar o canvas cartografico com sidebar mais estreita.
- O bloco de foco rapido ficou mais compacto e dividido entre bairro e imovel.
- Filtros e legenda passaram a usar `SidebarPanel` denso.
- `FilterGroup` recebeu metadados curtos como `uso`, `risco` e `recorte`, reforcando a ideia de ferramenta territorial.
- Inputs usam `tt-input` com texto uppercase e ritmo mais tecnico.

### Resultado

`/mapa` agora abre como mesa cartografica: menos introducao, mais mapa, filtros mais minerais e leitura operacional mais imediata.

## `/admin`

### Mudancas

- O hero editorial foi substituido por uma faixa compacta de operacao.
- Metricas aparecem imediatamente no topo.
- A fila editorial aparece logo abaixo com estado objetivo:
  - fichas no acervo
  - relatos pendentes
  - alta criticidade
- Atalhos viraram comandos laterais densos em `SidebarPanel`.
- O texto introdutor foi reduzido e convertido em informacao operacional curta.
- `PanelCard`, `SidebarPanel`, `MetricCard` e `ButtonLink` foram usados como base.

### Resultado

`/admin` ficou mais parecido com painel de operacao editorial: menos landing, mais fila, decisao e comando.

## Arquivos Alterados

- `src/app/mapa/page.tsx`
- `src/components/map/map-page-shell.tsx`
- `src/components/map/property-map.tsx`
- `src/app/admin/page.tsx`
- `src/components/ui/sidebar-panel.tsx`
- `src/components/ui/filter-group.tsx`

## Verificacao

Executado com sucesso:

```bash
npm run lint
npm run typecheck
npm run build
```

## Proximo Passo Sugerido

Se a POC for aprovada visualmente, aplicar a mesma densidade operacional em `/imoveis`, detalhes de imovel e subrotas admin, substituindo combinacoes antigas de `bg-paper/5`, `border-paper/10` e `bg-ink` por `PanelCard`, `SidebarPanel`, `FilterGroup` e `ActionCard`.
