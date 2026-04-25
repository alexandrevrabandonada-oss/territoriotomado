# Estado da Nacao - Editorial Media

Data: 2026-04-20

## O que foi entregue

- O editor de `/admin/imoveis/[id]` agora gerencia mídia real sem virar CMS pesado.
- Cada imóvel pode receber:
  - galeria de imagens
  - imagem de capa
  - legenda
  - crédito/fonte
  - ordem editorial
  - publicação ou ocultação
  - documentos com arquivo, resumo, source_url e visibilidade
- A ficha pública do imóvel reflete automaticamente imagem de capa, galeria e documentos publicados.
- Os buckets editoriais foram separados com clareza:
  - `property-images`
  - `property-docs`

## Decisões

- Imagem ficou em bucket público, controlada por `is_public` na tabela.
- Documento ficou em bucket privado e é exposto na ficha pública por URL assinada no servidor.
- Não entrou drag-and-drop.
- Não entrou editor rico.
- A ordem editorial continua num campo numérico simples.
- A capa é um checkbox, com prioridade visual na ficha pública.

## Base tecnica

- `src/components/admin/property-media-manager.tsx` concentra a operação editorial.
- `src/lib/data/admin-media-actions.ts` faz upload, update e delete.
- `src/lib/data/admin-media-queries.ts` resolve previews de mídia para o painel.
- `src/lib/data/public-queries.ts` passou a resolver URLs de storage e a filtrar mídia publicada.
- `src/components/properties/property-detail.tsx` ganhou capa + galeria + links de documentos.
- `supabase/migrations/20260420170000_editorial_media.sql` amplia schema e buckets.

## Validacao

- `npm run build`: ok
- `npm run lint`: ok
- `npm run typecheck`: ok
- `supabase db push --linked --yes`: aplicado no remoto

## Proximo passo natural

- semear documentos reais no acervo editorial e usar a mesma camada para alimentar a leitura publica sem duplicar regras de exibição.
