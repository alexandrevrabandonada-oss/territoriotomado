# Estado da Nacao 21D: Panels

## Objetivo

Consolidar paineis laterais e blocos operacionais na linguagem Concreto Frio, criando massa visual util para mapa, admin, bairros e agir sem transformar o produto em dashboard SaaS.

## Componentes

### `PanelCard`

Painel operacional principal.

Suporta:

- `variant`: `panel` ou `card`
- `density`: `default` ou `compact`
- `tone`: `default`, `strong`, `alert`
- `eyebrow`, `title`, `description`, `actions`, `footer`
- `className` e `contentClassName`

Uso previsto:

- blocos operacionais
- filas editoriais
- foco ativo
- agrupamentos de conteudo
- secoes internas com densidade

### `SidebarPanel`

Painel lateral para apoio operacional.

Suporta:

- `dense`
- `tone`: `default`, `command`, `alert`
- `badge`
- `className`

Uso previsto:

- filtros
- legenda
- resumo operacional
- blocos administrativos
- comandos laterais

### `FilterGroup`

Wrapper de filtros para mapa e listagens.

Suporta:

- `label`
- `meta`
- `description`
- `className`

Foi ajustado para carregar metadado curto e descricao operacional, reforcando que filtros sao ferramenta territorial e nao formulario generico.

## Aplicacao Inicial

### `/mapa`

- Blocos de cartografia ativa, foco ativo e foco rapido usam `PanelCard`.
- Painel de filtros usa `SidebarPanel dense tone="command"`.
- Legenda usa `SidebarPanel dense tone="command"`.
- `FilterGroup` recebeu descricoes:
  - status: ocupacao, vacancia ou disputa
  - criticidade: prioridade de leitura publica
  - bairro: unidade territorial

### `/admin`

- Topo de operacao usa `PanelCard tone="strong" density="compact"`.
- Fila editorial usa `PanelCard`, com `tone="alert"` quando ha pendencias.
- Comandos usam `SidebarPanel dense tone="command"`.

## Resultado

Mapa e admin ganharam superficies mais densas, minerais e operacionais. A linguagem usa grafite, chumbo, azul dessaturado e concreto claro com bordas discretas, evitando preto puro e containers vazios.

## Verificacao

Executado com sucesso:

```bash
npm run lint
npm run typecheck
npm run build
```
