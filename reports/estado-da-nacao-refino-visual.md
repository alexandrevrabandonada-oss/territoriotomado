# Estado da Nacao: Refino Visual Estrutural

Data: 2026-04-20
Projeto: Territorio Tomado
Escopo: refino visual estrutural das paginas `/mapa`, `/bairros`, `/agir` e `/admin`

## Objetivo

Reduzir a sensacao de landing repetida nas paginas internas, trazer o conteudo util mais cedo para a dobra e diferenciar melhor o ritmo visual entre as areas publicas e operacionais, sem perder a identidade VR Abandonada.

## O que foi feito

### 1. Cabecalhos internos compactados

- `SectionHeader` passou a aceitar modo `compact`.
- As paginas refinadas deixaram de usar o mesmo gesto monumental da home.
- Titulos, descricoes e espacamentos foram reduzidos para que a parte operacional apareca mais cedo.

Arquivo base alterado:

- `src/components/ui/section-header.tsx`

### 2. Mapa com leitura mais instrumental

- `/mapa` ganhou abertura mais curta, com cabecalho compacto e metricas resumidas logo no topo.
- O shell do mapa ficou mais denso: filtros, legenda e leitura rapida foram comprimidos.
- O mapa passou a dominar a dobra mais cedo, em vez de disputar espaco com blocos introdutorios longos.

Arquivos alterados:

- `src/app/mapa/page.tsx`
- `src/components/map/map-page-shell.tsx`

### 3. Bairros com ritmo mais territorial

- `/bairros` deixou de parecer uma landing com cards grandes e repetidos.
- O topo foi condensado em um bloco de leitura geral com contadores inline.
- Cada bairro agora organiza narrativa e metricas em duas zonas: leitura politica + quadro sintetico do territorio.

Arquivo alterado:

- `src/app/bairros/page.tsx`

### 4. Agir com tom mais convocatorio

- `/agir` foi reorganizada para funcionar como frente operacional, nao como vitrine.
- O topo agora combina resumo compacto e quadro de contagem mais seco.
- Os agrupamentos por imovel ficaram mais diretos, com menos respiro inutil e CTA entrando mais cedo.

Arquivo alterado:

- `src/app/agir/page.tsx`

### 5. Admin com cara de mesa de operacao

- `/admin` deixou de usar bloco vazio largo como elemento central.
- O topo ficou mais compacto e o corpo foi reorganizado em dois eixos:
  - estado da operacao editorial
  - atalhos operacionais
- O painel ficou menos "landing institucional" e mais "console editorial seco".

Arquivo alterado:

- `src/app/admin/page.tsx`

## Criterios atendidos

- nao houve redesenho completo da base
- a home segue como pagina mais monumental
- o conteudo util comeca mais cedo nas paginas internas
- metricas e contadores ficaram mais compactos
- cada area ganhou ritmo proprio sem virar dashboard corporativo
- a estetica VR Abandonada foi preservada

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
- depois de `npm run build`, o `npm run typecheck` foi executado novamente e passou

## Resultado final

As paginas internas agora diferenciam melhor funcao e ritmo:

- `mapa`: leitura espacial e instrumental
- `bairros`: leitura territorial e agregada
- `agir`: mobilizacao e CTA
- `admin`: operacao editorial

A base ficou mais util acima da dobra e menos repetitiva, sem romper a direcao visual do produto.
