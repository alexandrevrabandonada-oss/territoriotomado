# Estado da Nacao: Schema Supabase

Data: 2026-04-20

## Objetivo

Sair do mock para uma base real inicial no Supabase com schema simples, coerente e pronta para crescer sem hiperengenharia.

## Entrega

- Migration inicial criada em `supabase/migrations/20260420120000_initial_schema.sql`
- Seed inicial criada em `supabase/seed.sql`
- Schema com UUIDs, relacionamentos claros, enums minimos, timestamps e indices de leitura
- RLS habilitado com foco em leitura publica e moderacao futura

## Decisoes de modelagem

### 1. `properties` como eixo central

`properties` concentra:

- identidade publica do imovel (`slug`, `title`)
- classificacao (`current_status`, `criticality`, `property_type`)
- localizacao (`latitude`, `longitude`, `address`, `neighborhood_id`)
- leitura editorial inicial (`excerpt`, `description`, `current_use`, `area_estimate`, `legal_notes`, `tags`)

Mantive `latitude` e `longitude` como `double precision` por simplicidade. Isso e suficiente para o mapa atual e evita introduzir PostGIS cedo demais.

### 2. Enums minimos e objetivos

Foram criados:

- `current_status`
- `criticality`
- `property_type`
- `report_type`
- `app_role`

Usei enum nos campos nucleares e um `check` simples em `moderation_status` de `property_reports`, porque esse status tende a evoluir na camada de operacao editorial.

### 3. Relacionamentos claros

- `properties` -> `neighborhoods`
- `property_images` -> `properties`
- `property_documents` -> `properties`
- `property_timeline` -> `properties`
- `property_reports` -> `properties` e opcionalmente `profiles`
- `property_actions` -> `properties`
- `reuse_proposals` -> `properties`
- `profiles` -> `auth.users`

### 4. Perfis ligados a `auth.users`

`profiles.id` referencia `auth.users(id)`. Isso prepara o projeto para auth e moderacao sem criar uma identidade paralela.

### 5. RLS desde o inicio

As tabelas publicas principais estao com leitura liberada para `anon` e `authenticated` quando o registro e publico ou aprovado.

Nao abri escrita publica em nenhuma entidade editorial. Isso atende ao requisito de preparar leitura publica + moderacao sem abrir tudo cedo demais.

## Indices incluidos

Em `properties`:

- `slug`
- `neighborhood_id`
- `current_status`
- `criticality`
- indice composto de listagem publica

Tambem foram adicionados indices simples nas tabelas-filhas por `property_id` e em `profiles.role`.

## Seed inicial

Inclui:

- 3 bairros basicos
- 3 imoveis iniciais que ja existiam no mock

Usei UUIDs fixos no seed para facilitar referencias futuras e reexecucao idempotente.

## Mantido enxuto de proposito

Nao foram adicionados ainda:

- PostGIS
- geometria de bairro
- versionamento de documentos
- workflow complexo de moderacao
- auditoria detalhada
- multilayer permissions por equipe

Esses itens podem entrar depois sem desmontar a base atual.

## Proximo passo natural

1. aplicar migration e seed no projeto Supabase
2. trocar leitura do app de `mock-data.ts` para `queries` reais
3. introduzir types gerados do Supabase no frontend
4. abrir submissao controlada de `property_reports` com policy especifica

## Validacao

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK

Observacao:

- A migration e o seed foram aplicados no projeto Supabase remoto com `supabase db push --include-seed`.
