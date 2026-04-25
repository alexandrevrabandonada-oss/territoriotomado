# Estado da Nacao: Cards Densos

## Objetivo

Aumentar a densidade util dos cards publicos sem transformar lista, bairros e agir em blocos pesados ou com cara de dashboard.

## O que mudou

### Imoveis

- O card de imovel passou a mostrar sinais operacionais antes do clique:
  - bairro
  - status
  - criticidade
  - prioridade
  - total de acoes abertas
  - presenca de prova publica
  - contagem de documentos publicos
  - presenca de galeria
- O CTA principal ficou mais claro e o bloco inferior perdeu vazio estrutural.

### Bairros

- Os cards de bairro agora entregam leitura territorial mais rapida:
  - total de frentes abertas
  - quantidade de imoveis com prova
  - volume de documentos publicos
  - quantidade de imoveis prioritarios
- As metricas laterais foram compactadas para fazer o conteudo util aparecer antes.

### Agir

- Os agrupamentos por imovel agora mostram contexto editorial e territorial antes da lista de acoes:
  - frentes abertas no imovel
  - prova publica
  - presenca de galeria
  - prioridade do imovel
- Cada acao ganhou hierarquia mais direta entre tipo, titulo, chamada e CTA.

## Decisoes de implementacao

- A densidade veio de agregados leves na camada `src/lib/data/public-queries.ts`, nao de logica espalhada nas paginas.
- `Property` ganhou campos publicos de resumo para reutilizacao em lista, mapa e acao sem retrabalho.
- Nao houve mudanca de arquitetura nem criacao de componentes pesados novos.

## Resultado

- Mais leitura por tela.
- Melhor scan em mobile e desktop.
- Cards menos vazios e mais operacionais.
- Mantida a estetica seca, contrastada e direta do produto.
