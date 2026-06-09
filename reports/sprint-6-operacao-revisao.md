# Sprint 6 - Operacao de revisao

Data: 2026-06-01

## Objetivo

Transformar a revisao de dados em fluxo cotidiano de operacao para fechar ambiguidades, melhorar o mapa e controlar estimativas ao longo do tempo.

## Entregas

- Criada a rota administrativa `/admin/revisao`.
- Criada fila operacional focada em:
  - `localizacao_ambigua`;
  - `localizacao_pendente`;
  - `valor_venal_status = revisao_manual`;
  - `prioridade_revisao = alta`.
- Criado formulario simples por item para:
  - confirmar endereco;
  - confirmar bairro;
  - marcar latitude e longitude;
  - marcar status da localizacao;
  - confirmar, suspender ou manter estimativa em revisao;
  - registrar observacao e responsavel.
- Criado historico local de revisao:
  - `data/review-history.json`
- Criada camada local de overrides aplicados:
  - `data/review-overrides.json`
- Criados indicadores simples:
  - total da fila foco;
  - pendentes;
  - revisados;
  - progresso percentual;
  - localizacao ambigua;
  - localizacao pendente;
  - valor venal em revisao manual;
  - prioridade alta;
  - itens que melhoram o mapa apos revisao.
- Reforcado o painel `/admin` com atalho e metricas de revisao prioritaria.
- A camada publica de circulacao passa a aplicar overrides de revisao em rankings/cards quando houver inscricao revisada.

## Fonte de dados

A fila usa a base exportada:

`C:\Users\Micro\OneDrive\Documentos\Estudo renda mediana histórica\data\output\base_csn_app_ready.json`

## Decisao tecnica

Nao foi criada migracao de banco nesta sprint. Como as queries administrativas existentes nao expunham colunas especificas para `localizacao_status_final` e `valor_venal_status`, a solucao manteve a arquitetura atual e criou uma camada operacional local:

- historico append-only para auditoria;
- override por inscricao para decisao mais recente;
- revalidacao de admin, mapa e circulacao apos salvar revisao.

## Impacto publico

Cada revisao salva:

- registra a decisao;
- atualiza o override da inscricao;
- revalida `/admin`, `/admin/revisao`, `/circulacao` e `/mapa`;
- altera a leitura publica dos rankings/cards de circulacao quando o item revisado aparece nesses blocos.

## Arquivos alterados/criados

- `src/app/admin/revisao/page.tsx`
- `src/lib/data/admin-review.ts`
- `src/app/admin/page.tsx`
- `src/lib/data/circulation.ts`
- `data/review-history.json`
- `data/review-overrides.json`
- `reports/sprint-6-operacao-revisao.md`

## Validacao

- `npm run lint` passou.
- `npm run typecheck` passou.
- `NEXT_PRIVATE_BUILD_WORKER=1 npm run build` passou.
- `/admin/revisao` foi incluida no build como rota dinamica.
- `/admin/revisao` respondeu 200 no servidor local `127.0.0.1:3002`.
- Checagem HTML confirmou presenca de:
  - `Revisao prioritaria`;
  - `fila foco`;
  - `localizacao_ambigua`;
  - `salvar revisao`.
