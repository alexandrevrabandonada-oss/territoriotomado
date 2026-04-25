# Estado da Nacao: 23d Imoveis

## Objetivo

Refatorar `/imoveis` com a linguagem Concreto Frio para que a listagem funcione como acervo territorial vivo, navegavel e denso, com leitura rapida do problema sem excesso visual.

## O que mudou

- O cabecalho foi encurtado e convertido em barra operacional compacta.
- O topo agora mostra leitura sintetica do acervo:
  - total de imoveis
  - total de casos criticos
  - quantos tem acao aberta
  - quantos tem prova ou documento publico
- A rota ganhou acesso direto para mapa e frentes de acao sem parecer landing editorial.

## Filtros e navegacao

- Os filtros existentes foram preservados e reforcados com `FilterGroup`.
- O shell agora explicita melhor o recorte ativo e resume o resultado filtrado.
- A ordenacao da lista passou a priorizar:
  - criticidade
  - existencia de acao aberta
  - existencia de prova
- Nenhum filtro complexo novo foi criado.
- Nenhuma busca textual nova foi introduzida nesta rodada, porque nao havia base pronta no contexto publico atual.

## PropertyCard

- Os cards ficaram mais densos e diretos.
- Cada card agora deixa claro:
  - nome do imovel
  - bairro
  - status
  - criticidade
  - resumo curto
  - existencia de acao aberta
  - existencia de prova ou documento
- A criticidade alta recebe destaque sutil, sem transformar a lista em alerta visual constante.
- Sinais redundantes e decorativos foram reduzidos para priorizar leitura territorial.

## Estado vazio

- O estado vazio foi reescrito para explicar melhor que nenhum imovel cruzou o recorte atual.
- A saida principal orienta o usuario a voltar ao mapa para reler a distribuicao territorial completa.

## Arquivos afetados

- `src/app/imoveis/page.tsx`
- `src/components/properties/property-list-shell.tsx`
- `src/components/properties/property-card.tsx`

## Verificacao

Executado com sucesso:

```bash
npm run typecheck
npm run build
```
