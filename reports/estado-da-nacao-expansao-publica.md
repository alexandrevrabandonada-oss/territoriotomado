# Estado da Nacao: Expansao Publica Concreto Frio

## Objetivo

Expandir a linguagem Concreto Frio para as principais rotas publicas, reduzindo a repeticao de herois internos e consolidando um sistema visual mais maduro, mineral e operacional.

## Rotas Aplicadas

- `/`
- `/bairros`
- `/bairros/[slug]`
- `/agir`
- `/imoveis`
- `/imoveis/[slug]`

## Mudancas por Area

### Home

- Mantida como pagina mais monumental do produto.
- Hero principal preserva escala editorial e manifesto.
- Blocos auxiliares passaram a usar `MetricCard` e `PanelCard`, deixando a home alinhada ao sistema sem perder peso simbolico.

### Bairros

- Cabecalho interno ficou mais compacto.
- Cards territoriais passaram a usar `PanelCard` com densidade maior.
- Estados de bairro foram convertidos para `Badge`, reforcando a leitura de pressao, prioridade e acompanhamento.
- A leitura territorial por bairro ficou mais distinta da listagem de imoveis e da chamada de acao.

### Bairro Individual

- Cabecalho compactado.
- Mapa focado foi encapsulado em `PanelCard` e recebeu altura mais controlada para nao competir com o restante da leitura.
- Imoveis do bairro usam `PropertyCard` dentro de painel operacional.
- Acoes ativas usam `ActionCard` dentro de `SidebarPanel`.
- Leitura curta virou painel lateral, deixando a pagina mais operacional.

### Agir

- Cabecalho interno reduzido.
- Grupos por imovel seguem `PanelCard`.
- Frentes de acao usam `ActionCard`, reforcando a diferenca visual entre mobilizacao e ficha/acervo.

### Imoveis

- Cabecalho interno reduzido.
- `PropertyListShell` passou a usar `PanelCard`, `FilterGroup`, `tt-input` e botoes globais.
- Filtros agora parecem ferramenta territorial, nao formulario generico.
- Cards ganharam mais consistencia via `PropertyCard`.

### Ficha de Imovel

- Cabecalho reduzido e mais operacional.
- Retorno inteligente, bloco principal, timeline, documentos, propostas, relatos e acao foram migrados para `PanelCard`, `SidebarPanel` e `ActionCard`.
- Galeria e capa usam `tt-card`, reduzindo preto pesado e aumentando massa mineral.
- A ficha ficou mais densa, com hierarquia clara entre situacao, acervo e mobilizacao.

## Componentes Reforcados

- `MetricCard`
- `PanelCard`
- `ActionCard`
- `SidebarPanel`
- `FilterGroup`
- `PropertyCard`
- `EmptyState`
- `Badge`
- `ButtonLink`

## Resultado

As paginas internas deixaram de repetir ritmo de landing e passaram a funcionar mais como superficies de operacao territorial. A home continua sendo a entrada monumental; bairros, agir e imoveis ficaram mais secos, densos e claros.

## Verificacao

Executado com sucesso:

```bash
npm run lint
npm run typecheck
npm run build
```

Tambem foi feita varredura nas rotas e componentes publicos principais para remover ocorrencias antigas de `border-paper/10`, `bg-paper/5` e `bg-ink/` nas superficies afetadas.
