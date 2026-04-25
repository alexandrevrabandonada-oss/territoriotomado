# Estado da Nacao: 22c Mapa Leitura

## Objetivo

Melhorar a leitura rapida da rota `/mapa` sem adicionar complexidade pesada, fazendo filtros, legenda e resumo territorial explicarem o quadro em poucos segundos.

## O que mudou

- A legenda lateral foi refinada para virar leitura operacional curta, com cada status mostrando chip de status, contador rapido e qualificacao territorial.
- Os contadores por status passaram a ser calculados a partir do recorte ja carregado no shell, sem query nova.
- Filtros ativos agora aparecem destacados com badges do design system e com realce visual direto no bloco de filtros.
- O botao de limpar filtros ficou mais explicito e agora desabilita quando nao ha recorte aplicado.
- O estado vazio do mapa passou a reconhecer quando o recorte eliminou todo o quadro, exibindo contexto e CTA de recuperacao.

## Decisoes

- A leitura continua compacta e sem grafico pesado.
- O painel lateral nao virou dashboard: os numeros continuam restritos ao necessario para leitura rapida do mapa.
- A estetica Concreto Frio foi mantida com superfices minerais, contraste contido e amarelo reservado para alerta, foco e recorte ativo.

## Preservacoes

- Nenhuma alteracao foi feita na query layer.
- Nenhum grafico, clustering ou camada nova foi introduzido.
- O mapa, os pins e a navegacao contextual seguem com a mesma logica existente.

## Arquivo afetado

- `src/components/map/map-page-shell.tsx`

## Verificacao

Executado com sucesso:

```bash
npm run typecheck
```
