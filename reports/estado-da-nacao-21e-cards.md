# Estado da Nacao 21E: Cards

## Objetivo

Fechar o refresh do design system aplicado aos cards centrais do produto, aumentando densidade util e consolidando a linguagem Concreto Frio.

## PropertyCard

Refatorado para destacar melhor:

- bairro
- status
- criticidade
- contexto curto
- acoes abertas
- prova publica
- CTA principal

Mudancas principais:

- bairro ganhou bloco proprio no topo
- status e criticidade ficam juntos em uma faixa de leitura
- contexto curto ficou mais proximo do titulo
- metricas internas ficaram mais densas
- rodape passou a separar estado territorial e CTAs

## ActionCard

Refatorado para comunicar melhor:

- tipo de acao
- prioridade
- imovel relacionado
- descricao
- CTA principal
- acao secundaria

Novos campos opcionais:

- `actionKind`
- `propertyTitle`

Esses campos reduzem duplicacao de badges nas paginas e deixam a estrutura da mobilizacao mais clara.

## EmptyState

Refatorado para evitar estado vazio generico.

Mudancas:

- ganhou `eyebrow`
- perdeu centralizacao excessiva
- manteve linha de alerta
- ficou mais proximo de um aviso urbano/politico do que de placeholder SaaS

## Rotas Afetadas

- `/imoveis`
- `/agir`
- `/bairros`
- `/bairros/[slug]`
- fichas que usam `PropertyDetail`

## Resultado

Os cards ficaram mais densos e escaneaveis, com menos area vazia e mais informacao util por bloco. A leitura continua forte, seca e politica, mas com melhor hierarquia visual e menos repeticao manual.

## Verificacao

Executado com sucesso:

```bash
npm run lint
npm run typecheck
npm run build
```
