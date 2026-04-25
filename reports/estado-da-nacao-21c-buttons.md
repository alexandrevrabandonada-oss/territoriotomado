# Estado da Nacao 21C: Buttons

## Objetivo

Padronizar a camada de botoes e CTAs na linguagem Concreto Frio, reduzindo inconsistencia entre paginas publicas e admin.

## ButtonLink

`ButtonLink` agora suporta quatro variantes:

- `primary`: CTA principal amarelo VR Abandonada.
- `secondary`: CTA estrutural em azul dessaturado / vidro frio.
- `ghost`: CTA neutro de navegacao, com presenca leve.
- `danger`: CTA critico em ferrugem mineral.

## Tokens Globais

As classes globais foram ajustadas em `globals.css`:

- `tt-button`
- `tt-button-primary`
- `tt-button-secondary`
- `tt-button-ghost`
- `tt-button-danger`

Os botoes mantem:

- caixa alta
- tracking forte
- borda seca
- densidade compacta
- contraste alto

## Aplicacao Inicial

### `/`

- CTA principal segue amarelo para abrir mapa.
- CTA de acervo usa `secondary`.
- Chamada publica foi ajustada para `secondary`, evitando sumir como acao importante.

### `/agir`

- `Abrir mapa` virou CTA principal.
- `Ver fichas` virou CTA estrutural secundario.
- Compartilhamentos seguem `ghost`.

### `/admin`

- Comandos laterais foram diferenciados:
  - revisar contribuicoes vira principal quando ha pendencias.
  - gerir imoveis fica estrutural.
  - formulario publico fica neutro.

### `/enviar`

- Cabecalho ficou mais compacto.
- Submit do formulario passou a usar `tt-button tt-button-primary`.
- Inputs foram aproximados de `tt-input`.
- CTA secundario `Ver imoveis` segue via `ButtonLink`.

## Resultado

As acoes ficaram mais coerentes e escaneaveis: amarelo para acao principal, azul dessaturado para estrutura, ghost para navegacao e ferrugem para casos criticos. A interface mantem forca politica sem cair em padrao de e-commerce.

## Verificacao

Executado com sucesso:

```bash
npm run lint
npm run typecheck
npm run build
```
