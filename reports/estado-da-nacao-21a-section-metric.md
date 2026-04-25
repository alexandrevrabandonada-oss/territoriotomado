# Estado da Nacao 21A: SectionHeader + MetricCard

## Objetivo

Consolidar a linguagem Concreto Frio nos componentes de estrutura e hierarquia, reduzindo a repeticao de herois grandes e padronizando metricas do sistema.

## SectionHeader

`SectionHeader` foi refatorado para suportar variantes:

- `hero`: monumental, para home e momentos de entrada editorial.
- `page`: medio, para paginas publicas.
- `compact`: curto, para mapa, admin e telas internas operacionais.

Compatibilidade preservada:

- `size="compact"` continua funcionando e resolve para `variant="compact"`.
- Chamadas antigas sem `variant` seguem como `page`.

## MetricCard

`MetricCard` agora suporta:

- `label`
- `value`
- `description`
- `helper` legado
- `tone`
- `compact`
- `className`

Tons disponiveis:

- `default`: concreto frio padrao.
- `yellow`: amarelo VR Abandonada.
- `blue`: azul dessaturado / vidro institucional.
- `rust`: desgaste pontual.
- `alert`: alerta com peso visual maior.
- `critical`, `muted` e `steel` foram preservados por compatibilidade.

## Aplicacao Inicial

### `/`

- Hero principal passou a usar `SectionHeader variant="hero"`.
- Metricas do bloco monumental receberam `description` e tons mais vivos (`blue`, `rust`, `default`).

### `/mapa`

- Cabecalho operacional passou a usar `SectionHeader variant="compact"`.
- Metricas usam tons mais expressivos (`blue`, `alert`, `default`).

### `/admin`

- Topo operacional passou a usar `SectionHeader variant="compact"`.
- Metricas mantem densidade e usam `alert` quando ha pendencias.

## Resultado

A hierarquia visual ficou mais sistemica: home continua monumental, enquanto mapa e admin ficam mais curtos e operacionais. As metricas ganharam mais massa mineral e variacao cromatica sem perder legibilidade.

## Verificacao

Executado com sucesso:

```bash
npm run lint
npm run typecheck
npm run build
```
