# Estado da Nacao: Dados Reais

Data: 2026-04-20

## Objetivo

Substituir a leitura mockada das paginas principais por queries reais, preservando separacao entre dominio, query e UI.

## Entrega

- Nova camada de leitura publica em `src/lib/data/public-queries.ts`
- `/imoveis` agora le `properties` publicadas do Supabase
- `/imoveis/[slug]` agora le property real e seus blocos relacionados publicos
- `/mapa` agora le dados reais publicados do Supabase
- Fallback visual preservado para estados vazios

## Arquitetura adotada

- `src/types/domain.ts` continua sendo a camada de dominio
- `src/lib/data/public-queries.ts` virou a camada de leitura publica real
- paginas continuam finas e nao falam com Supabase diretamente
- componentes de UI permanecem reaproveitaveis

## Escopo conectado ao Supabase

### `/imoveis`

- tabela `properties`
- join de leitura com `neighborhoods`
- contagem real de bairros para o painel de resumo

### `/imoveis/[slug]`

- `properties`
- `property_images`
- `property_documents` apenas com `is_public = true`
- `property_timeline`
- `property_actions` publicas
- `reuse_proposals` publicas
- `property_reports` aprovadas

### `/mapa`

- `properties` publicadas
- `neighborhoods` para os filtros

## Decisoes

- mantive a query layer antiga em `src/lib/data/queries.ts` porque outras paginas ainda usam mock
- a troca para dados reais foi limitada as rotas prioritarias pedidas
- `PropertyCard` passou a aceitar `neighborhoodName` vindo da camada real, sem perder compatibilidade com o mock

## Validacao

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
