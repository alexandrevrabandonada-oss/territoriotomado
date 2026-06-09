# Sprint 10 - Operacao territorial de revisao

Data: 2026-06-01

## Objetivo

Transformar `/admin/revisao` em fluxo cotidiano de trabalho politico e territorial, permitindo atacar primeiro os casos que mais melhoram mapa, narrativa e circulacao publica.

## O que mudou

### Ordenacao operacional

A fila de revisao agora aceita ordenacao por:

- inteligencia geral;
- impacto fiscal;
- prioridade de revisao;
- bairro;
- pronto para mapa.

A ordenacao padrao usa uma pontuacao de impacto que combina:

- `prioridade_revisao`;
- localizacao pendente ou ambigua;
- item ainda nao pronto para mapa;
- valor venal em revisao manual;
- peso fiscal de IPTU 2025 e valor venal estimado.

### Visao por bairro

Foi adicionada uma visao lateral por bairro com:

- total de itens;
- pendencias;
- casos de prioridade alta;
- itens prontos para mapa;
- impacto fiscal agregado;
- CTA para revisar aquele bairro.

Isso reduz a fila cega e permite planejar mutiroes por territorio.

### Visao de maiores impactos

A tela passou a mostrar tres recortes de revisao:

- maiores imoveis para revisar por impacto fiscal combinado;
- maior IPTU 2025 observado;
- maior valor venal estimado.

Esses blocos ajudam a priorizar o que pode virar pauta publica, card, pressao de imprensa ou revisao metodologica.

### Impacto no produto publico

Foram adicionadas metricas de impacto direto:

- itens liberados para mapa;
- itens que deixaram de ser ambiguos ou pendentes;
- itens liberados para circular com localizacao e estimativa decididas.

Cada item da fila tambem indica se pode melhorar mapa, resolver ambiguidade ou circular.

## Arquivos alterados

- `src/lib/data/admin-review.ts`
- `src/app/admin/revisao/page.tsx`
- `reports/sprint-10-operacao-territorial.md`

## Validacao

Comandos executados:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Resultado: todos passaram.

Rotas verificadas em producao local (`http://127.0.0.1:3003`):

- `/admin/revisao` - 200
- `/admin/revisao?ordenar=impacto_fiscal` - 200
- `/admin/revisao?ordenar=bairro&bairro=ATERRADO` - 200
- `/circulacao` - 200
- `/bairros/aterrado` - 200

Checagem textual:

- ordenacao operacional renderizada;
- visao por bairro renderizada;
- impacto publico renderizado;
- maiores imoveis, maior IPTU e maior valor venal renderizados;
- filtro por bairro renderizado.

## Estado final

A revisao deixou de ser uma fila unica e passou a operar como mesa de decisao: a equipe pode priorizar por territorio, impacto fiscal, mapa ou circulacao publica, escolhendo o que melhora primeiro o produto e a disputa politica.
