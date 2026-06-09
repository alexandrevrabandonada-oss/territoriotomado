# Sprint 7 - Persistencia dos sinais territoriais e fiscais

Data: 2026-06-01

## Objetivo

Persistir os sinais centrais que estavam derivados ou mantidos localmente, reduzindo divergencia entre UI publica, admin, revisao e circulacao.

## Mapeamento atual

### `localizacao_status_final`

- Antes: derivado em `src/lib/data/public-queries.ts` por `deriveLocationStatus()`.
- Tambem aparecia na base exportada `data/output/base_csn_app_ready.json`.
- Na Sprint 6, podia ser sobrescrito localmente em `data/review-overrides.json`.
- Agora: coluna proposta em `public.properties.localizacao_status_final` e campo em `public.property_fiscal_signals.localizacao_status_final`.

### `pronto_para_mapa`

- Antes: derivado por coordenadas (`Number.isFinite(lat/lng)`).
- Tambem vinha em `data/output`.
- Agora: coluna proposta em `public.properties.pronto_para_mapa` e campo em `public.property_fiscal_signals.pronto_para_mapa`.

### `prioridade_revisao`

- Antes: derivada por criticidade/prova/acao em `derivePriorityReview()`.
- Tambem vinha em `data/output`.
- Agora: coluna proposta em `public.properties.prioridade_revisao` e campo em `public.property_fiscal_signals.prioridade_revisao`.

### `valor_venal_status`

- Antes: vinha dos CSVs/JSONs de `data/output` e dos overrides locais da revisao.
- Nao existia no schema editorial de `properties`.
- Agora: campo proposto em `public.property_fiscal_signals.valor_venal_status`.

### `confianca_valor_venal`

- Antes: vinha apenas de `data/output`.
- Agora: campo proposto em `public.property_fiscal_signals.confianca_valor_venal`.

## Persistencia proposta

Foi adotada a forma mais simples sem forcar remodelagem:

- Sinais territoriais editoriais ficam em `public.properties`, porque alimentam mapa, bairro, ficha e filtros.
- Sinais fiscais ficam em `public.property_fiscal_signals`, chaveados por `inscricao_imobiliaria`, porque a base fiscal ainda nao tem relacao 1:1 garantida com os imoveis editoriais.
- Historico persistido fica em `public.property_signal_reviews`.
- A camada local `data/review-history.json` e `data/review-overrides.json` continua como fallback de transicao.

## Migration criada

Arquivo:

- `supabase/migrations/20260601190000_persist_data_signals.sql`

Ela adiciona:

- `properties.localizacao_status_final`
- `properties.pronto_para_mapa`
- `properties.prioridade_revisao`
- `properties.sinais_revisados_em`
- `properties.sinais_revisados_por`
- tabela `property_fiscal_signals`
- tabela `property_signal_reviews`
- indices simples para mapa/revisao/fiscal
- RLS de leitura publica dos sinais fiscais e escrita por moderadores/admins

## Atualizacoes no app

- `src/types/domain.ts`
  - adicionados campos fiscais opcionais no tipo `Property`.
- `src/lib/data/public-queries.ts`
  - passa a ler `properties.*`, usando sinais persistidos quando existirem.
  - mantem fallback para derivacao antiga.
  - tenta ler `property_fiscal_signals`, mas nao quebra se a tabela ainda nao existir.
- `src/lib/data/admin-queries.ts`
  - passa a mapear sinais persistidos em `AdminPropertyEditorData`.
- `src/lib/data/admin-actions.ts`
  - passa a salvar sinais territoriais quando as colunas existirem.
  - se o schema antigo ainda estiver ativo, faz retry sem os campos novos.
- `src/components/admin/property-editor-form.tsx`
  - adiciona controles opcionais para `localizacao_status_final`, `pronto_para_mapa` e `prioridade_revisao`.
- `src/app/admin/imoveis/page.tsx`
  - mostra sinais na tabela operacional e indicador de prontos para mapa.
- `src/lib/data/admin-review.ts`
  - ao salvar revisao, continua gravando fallback local e tenta persistir em `property_fiscal_signals`/`property_signal_reviews`.
- `src/components/properties/property-detail.tsx`
  - passa a usar IPTU, valor venal estimado, status e confianca quando vierem persistidos.

## Compatibilidade

- UI atual preservada.
- Campos novos sao opcionais.
- Queries publicas usam fallback para derivacao atual.
- Escrita administrativa faz retry sem campos novos se a migration ainda nao estiver aplicada.
- Tabela fiscal e historico persistido sao tratados como camada opcional durante a transicao.

## Aplicacao remota

Foi tentado aplicar a migration com `supabase db push`, mas o comando excedeu o timeout em duas tentativas. Portanto, nesta rodada a migration foi criada e validada no build, mas nao foi marcada como aplicada remotamente.

## Validacao

- `npm run lint` passou.
- `npm run typecheck` passou.
- `NEXT_PRIVATE_BUILD_WORKER=1 npm run build` passou.
- Com o schema remoto atual, ainda sem confirmar a migration aplicada, responderam 200:
  - `/mapa`
  - `/admin/imoveis`
  - `/imoveis/galpao-logistico-aterrado`
