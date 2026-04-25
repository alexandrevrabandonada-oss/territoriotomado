# Estado da Nacao - Agir

Data: 2026-04-20

## O que foi entregue

- A camada de acao saiu do placeholder e passou a nascer da ficha de cada imovel.
- `/imoveis/[slug]` agora expõe um bloco forte de `Agir agora` com CTA direto.
- `/agir` virou vitrine de frentes reais conectadas a `property_actions` publicadas.
- O fluxo usa os tipos de acao:
  - campanha
  - plenaria
  - mutirao
  - abaixo-assinado
  - protocolo/requerimento
  - reuniao territorial

## Decisoes

- Nao criei agenda generica nem area de eventos separada.
- `property_actions` segue preso ao imovel, com prioridade e publicacao controlada.
- O CTA principal de cada acao leva para o fluxo de participacao moderada em `/enviar`, com o imovel preselecionado.
- A pagina `/agir` prioriza frentes marcadas como urgentes e agrupa o restante por imovel.

## Base tecnica

- `src/lib/data/action-kinds.ts` centraliza rotulos e normalizacao dos tipos de acao.
- `src/lib/data/public-queries.ts` ganhou `getPublishedActionFeed()`.
- `src/app/agir/page.tsx` deixou de ler mock e passou a usar o feed real.
- `src/components/properties/property-detail.tsx` agora destaca a acao mais urgente da ficha.
- `supabase/migrations/20260420163000_actions_layer.sql` amplia o schema e semeia as acoes iniciais.

## Validacao

- `npm run build`: ok
- `npm run lint`: ok
- `npm run typecheck`: ok
- `supabase db push --linked --yes`: aplicado no remoto

## Proximo passo natural

- conectar os retornos e desdobramentos dessas acoes a uma moderacao editorial mais rica, sem romper o eixo propriedade -> acao -> contribuicao.
