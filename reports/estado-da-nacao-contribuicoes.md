# Estado da Nacao - Contribuicoes

Data: 2026-04-20

## O que foi entregue

- `/enviar` saiu do mock e virou formulario funcional em cima do Supabase real.
- O envio aceita cinco tipos operacionais:
  - foto atual
  - relato historico
  - denuncia
  - atualizacao
  - prova documental
- O usuario pode vincular a um imovel existente ou deixar sem vinculo exato para triagem posterior.
- Tudo entra em `property_reports` com `moderation_status = pendente`.
- Anexos sobem para o bucket privado `report-attachments`.
- `/admin/contribuicoes` virou a fila minima de moderacao com aprovar ou rejeitar.

## Decisoes

- Nao criei sistema de permissao novo.
- A moderacao continua simples: o conteudo so vira publico depois de revisao manual.
- O fluxo sem vinculo exato fica aceito na entrada, mas precisa de triagem editorial antes de virar conteudo publico util.
- O upload de arquivo foi mantido privado por padrao.

## Base tecnica

- `src/lib/data/contribution-actions.ts` recebe o envio e grava no banco.
- `src/components/contributions/contribution-intake-form.tsx` concentra a UI do formulario.
- `src/lib/data/admin-queries.ts` e `src/lib/data/admin-actions.ts` sustentam a fila de moderacao.
- `supabase/migrations/20260420160000_contributions_intake.sql` adiciona os campos e o bucket necessarios.

## Validacao

- `npm run build`: ok
- `npm run lint`: ok
- `npm run typecheck`: ok
- `supabase db push --linked --yes`: aplicado no remoto

## Proximo passo natural

- ligar o conteudo aprovado desse fluxo a vistas editoriais mais ricas, sem abrir escrita publica direta nas tabelas centrais.
