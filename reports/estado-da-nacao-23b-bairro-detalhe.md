# Estado da Nacao: 23b Bairro Detalhe

## Objetivo

Aplicar a linguagem Concreto Frio na pagina de detalhe de bairro para que ela funcione como leitura territorial objetiva, conectando acervo, criticidade e mobilizacao.

## O que mudou

- O hero da pagina foi reduzido para um topo compacto com nome do bairro, resumo territorial curto, metricas e CTAs operacionais.
- O topo agora mostra imediatamente:
  - nome do bairro
  - resumo territorial
  - imoveis mapeados
  - imoveis criticos
  - acoes abertas
- A pagina foi reorganizada em quatro blocos claros:
  - visao geral
  - mapa e lista de imoveis do bairro
  - acoes abertas
  - imoveis criticos
- O layout passou a usar `MetricCard`, `PanelCard` e `Badge` de forma consistente com a linguagem nova.
- Os cards de imovel receberam modo compacto para aumentar densidade util nessa pagina sem reabrir outras rotas.

## Decisoes

- Nenhuma feature nova pesada foi criada.
- Foram reaproveitadas as queries ja existentes de detalhe de bairro e os componentes de mapa, acao e imovel.
- A linguagem politica foi mantida, mas com texto mais curto, mais objetivo e mais ligado a disputa territorial concreta.
- O bairro deixou de parecer categoria administrativa neutra e passou a funcionar como unidade de pressao, leitura e mobilizacao.

## Arquivos afetados

- `src/app/bairros/[slug]/page.tsx`
- `src/components/properties/property-card.tsx`

## Verificacao

Executado com sucesso:

```bash
npm run typecheck
npm run build
```
