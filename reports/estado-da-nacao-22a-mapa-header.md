# Estado da Nacao: 22a Mapa Header

## Objetivo

Iniciar a prova de conceito da linguagem Concreto Frio na rota `/mapa`, fazendo a tela deixar de parecer uma pagina editorial com mapa embutido e passar a operar como ferramenta territorial.

## O que mudou

- O cabecalho de `/mapa` foi encurtado para manter apenas titulo, frase curta de contexto, metricas essenciais e uma acao principal.
- O topo ganhou tratamento mais mineral, com azul dessaturado, grafite e amarelo reservado para alerta e CTA.
- O mapa passou a aparecer mais cedo na dobra ao mover os paines de apoio e foco rapido para depois da visualizacao principal.
- O resumo operacional acima do mapa foi mantido, mas reduzido para leitura imediata de visibilidade e estado do recorte.

## Decisoes de hierarquia

- O header deixou de competir com a ferramenta e passou a funcionar como barra de contexto.
- O mapa agora e o primeiro bloco estrutural da experiencia, com filtros persistindo na lateral.
- O foco de imovel e os chips de bairro/imovel continuam disponiveis, mas descem um nivel na hierarquia para nao empurrar o mapa para baixo.

## Preservacoes

- Nenhuma alteracao foi feita na query layer.
- Filtros, foco de imovel, navegacao contextual e pins do React-Leaflet foram preservados.
- A composicao continua usando os mesmos dados publicados e o mesmo fluxo de contexto de navegacao.

## Arquivos afetados

- `src/app/mapa/page.tsx`
- `src/components/map/map-page-shell.tsx`

## Verificacao

Executado com sucesso:

```bash
npm run typecheck
```

Build completo ainda deve ser mantido como validacao complementar quando a iteracao visual do mapa fechar.
