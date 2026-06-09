# Sprint 14 - Rotina politica continua

Data: 2026-06-02

## Objetivo

Transformar revisao, bairro, circulacao e acao em um fluxo operacional simples para uso semanal da equipe, sem criar CMS novo e sem abrir nova arquitetura.

## O que foi implementado

### 1. Visao operacional "da revisao para a pauta"

Foi criada uma camada de foco semanal em `src/lib/data/admin-review.ts`, calculada a partir da fila de revisao existente.

Ela organiza:

- bairros da semana;
- imoveis estrategicos recem-fechados;
- itens liberados para mapa;
- itens que podem virar card ou pauta;
- candidatos de circulacao por impacto fiscal, prioridade e status territorial.

Essa camada reaproveita os mesmos sinais ja existentes na operacao:

- `prioridade_revisao`;
- `pronto_para_mapa`;
- status de localizacao;
- status de valor venal;
- historico de revisao;
- impacto fiscal calculado.

### 2. Fortalecimento de `/admin/revisao`

Foi adicionada uma secao no topo operacional:

- `Rotina politica da semana`;
- cards de `bairro da semana`;
- contadores de pendencias, liberados para mapa, candidatos a pauta/card e impacto fiscal;
- bloco de `recem-fechados`;
- resumo de liberados para mapa;
- resumo de itens que podem virar card ou pauta.

Links reforcados:

- revisar bairro em `/admin/revisao?bairro=...`;
- abrir bairro em `/bairros/[slug]`;
- abrir mapa filtrado;
- preparar circulacao em `/circulacao`;
- abrir acoes em `/agir`.

### 3. Fortalecimento de `/circulacao`

Foi adicionada uma secao de rotina semanal em `/circulacao`, usando a mesma camada operacional da revisao.

A pagina agora mostra:

- quantos itens foram liberados para mapa;
- quantos podem virar pauta/card;
- quantos bairros estao em foco;
- uma lista curta de casos que podem virar card ou pauta agora.

Links reforcados:

- `/admin/revisao` para operar a fila;
- `/bairros/[slug]` para leitura territorial;
- `/circulacao/share/bairro/[bairro]/1x1` para card rapido;
- `/agir` para conectar mobilizacao.

## Resultado operacional

O fluxo semanal passa a ser:

1. A equipe abre `/admin/revisao`.
2. Escolhe um bairro da semana ou um item de maior impacto.
3. Fecha endereco, bairro, localizacao e estimativa.
4. O item pode destravar mapa, bairro e circulacao.
5. A equipe abre `/circulacao` para transformar o caso em card ou pauta.
6. A mobilizacao segue para `/agir` quando houver frente aberta ou necessidade de encaminhamento.

## Arquivos alterados

- `src/lib/data/admin-review.ts`
- `src/app/admin/revisao/page.tsx`
- `src/app/circulacao/page.tsx`

## Validacao

Checks executados:

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK

Validacao local:

- `/admin/revisao`: 200
- `/circulacao`: 200
- bloco `Rotina politica da semana`: presente
- bloco `Da revisao para a pauta`: presente
- bloco `O que pode virar card ou pauta agora`: presente
- links para `/admin/revisao`, `/circulacao`, `/bairros/[slug]` e `/agir`: presentes

## Criterios

| Criterio | Resultado |
| --- | --- |
| Nao criar CMS complexo | Atendido |
| Foco em uso semanal real | Atendido |
| Transformar atualizacao de dado em producao politica | Atendido |
| Fortalecer links entre revisao, circulacao, bairro e acao | Atendido |
| Preservar arquitetura atual | Atendido |

## Pendencias recomendadas

1. Quando a equipe comecar a usar a rotina semanal, definir manualmente qual bairro entra como foco politico da semana se houver criterio externo que a base nao captura.
2. Em rodada futura, permitir marcar explicitamente que um caso revisado "virou pauta", mas apenas se isso for necessario na pratica.

## Conclusao

A revisao deixou de ser apenas fila tecnica e passou a apontar para uma consequencia publica imediata: bairro em foco, mapa atualizado, card compartilhavel e acao possivel. A solucao permanece simples, semanal e ligada ao fluxo real do produto.
