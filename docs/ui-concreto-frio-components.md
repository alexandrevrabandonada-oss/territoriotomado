# Componentes: Concreto Frio

## Principio

O design system do Territorio Tomado deve concentrar a nova linguagem Concreto Frio em poucos componentes usados de verdade. A regra e evitar redesenho pagina por pagina e fazer as telas herdarem a atmosfera por composicao.

## Componentes Base

### `SectionHeader`

Cabecalho textual de secoes e paginas. Mantem a tipografia seca, em caixa alta, com eyebrow marcado por linha amarela.

- `size="default"` para secoes editoriais.
- `size="compact"` para headers internos e areas operacionais.
- `align="center"` apenas quando a secao realmente pede centralidade.

### `Badge`

Etiqueta pequena baseada em `tt-chip`.

- `default`: vidro/concreto para estado neutro.
- `muted`: informacao de apoio.
- `warning`: ferrugem pontual para desgaste, pendencia ou vacancia.
- `critical`: amarelo VR Abandonada para conflito, prioridade e foco.

### `ButtonLink`

Link com aparencia de comando. Usa `tt-button` e as variantes globais:

- `primary`: amarelo VR Abandonada.
- `secondary`: vidro azulado e concreto.
- `ghost`: acao discreta, sem perder legibilidade.

### `EmptyState`

Estado vazio com `tt-panel`, borda tracejada e linha de alerta. Deve parecer uma mesa sem dados, nao um card SaaS amigavel demais.

### `PropertyCard`

Card territorial principal. Usa `tt-card`, massa mineral, bordas frias e foco amarelo quando `highlighted`.

## Componentes de Composicao

### `MetricCard`

Bloco numerico compacto para headers e painéis.

- `default`: concreto frio.
- `critical`: amarelo de alerta.
- `muted`: leitura secundaria.
- `steel`: azul corporativo gasto.

### `PanelCard`

Painel operacional padrao para grupos de conteudo. Aceita `eyebrow`, `title`, `description`, `actions`, `footer`, `variant` e classes locais.

Usar em:

- blocos de operacao
- grupos de cards
- estados de foco
- secoes admin

### `SidebarPanel`

Painel lateral para apoio operacional. Usado em filtros, legendas, atalhos e modo de uso.

### `FilterGroup`

Wrapper simples para labels de filtros. Deve envolver `select`, `input` ou controles equivalentes usando `tt-input`.

### `ActionCard`

Card de frente de acao. Mantem prioridade, CTA, descricao e acoes secundarias em uma estrutura consistente.

Usar em:

- `/agir`
- detalhes de imovel quando houver frentes abertas
- modulos futuros de mobilizacao

## Classes Globais Relacionadas

- `tt-shell`
- `tt-hero`
- `tt-panel`
- `tt-card`
- `tt-metric`
- `tt-chip`
- `tt-button`
- `tt-input`
- `tt-sidebar`

## Regras de Aplicacao

- Preferir estes componentes antes de escrever novas combinacoes de `border`, `bg` e `shadow`.
- Nao criar componente novo para uma combinacao usada uma vez.
- Evitar preto absoluto em superficies; usar `ink`, `ink-alt`, `steel`, `glass` e `concrete`.
- Manter herois internos curtos.
- Manter amarelo para foco, alerta e acao.
- Usar ferrugem apenas como desgaste ou memoria industrial.
