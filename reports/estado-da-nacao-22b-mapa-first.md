# Estado da Nacao: 22b Mapa First

## Objetivo

Transformar a rota `/mapa` em uma experiencia map-first, fazendo o mapa assumir o centro do produto e deslocando filtros, legenda e resumo para um painel operacional lateral.

## O que mudou

- O desktop passou a usar composicao com mapa como area principal e painel lateral fixo para resumo, foco, filtros, focos rapidos e legenda.
- O mobile manteve o mapa legivel no topo e empilhou o painel operacional abaixo em blocos compactos, sem introduzir camada complexa ou drawer novo.
- Os filtros do mapa foram consolidados em `SidebarPanel` com `FilterGroup` para bairro, status e criticidade.
- O resumo do recorte foi convertido em leitura operacional curta, com visiveis, criticos e casos em disputa.
- O foco rapido por bairro e imovel foi mantido, mas foi deslocado para o painel lateral para nao competir com o mapa.

## Pins e popup

- O pin selecionado ganhou mais contraste, halo externo e marcador interno para destacar o foco ativo sem clustering.
- O popup foi reescrito com linguagem mais objetiva: nome, bairro, status, criticidade e CTA unico para ver ficha.
- Nenhuma camada nova, clustering ou logica espacial adicional foi introduzida.

## Preservacoes

- Nenhuma alteracao foi feita na query layer.
- React-Leaflet foi preservado com a mesma estrutura de `MapContainer`, `Marker`, `Popup` e `TileLayer`.
- Filtros, contexto de navegacao e foco por imovel continuam operando com o mesmo fluxo existente.

## Arquivos afetados

- `src/components/map/map-page-shell.tsx`
- `src/components/map/property-map.tsx`

## Verificacao

Executado com sucesso:

```bash
npm run typecheck
```

Build completo pode ser repetido na proxima iteracao visual para validar o conjunto da rota apos novos refinamentos de superficie.
