# Sprint 3: Mapa e Bairros

Data: 2026-06-01
Projeto: Territorio Tomado
Escopo: transformar mapa e bairros no eixo central de compreensao territorial

## Objetivo

Fazer o usuario entender o territorio antes de entrar em detalhes fiscais. A rodada reforcou o mapa como ferramenta operacional e o bairro como unidade politica de leitura popular.

## Mapa

`/mapa` foi fortalecido com uma camada de confianca territorial:

- confirmada
- aproximada
- ambigua
- pendente

Os pins do mapa agora seguem o status de localizacao, nao apenas o status de uso do imovel. O popup tambem mostra:

- status do imovel
- criticidade
- localizacao
- prioridade de revisao

Filtros visiveis adicionados:

- bairro
- pronto para mapa
- prioridade revisao
- status localizacao

Os filtros novos tambem entram na URL publica:

- `pronto`
- `revisao`
- `localizacao`

## Bairros

`/bairros` foi reposicionada como eixo de leitura territorial, com foco em concentracao e decisao popular.

Cada bairro agora destaca:

- quantidade de imoveis
- quantidade prontos para mapa
- quantidade de imoveis prioritarios
- acao ligada ao bairro, quando houver

O card de bairro prioriza navegacao entre:

- bairro
- mapa filtrado pelo bairro
- lista de imoveis do bairro

## Detalhe do bairro

`/bairros/[slug]` foi reforcada como unidade politica de leitura.

O topo do bairro agora mostra:

- imoveis
- no mapa
- criticos
- prioritarios

A visao geral ganhou:

- resumo territorial
- relacao de prontos para leitura territorial
- acao ligada ao bairro
- navegacao direta para mapa e imoveis

O mapa interno e a lista de imoveis continuam conectando bairro, mapa e ficha individual.

## Dados e regra operacional

Os campos pedidos ainda nao existem como colunas publicas no schema atual. Para nao abrir uma frente de migration nesta rodada, foram criados campos derivados na camada publica:

- `readyForMap`
- `priorityReview`
- `locationStatus`

Regra aplicada:

- `readyForMap`: verdadeiro quando o imovel tem latitude e longitude validas.
- `priorityReview`: alta para imoveis prioritarios ou criticidade alta; media quando ha criticidade media, acao aberta ou falta de prova; baixa no restante.
- `locationStatus`: confirmada quando ha prova e midia; ambigua quando criticidade alta sem prova; pendente sem coordenada valida; aproximada no restante.

Essa decisao preserva a arquitetura e deixa a interface pronta para receber campos reais depois.

## Arquivos alterados

- `src/types/domain.ts`
- `src/lib/navigation/public-context.ts`
- `src/lib/data/queries.ts`
- `src/lib/data/public-queries.ts`
- `src/app/mapa/page.tsx`
- `src/components/map/map-page-shell.tsx`
- `src/components/map/property-map.tsx`
- `src/components/properties/property-detail.tsx`
- `src/app/bairros/page.tsx`
- `src/app/bairros/[slug]/page.tsx`
- `src/components/properties/property-list-shell.tsx`

## Verificacao tecnica

Executado com sucesso:

```bash
npm run typecheck
npm run build
```

Resultado:

- build concluido com sucesso.
- `/mapa` aumentou de tamanho para acomodar os novos filtros e legenda horizontal.
- `/bairros/[slug]` seguiu buildando normalmente.
- Validação total do Next.js sem avisos de linter ou problemas de compilação.

## QA visual e Fluxos de Navegação

Verificacao local confirmada no browser:

- `/mapa` mostra a legenda "Confianca territorial" diretamente abaixo do mapa.
- `/mapa` mostra confirmada, aproximada, ambigua e pendente com as cores de status corretas.
- `/mapa` mostra filtros horizontais visíveis por bairro, pronto para mapa, prioridade revisao e status localizacao.
- O popup do pin no mapa agora tem o nome do bairro clicável, direcionando diretamente para a rota `/bairros/[slug]`.
- `/bairros` mostra "Bairros como eixo de leitura" e a listagem com métricas chave.
- `/bairros/[slug]` mostra no mapa, prioritarios e acao ligada ao bairro.
- A badge de bairro na ficha de detalhe do imóvel (`/imoveis/[slug]`) agora é clicável, redirecionando o usuário de volta para `/bairros/[slug]`.

## Resultado

Mapa e bairros passaram a operar como eixo central do produto. A leitura ficou menos abstrata e mais territorial: primeiro o usuario entende bairro, confianca de localizacao, prioridade e acao; depois entra na ficha fiscal do imovel. A navegação interliga perfeitamente o Mapa, Bairros e Imóveis.
