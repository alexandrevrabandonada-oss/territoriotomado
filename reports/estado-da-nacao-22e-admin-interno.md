# Estado da Nacao: 22e Admin Interno

## Objetivo

Expandir a prova de conceito visual do novo admin para as rotas internas `/admin/imoveis` e `/admin/contribuicoes`, alinhando ambas a uma linguagem operacional mais seca, densa e util.

## O que mudou em `/admin/imoveis`

- O cabecalho foi reduzido para uma barra curta de contexto e comando.
- Foram adicionadas metricas compactas para leitura imediata de cadastrados, publicados e rascunhos.
- A tabela foi encapsulada em `PanelCard` e ganhou densidade maior, com celulas mais curtas e acao padronizada com `ButtonLink`.
- O estado de publicacao passou a usar `Badge` consistente com a linguagem nova.
- O estado vazio foi melhorado com CTA direto para criar o primeiro imovel.

## O que mudou em `/admin/contribuicoes`

- O cabecalho foi reduzido e aproximado da linguagem do novo `/admin`.
- Foram adicionadas metricas compactas para aguardando revisao, itens com vinculo e sem vinculo.
- Os cards de moderacao ficaram mais densos, com blocos informativos melhor separados e botoes padronizados para aprovar e rejeitar.
- A moderacao e o historico agora usam `Badge` de forma mais consistente para estado, tipo e vinculacao.
- O estado vazio da fila e o estado vazio do historico foram melhorados.

## Preservacoes

- As server actions existentes foram preservadas.
- Nao houve mudanca nos fluxos de criacao, edicao ou moderacao.
- O objetivo foi exclusivamente consistencia visual, hierarquia e uso real.

## Arquivos afetados

- `src/app/admin/imoveis/page.tsx`
- `src/app/admin/contribuicoes/page.tsx`

## Verificacao

Executado com sucesso:

```bash
npm run typecheck
npm run build
```
