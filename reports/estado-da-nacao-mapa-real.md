# Estado da Nacao: Mapa Real

Data: 2026-04-20

## Objetivo

Substituir o placeholder de `/mapa` por uma primeira experiencia funcional com React-Leaflet usando a base mockada atual, sem clustering e sem acoplar cedo demais a camada de dados real.

## Entrega realizada

- Rota `/mapa` agora renderiza um mapa real com `React-Leaflet`.
- Pins sao gerados a partir dos imoveis mockados atuais.
- Cada status de imovel ganhou um marcador visual proprio.
- Popups mostram:
  - nome
  - bairro
  - status
  - criticidade
  - link para `/imoveis/[slug]`
- Filtros locais implementados para:
  - status
  - criticidade
  - bairro
- Legenda visual de status adicionada ao painel lateral.

## Decisoes estruturais

### 1. Separacao entre dados e interface

Foi criada uma interface de query dedicada ao mapa em `src/lib/data/queries.ts`:

- `getMapProperties()`
- `getMapFilterOptions()`
- `PropertyMapFeature`

Isso deixa a troca futura de mock para query real concentrada em um ponto pequeno da base, com retrabalho minimo na interface.

### 2. Shell server + mapa client

- `src/app/mapa/page.tsx` segue como server component.
- `src/components/map/map-page-shell.tsx` faz o controle local dos filtros.
- `src/components/map/property-map.tsx` encapsula Leaflet, pins e popups.

Essa divisao reduz acoplamento e evita espalhar logica do mapa pela rota.

### 3. Estetica VR Abandonada preservada

- mapa com tratamento visual escurecido e dessaturado
- superfices secas, sem excesso de cards
- painel lateral simples e legivel
- foco em hierarquia forte e leitura rapida em mobile e desktop

## Arquivos criados ou alterados

- `src/app/mapa/page.tsx`
- `src/components/map/map-page-shell.tsx`
- `src/components/map/property-map.tsx`
- `src/lib/data/queries.ts`
- `src/app/globals.css`

## Fora de escopo de proposito

- clustering
- camadas por bairro
- sincronizacao com URL
- dados reais de Supabase
- geometria territorial mais sofisticada

## Validacao

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK

## Proximo encaixe natural

O proximo tijolo do mapa pode entrar por uma destas frentes, sem reescrever a base atual:

1. trocar `getMapProperties()` do mock para query real
2. sincronizar filtros com search params
3. adicionar foco por imovel e destaque vindo da lista
4. introduzir camadas territoriais e leitura por bairro
