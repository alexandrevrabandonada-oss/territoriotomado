# Estado da Nacao: Mapa First

Data: 2026-04-20
Projeto: Territorio Tomado
Escopo: fortalecimento da rota `/mapa` como eixo cartografico central

## Objetivo

Fazer com que `/mapa` deixe de parecer apenas uma pagina com mapa e passe a funcionar como experiencia cartografica central do produto, com mais area util, leitura mais operacional e foco rapido por bairro e por imovel.

## O que mudou

### 1. Bloco editorial superior reduzido

- o topo de `/mapa` foi comprimido para um cabeçalho utilitario
- a abertura agora ocupa menos altura e entrega contexto rapido, nao discurso
- as metricas continuam presentes, mas em formato enxuto

Arquivo:

- `src/app/mapa/page.tsx`

### 2. Mais area util para o mapa

- o shell passou a priorizar ainda mais a coluna do mapa no desktop
- a experiencia agora entra mais cedo em uso real e menos em apresentacao
- o mapa continua dominante em relacao ao painel lateral

Arquivo:

- `src/components/map/map-page-shell.tsx`

### 3. Painel lateral mais funcional

- filtros ganharam leitura de estado mais clara
- legenda passou a reforcar melhor a diferenca entre status e selecao ativa
- o bloco lateral foi reorganizado para parecer ferramenta de uso, nao vitrine
- no desktop o painel lateral ficou `sticky`, reforcando o mapa como centro da operacao

Arquivo:

- `src/components/map/map-page-shell.tsx`

### 4. Foco rapido por bairro e por imovel

Foi adicionada uma camada de foco rapido sem aumentar a complexidade cartografica:

- chips de bairro com contagem
- chips de imovel para selecao direta
- foco por imovel preservado mesmo quando o recorte nao o inclui naturalmente
- limpeza de foco sem perder o contexto do mapa

Arquivo:

- `src/components/map/map-page-shell.tsx`

### 5. Pins e selecao ativa mais fortes

- pins ficaram mais marcados visualmente
- estado em foco recebeu tratamento mais evidente
- marcador selecionado ganhou assinatura visual distinta e prioridade de camada
- o mapa agora comunica melhor “uso ativo” e “objeto selecionado”

Arquivo:

- `src/components/map/property-map.tsx`

## Resultado de UX

O mapa passou a operar em um ritmo mais central:

- o usuario entra mais rapido em leitura territorial
- o recorte por bairro e por imovel ficou mais imediato
- a relacao entre mapa, ficha e lista ficou mais clara
- a pagina perdeu cara de “landing com mapa” e ganhou cara de “produto em uso”

## Criterios atendidos

- o bloco editorial superior foi reduzido
- o mapa ganhou mais centralidade e area util
- o painel lateral ficou mais legivel e operacional
- o foco rapido por bairro e por imovel foi implementado
- pins, estados e selecao ativa foram reforcados visualmente
- nao foi adicionada complexidade cartografica desnecessaria

## Validacao

Comandos executados:

- `npm run lint`
- `npm run build`
- `npm run typecheck`

Resultado:

- `lint`: OK
- `build`: OK
- `typecheck`: OK

Observacao:

- o primeiro `typecheck` falhou por referencias stale em `.next/types`
- depois do `build`, o `typecheck` foi executado novamente e passou

## Arquivos principais alterados

- `src/app/mapa/page.tsx`
- `src/components/map/map-page-shell.tsx`
- `src/components/map/property-map.tsx`
