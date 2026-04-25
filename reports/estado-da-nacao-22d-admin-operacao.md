# Estado da Nacao: 22d Admin Operacao

## Objetivo

Refatorar a rota `/admin` para funcionar como painel de operacao territorial, reduzindo o tom de landing editorial e priorizando leitura util para trabalho real.

## O que mudou

- O hero do admin foi reduzido a uma barra curta de contexto e comando, com linguagem de sala de operacao.
- As metricas passaram a abrir a pagina com `MetricCard` para os quatro eixos principais: imoveis cadastrados, imoveis publicados, contribuicoes pendentes e acoes ativas.
- As pendencias agora aparecem antes dos demais blocos, com leitura curta para fila de moderacao, rascunhos e casos de alta criticidade.
- Os fluxos principais foram reorganizados em `PanelCard` claros para: gerenciar imoveis, revisar contribuicoes, acoes/frentes e midia/documentos.
- O bloco de midia/documentos nao inventa rota nova: ele aponta para o gancho ja existente no editor de imovel.

## Dados reais usados

- `getAdminSummary()` foi expandida para incluir:
  - imoveis publicados (`properties.is_public = true`)
  - acoes ativas (`property_actions.is_public = true`)
- Nenhuma permissao nova foi criada.
- Nenhum CMS paralelo ou fluxo administrativo novo foi introduzido.

## Resultado

O admin ficou mais seco, denso e tecnico. A pagina agora abre pela leitura de estado e pelas tarefas operacionais concretas, em vez de funcionar como vitrine editorial.

## Arquivos afetados

- `src/app/admin/page.tsx`
- `src/lib/data/admin-queries.ts`

## Verificacao

Executado com sucesso:

```bash
npm run typecheck
```
