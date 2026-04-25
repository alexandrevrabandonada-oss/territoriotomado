# Estado da Nação - Share Pack

## O que entrou
- OG image real para `/imoveis/[slug]` com card específico do imóvel.
- OG image real para `/agir` com card editorial da frente ativa.
- Rotas de share pack para imóvel em `1:1` e `9:16`.
- Metadados públicos reais em `/imoveis`, `/imoveis/[slug]`, `/mapa` e `/agir`.
- Links de circulação na ficha do imóvel e na página de ação.
- Fallback visual raiz em `/opengraph-image` para o produto inteiro.

## Decisões
- Mantive a base visual seca, escura e de alto contraste, sem estúdio de templates.
- Reaproveitei os dados publicados do Supabase e não criei uma camada nova de conteúdo.
- Separei imagem de compartilhamento em componentes reutilizáveis para evitar duplicação.
- Mantive os cards de share focados em sinal territorial: nome, bairro, status, criticidade, frase curta e CTA.

## Rotas criadas
- `/imoveis/[slug]/opengraph-image`
- `/imoveis/[slug]/share/1x1`
- `/imoveis/[slug]/share/9x16`
- `/agir/opengraph-image`
- `/agir/share/1x1`
- `/agir/share/9x16`

## Observações
- O card de ação pode ser focado por `?imovel=slug` nas rotas de share.
- Os metadados agora apontam para imagens reais e não dependem mais apenas do fallback do layout.
- A rota raiz também ganhou um OG image para não deixar o produto sem capa padrão.

## Validação
- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
