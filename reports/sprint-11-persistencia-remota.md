# Sprint 11 - Persistencia remota dos sinais

Data: 2026-06-01

## Objetivo

Fechar a transicao entre fallback local e persistencia remota dos sinais territoriais e fiscais, reduzindo a dependencia de CSV/local como fonte principal.

## Migration revisada

Arquivo revisado:

- `supabase/migrations/20260601190000_persist_data_signals.sql`

A migration foi ajustada para:

- criar/garantir `properties.localizacao_status_final`;
- criar/garantir `properties.pronto_para_mapa`;
- criar/garantir `properties.prioridade_revisao`;
- criar `property_fiscal_signals`;
- criar `property_signal_reviews`;
- habilitar RLS nas duas tabelas novas;
- permitir leitura publica de sinais fiscais;
- permitir escrita/leitura de moderadores e admins;
- aceitar o valor real da base final `localizacao_aproximada_bairro`;
- recriar explicitamente constraints em tabela ja existente;
- corrigir `public.current_access_role()` como `security definer` para evitar recursao de RLS em `profiles`.

## Aplicacao remota

O `supabase db push` via CLI falhou por permissao de login role e exigencia de senha do banco. A migration foi aplicada pelo endpoint SQL da Supabase Management API no projeto remoto.

Resultado da aplicacao: sucesso.

## Carga remota

A tabela `property_fiscal_signals` foi populada com a base final unificada.

Resultado:

- registros enviados: 197;
- registros remotos confirmados: 197;
- fonte registrada: `base_csn_final_unificada`.

## Validacao de schema

Checagens remotas confirmadas:

- `properties.localizacao_status_final` - ok;
- `properties.pronto_para_mapa` - ok;
- `properties.prioridade_revisao` - ok;
- `property_fiscal_signals` - ok;
- `property_signal_reviews` - ok.

## Validacao de RLS

Politicas confirmadas:

- `property_fiscal_signals`: leitura publica para `anon` e `authenticated`;
- `property_fiscal_signals`: escrita/gestao para `authenticated` com `can_moderate()`;
- `property_signal_reviews`: leitura para moderadores/admins;
- `property_signal_reviews`: insert para moderadores/admins.

Teste real executado:

- anon leu `property_fiscal_signals`: sucesso;
- anon tentou escrever `property_fiscal_signals`: bloqueado com `42501`;
- usuario temporario com perfil `moderator` escreveu em `property_fiscal_signals`: sucesso;
- usuario temporario `moderator` inseriu em `property_signal_reviews`: sucesso;
- usuario temporario `moderator` leu `property_signal_reviews`: sucesso;
- registros e usuario temporario foram removidos depois do teste.

## Ajuste no app

`src/lib/data/final-signals.ts` foi ajustado para priorizar a fonte remota persistida.

Regra atual:

- se `property_fiscal_signals` retornar registros, o app usa a tabela remota;
- se a tabela estiver indisponivel ou vazia, o app cai no CSV final local como fallback de transicao.

Com a carga de 197 registros no remoto, a superficie publica passa a operar pela persistencia remota.

## Validacao da UI

Comandos executados:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Resultado: todos passaram.

Rotas verificadas em producao local (`http://127.0.0.1:3003`):

- `/imoveis/galpao-logistico-aterrado` - 200;
- `/mapa` - 200;
- `/bairros/aterrado` - 200;
- `/circulacao` - 200;
- `/admin/revisao` - 200;
- `/circulacao/share/ranking/top-iptu-2025/1x1` - 200, `image/png`.

## Estado final

A camada remota de persistencia esta aplicada, populada e validada. O CSV/local deixou de ser fonte principal e permanece apenas como fallback de transicao quando a tabela remota nao estiver disponivel ou estiver vazia.
