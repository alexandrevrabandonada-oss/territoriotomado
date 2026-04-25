# Estado da Nacao: Deep Links

Data: 2026-04-20

## Objetivo

Sincronizar filtros, busca e foco entre `/imoveis`, `/mapa` e a ficha do imovel, sem reescrever a arquitetura atual.

## O que mudou

### `/imoveis`

- Filtros de status, criticidade e bairro agora vivem na URL.
- Deep links passam a aceitar:
  - `status`
  - `criticidade`
  - `bairro`
  - `imovel`
- A lista preserva o contexto quando o usuario abre a ficha ou salta para o mapa.
- O card do imovel agora pode abrir:
  - a ficha do proprio imovel
  - o ponto correspondente no mapa

### `/mapa`

- Filtros tambem vivem na URL.
- O mapa passa a respeitar os mesmos parametros de contexto da listagem.
- Deep links para `imovel` focalizam o ponto no mapa e destacam o marcador correspondente.
- O usuario pode sair do mapa para a lista mantendo o mesmo recorte.

### Ficha do imovel

- A pagina de detalhe agora recebe o contexto de origem.
- O retorno inteligente decide entre:
  - voltar para a lista
  - voltar para o mapa
- O retorno preserva os filtros e o foco do imóvel quando existirem na URL.

## Contrato adotado

Parametros publicos padronizados:

- `status`
- `criticidade`
- `bairro`
- `imovel`
- `from`

Regras:

- `from=mapa` retorna para `/mapa`
- `from=imoveis` retorna para `/imoveis`
- se `from` nao existir, o retorno padrao vai para `/imoveis`
- os filtros continuam simples e mobile-first

## Arquivos principais

- `src/lib/navigation/public-context.ts`
- `src/components/properties/property-list-shell.tsx`
- `src/components/map/map-page-shell.tsx`
- `src/components/map/property-map.tsx`
- `src/components/properties/property-card.tsx`
- `src/components/properties/property-detail.tsx`
- `src/app/imoveis/page.tsx`
- `src/app/imoveis/[slug]/page.tsx`
- `src/app/mapa/page.tsx`

## Validacao

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK

## Proximo passo natural

1. aplicar o mesmo contrato de URL em `/agir`
2. sincronizar a busca textual, se ela entrar no produto
3. usar esses links em cards compartilhaveis e mensagens editoriais
