# Estado da Nacao: UI Concreto Frio

## Objetivo

Atualizar a direcao visual do Territorio Tomado para o conceito Concreto Frio, reduzindo a dependencia de preto absoluto e reforcando uma atmosfera de concreto claro, vidro azulado, azul corporativo gasto e monumentalidade institucional.

## Escopo Aplicado

- Tokens globais de cor em `globals.css` e `tailwind.config.ts`.
- Superficies globais `tt-surface`, `tt-surface-strong`, `tt-surface-solid` e `tt-rule-grid`.
- Shell global, navegacao, footer, badges, botoes, metric cards e cards de imovel.
- Rotas publicas e operacionais:
  - `/`
  - `/mapa`
  - `/bairros`
  - `/agir`
  - `/admin`

## Mudancas Visuais

- Base cromatica ficou mais clara e fria, com grafite mineral no lugar de preto pesado.
- Superficies ganharam mais concreto e vidro azulado, com bordas mais presentes.
- Ferrugem foi limitada a acentos de desgaste e vacancia.
- Amarelo segue como alerta, foco e chamada politica.
- Headers internos ficaram mais compactos e diretos.
- `/mapa` ganhou canvas maior, largura maxima ampliada e lateral de filtros mais subordinada ao uso cartografico.

## Preservado

- Tipografia forte e hierarquia em caixa alta.
- Identidade VR Abandonada.
- Leitura politica e territorial.
- Produto existente, sem redesenho do zero.
- Fluxos e componentes estruturais ja existentes.

## Arquivos Principais

- `src/app/globals.css`
- `tailwind.config.ts`
- `src/components/layout/app-shell.tsx`
- `src/components/ui/internal-page-header.tsx`
- `src/components/ui/metric-card.tsx`
- `src/components/ui/button-link.tsx`
- `src/components/ui/badge.tsx`
- `src/components/properties/property-card.tsx`
- `src/app/page.tsx`
- `src/app/mapa/page.tsx`
- `src/components/map/map-page-shell.tsx`
- `src/components/map/property-map.tsx`
- `src/app/bairros/page.tsx`
- `src/app/agir/page.tsx`
- `src/app/admin/page.tsx`

## Risco Residual

Ainda existem telas fora do escopo principal que podem carregar combinacoes antigas de `bg-paper/6`, `border-paper/10` e paineis muito escuros. Elas nao bloqueiam a nova direcao, mas devem ser normalizadas em uma passada posterior para completar o sistema.

## Verificacao Recomendada

- Rodar lint e build.
- Abrir `/`, `/mapa`, `/bairros`, `/agir` e `/admin` em desktop e mobile.
- Conferir contraste de textos secundarios sobre superficies mais claras.
- Conferir se `/mapa` continua funcional com tiles, popups, foco por imovel e filtros.
