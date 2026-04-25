# Estado da Nacao: 23c Agir

## Objetivo

Refatorar `/agir` com a linguagem Concreto Frio para que a rota funcione como central operacional de mobilizacao territorial, e nao como pagina editorial de chamadas.

## O que mudou

- O cabecalho foi encurtado e convertido em barra operacional compacta.
- As acoes urgentes passaram a abrir a pagina, separadas das frentes estruturais em andamento.
- A pagina agora se organiza em tres blocos claros:
  - acoes urgentes
  - acoes em andamento
  - acoes por imovel
- O agrupamento por imovel foi preservado para manter a acao nascendo da ficha concreta do territorio.

## ActionCard

- `ActionCard` foi ajustado para mostrar melhor o contexto territorial.
- Cada card agora pode exibir:
  - tipo da acao
  - prioridade
  - imovel relacionado
  - bairro
  - CTA principal
- O CTA secundario para abrir o imovel foi mantido como apoio.

## Linguagem visual

- Amarelo foi reservado para acao prioritaria e urgencia.
- Azul dessaturado ficou como base das frentes estruturais.
- Ferrugem foi usado apenas para sinalizar criticidade alta, evitando sobrecarga cromatica.
- A rota ficou mais seca, densa e orientada a decisao.

## Preservacoes

- Nenhuma feature nova pesada foi criada.
- A acao continua nascendo do imovel e do feed ja existente.
- Nenhuma logica nova de agenda generica foi introduzida.

## Arquivos afetados

- `src/app/agir/page.tsx`
- `src/components/ui/action-card.tsx`

## Verificacao

Executado com sucesso:

```bash
npm run typecheck
npm run build
```
