# Sprint 9 - Circulacao operativa

Data: 2026-06-01

## Objetivo

Transformar a frente de circulacao em ferramenta politica continua, conectando rankings, bairros, imoveis e acao sem virar dashboard.

## O que mudou

### Circulacao

`/circulacao` deixou de ser apenas vitrine de rankings e passou a operar como ponto de encaminhamento.

Foram adicionados CTAs diretos para:

- compartilhar ranking ou bairro;
- abrir bairro;
- entrar na frente;
- ver acao aberta;
- ajudar na revisao.

Os itens de ranking agora conduzem para bairro, acao ou revisao conforme o tipo de dado. A fila de revisao prioritaria aponta para a operacao de revisao.

### Bairros como base de mobilizacao

Os resumos por bairro foram fortalecidos para explicar:

- quantidade de registros;
- quantidade pronta para mapa;
- prioridade de revisao;
- separacao entre dado oficial, estimado e revisao;
- uso politico do recorte para pauta local, imprensa e mobilizacao.

Cada card de bairro em `/circulacao` agora mostra tambem imoveis estrategicos derivados da camada final.

### Imoveis estrategicos por bairro

Foi criado um recorte de estrategia por bairro em duas frentes:

- em `/circulacao`, cada bairro destacado traz ate tres enderecos estrategicos da base final;
- em `/bairros/[slug]`, o bloco "Por onde agir primeiro" destaca fichas publicadas com link direto para ficha, card compartilhavel e acao.

A priorizacao considera criticidade, prioridade de revisao, acao aberta e pressao fiscal/estimada.

### Conexao com acao

O caminho publico ficou mais direto:

- ranking leva a bairro, frente ou revisao;
- bairro leva a ficha, share pack e acao;
- ficha continua levando a acao persistente;
- `/agir` segue como central das frentes abertas.

## Separacao oficial / estimado / revisao

A leitura foi preservada:

- IPTU 2025 aparece como dado oficial observado;
- valor venal aparece como estimado;
- localizacao, prioridade e valor em revisao continuam explicitados como revisao.

Nos blocos de bairro e imovel estrategico, a copia usa estes marcadores em vez de misturar tudo como indicador unico.

## Ajuste tecnico adicional

O detalhe de bairro importava o mapa Leaflet diretamente no server component. Isso gerava `window is not defined` em producao durante SSR. Foi criado `src/components/map/property-map-client.tsx` para carregar o mapa client-only, preservando a UI e corrigindo o 500 em `/bairros/[slug]`.

## Arquivos principais

- `src/lib/data/circulation.ts`
- `src/app/circulacao/page.tsx`
- `src/app/bairros/[slug]/page.tsx`
- `src/components/map/property-map-client.tsx`

## Validacao

Comandos executados:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Resultado: todos passaram.

Rotas verificadas em producao local (`http://127.0.0.1:3003`):

- `/circulacao` - 200
- `/bairros/aterrado` - 200
- `/imoveis/galpao-logistico-aterrado` - 200
- `/agir` - 200
- `/circulacao/share/ranking/top-iptu-2025/1x1` - 200, `image/png`
- `/circulacao/share/bairro/aterrado/1x1` - 200, `image/png`

Checagem textual:

- `/circulacao` contem compartilhar, entrar na frente, ver acao, ajudar revisao e imoveis estrategicos.
- `/bairros/aterrado` contem compartilhar bairro, ver acao aberta, ajudar revisao e "Por onde agir primeiro".

## Estado final

A circulacao ficou menos decorativa e mais operativa: cada ranking aponta para um uso politico imediato, cada bairro ganha resumo publico forte e cada recorte territorial oferece proximo passo claro.
