# Estado da Nacao: Mobile Mode

Data: 2026-04-20
Projeto: Territorio Tomado
Escopo: navegacao mobile mais operacional nas paginas publicas

## Objetivo

Aproximar o produto de uma experiencia mais viva de app no mobile, com navegacao fixa de campo, melhor hierarquia em viewport pequena e CTAs mais proximos do conteudo principal, sem quebrar o desktop e sem diluir a identidade VR Abandonada.

## O que mudou

### 1. Barra inferior mobile fixa

Foi criada uma barra inferior fixa para mobile com acesso direto a:

- `inicio`
- `bairros`
- `mapa`
- `imoveis`
- `agir`

Ela so aparece abaixo de `lg`, preservando a topbar de navegacao no desktop.

Arquivo principal:

- `src/components/layout/app-shell.tsx`

### 2. Topbar preservada no desktop

- A navegacao superior continua ativa no desktop.
- No mobile, o topo ficou mais enxuto e a navegacao principal migrou para a base da tela.
- O shell agora adiciona espaco inferior no `main` para evitar colisao com a barra fixa.

## Ajustes de viewport pequena

### Mapa

- altura do mapa reduzida no mobile para comportamento mais util e menos pesado
- painéis laterais mantidos compactos
- o mapa passa a entrar mais cedo na tela

Arquivos:

- `src/components/map/property-map.tsx`
- `src/components/map/map-page-shell.tsx`

### Bairros

- cards continuam densos, mas os CTAs foram aproximados do conteudo
- no mobile, os botoes passam a ocupar largura cheia para gesto mais direto
- espaco vertical geral foi reduzido

Arquivo:

- `src/app/bairros/page.tsx`

### Agir

- CTAs superiores agora entram em pilha no mobile
- botoes por frente de acao tambem passam a largura cheia em viewport pequena
- cabecalhos internos e blocos foram mantidos secos e mais proximos da acao

Arquivo:

- `src/app/agir/page.tsx`

### Admin

- atalhos operacionais passaram para largura cheia no mobile
- ritmo geral mais compacto para leitura e acao rapida

Arquivo:

- `src/app/admin/page.tsx`

## Decisao de interface

O produto agora se comporta mais como app territorial e menos como site com menu superior em viewport pequena:

- navegacao principal foi trazida para o polegar
- conteudo util ganhou prioridade sobre apresentacao
- desktop foi preservado como camada de operacao mais aberta

## Criterios atendidos

- nao quebrou desktop
- mobile ficou mais operacional de verdade
- mapa, agir e bairros ganharam comportamento melhor em viewport pequena
- CTAs foram aproximados do conteudo principal
- a identidade VR Abandonada foi preservada
- nao foi introduzido excesso de animacao

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

- o primeiro `typecheck` falhou por referencias stale em `.next/types` antes da regeneracao do build
- depois do `npm run build`, o `npm run typecheck` foi executado novamente e passou

## Resultado final

O projeto agora tem um modo mobile mais coerente com uso territorial e de campo:

- navegacao principal fixa na base
- desktop preservado
- CTAs mais proximos do gesto
- paginas publicas mais confortaveis em viewport pequena
