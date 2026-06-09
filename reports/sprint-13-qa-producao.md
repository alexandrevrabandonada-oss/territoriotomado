# Sprint 13 - QA de producao

Data: 2026-06-02

## Escopo

Validacao publica em producao do Territorio Tomado, com foco em estabilidade, leitura publica, renderizacao mobile/PWA, share packs, OG images e ausencia de erro de SSR no mapa.

Ambiente validado:

- Producao canonica: https://territoriotomado.vercel.app
- Deploy aplicado nesta rodada: `territoriotomado-2y26gv7po-alexandrevrabandonada-oss-projects.vercel.app`

## Ajustes feitos durante a validacao

1. O deploy canonico estava antigo e apresentava falhas reais:
   - `/circulacao`: 404
   - `/admin/revisao`: 404
   - `/bairros/aterrado`: 500

2. O build de preview falhou porque `src/lib/data/final-signals.ts` tentava ler o CSV local `base_csn_final_unificada.csv` durante o build remoto. A camada foi ajustada para:
   - priorizar Supabase quando as variaveis remotas existem;
   - manter o CSV local apenas como fallback de transicao;
   - nao quebrar build remoto quando o arquivo local nao existe.

3. A OG image raiz falhou em runtime por CSS nao aceito pelo renderer do `next/og`:
   - removido `display: inline-flex`;
   - removido `width: fit-content`;
   - substituido por `display: flex`.

4. Foi feito deploy de producao via Vercel CLI e a URL canonica passou a apontar para a versao atual.

## Checklist de rotas publicas

Validacao HTTP em producao canonica:

| Rota | Status | Resultado |
| --- | ---: | --- |
| `/` | 200 | OK |
| `/mapa` | 200 | OK |
| `/bairros` | 200 | OK |
| `/bairros/aterrado` | 200 | OK |
| `/imoveis/galpao-logistico-aterrado` | 200 | OK |
| `/agir` | 200 | OK |
| `/circulacao` | 200 | OK |
| `/admin/revisao` | 200 | OK |

Resultado: todas as rotas criticas renderizam em producao.

## Share packs e OG images

Validacao HTTP em producao:

| Asset dinamico | Status | Tipo |
| --- | ---: | --- |
| `/opengraph-image` | 200 | `image/png` |
| `/circulacao/opengraph-image` | 200 | `image/png` |
| `/imoveis/galpao-logistico-aterrado/opengraph-image` | 200 | `image/png` |
| `/agir/opengraph-image` | 200 | `image/png` |
| `/circulacao/share/ranking/top-iptu-2025/1x1` | 200 | `image/png` |
| `/circulacao/share/ranking/revisao-prioritaria/9x16` | 200 | `image/png` |
| `/circulacao/share/bairro/aterrado/1x1` | 200 | `image/png` |
| `/imoveis/galpao-logistico-aterrado/share/1x1` | 200 | `image/png` |
| `/imoveis/galpao-logistico-aterrado/share/9x16` | 200 | `image/png` |
| `/agir/share/1x1` | 200 | `image/png` |
| `/agir/share/9x16` | 200 | `image/png` |

Resultado: share packs e OG images respondem corretamente em producao.

## Mapa client-only e SSR

Validacoes feitas:

- `/mapa` responde 200 em producao.
- O mapa Leaflet renderiza tiles e marcadores apos carregamento client-side.
- Nao houve erro de SSR no carregamento da rota.
- Capturas desktop e mobile confirmam mapa nao branco, controles visiveis e marcadores ativos.

Observacao residual: no mobile, a navegacao fixa inferior cobre a borda inferior do mapa. Nao bloqueia uso, mas pode ser refinado em uma rodada futura de acabamento de mapa mobile.

## Mobile e PWA

PWA:

- `/manifest.webmanifest`: 200, `application/manifest+json`
- `name`: `Territorio Tomado`
- `short_name`: `Territorio`
- `start_url`: `/`
- `display`: `standalone`
- `theme_color`: `#3b474f`
- `background_color`: `#3b474f`
- `/icons/icon-192.png`: 200, `image/png`
- `/icons/icon-512.png`: 200, `image/png`

Mobile:

- Home mobile validada visualmente: CTAs principais aparecem rapido e sem overflow critico.
- Mapa mobile validado visualmente: tiles, legenda/filtros e marcadores carregam.
- Bairro mobile validado visualmente: leitura territorial, metricas e chamadas de acao aparecem limpas.
- Imovel mobile validado por screenshot: ficha publica renderiza em producao.
- Circulacao mobile validada visualmente: cards e CTAs de compartilhamento aparecem fortes e legiveis.

Capturas registradas:

- `reports/qa-screenshots/home-desktop.png`
- `reports/qa-screenshots/home-mobile.png`
- `reports/qa-screenshots/mapa-desktop-wait.png`
- `reports/qa-screenshots/mapa-mobile-wait.png`
- `reports/qa-screenshots/bairro-mobile-wait.png`
- `reports/qa-screenshots/imovel-mobile.png`
- `reports/qa-screenshots/circulacao-mobile.png`

## Logs e build

Checks executados:

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
- `npx vercel deploy --prod --yes`: OK
- `npx vercel logs https://territoriotomado.vercel.app --no-follow --level error --limit 20 --expand`: sem logs de erro encontrados

## Checklist final de QA

| Item | Estado |
| --- | --- |
| Home publica em producao | Passou |
| Mapa publico em producao | Passou |
| Bairros em producao | Passou |
| Bairro individual em producao | Passou |
| Ficha de imovel em producao | Passou |
| Agir em producao | Passou |
| Circulacao em producao | Passou |
| Admin/revisao em producao | Passou |
| Share packs | Passou |
| OG images | Passou |
| Manifest PWA | Passou |
| Icones PWA | Passou |
| Mapa sem erro SSR | Passou |
| Mobile basico | Passou |
| Logs de erro Vercel | Passou |

## Conclusao

O produto esta validado em producao para uso publico e politico inicial. As rotas centrais respondem, os assets de circulacao funcionam, o mapa carrega client-side sem quebrar SSR, e o PWA possui manifest e icones disponiveis.

Nao foram abertas novas frentes de arquitetura. A unica pendencia recomendada para rodada futura e um refinamento pequeno da experiencia do mapa em mobile, reduzindo a interferencia visual da navegacao fixa no limite inferior do mapa.
