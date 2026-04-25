# Estado da Nacao: UX System

## Objetivo

Consolidar a linguagem visual e de UX do Territorio Tomado como ferramenta territorial viva, reduzindo repeticao de landing e padronizando interacao, densidade, navegacao e blocos visuais.

## Componentes revisados

- `AppShell`: permanece como shell unica, com topbar desktop e barra inferior mobile.
- `SectionHeader`: preservado para home e secoes internas.
- `Badge`: permanece como componente unico para status, criticidade e prioridade.
- `ButtonLink`: consolidado como sistema de CTA principal, secundario e terciario.
- `PropertyCard`: mantido como card denso do acervo.
- `EmptyState`: mantido como vazio operacional.

## Componentes criados

- `InternalPageHeader`: cabecalho compacto para rotas internas.
- `MetricCard`: metrica compacta para contadores e estados rapidos.

## Padroes definidos

- Home: pagina mais monumental, com hero editorial e CTAs para trabalho real.
- Cabecalho interno: compacto, operacional e com metricas quando houver estado mensuravel.
- Metricas: pequenas, diretas, sem mosaico corporativo.
- Cards: leitura rapida de territorio, estado, prova, acao e proximo clique.
- Filtros: recorte territorial compartilhavel, sincronizado por URL quando aplicavel.
- CTA principal: acao dominante perto do conteudo que justifica o clique.
- CTA secundario: aprofundamento ou rota complementar.
- Navegacao mobile: barra inferior fixa com inicio, bairros, mapa, imoveis e agir.

## Rotas alinhadas

- `/mapa`
- `/imoveis`
- `/imoveis/[slug]`
- `/bairros`
- `/bairros/[slug]`
- `/agir`
- `/enviar`
- `/admin`

## Documentacao

A convencao principal foi registrada em `docs/ux-system.md` e referenciada no `README.md`.

## Resultado

O produto passa a ter uma gramatica de app territorial mais clara:

- menos repeticao de landing interna
- mais conteudo util cedo na dobra
- metricas compactas e consistentes
- CTAs com hierarquia mais previsivel
- mobile mais proximo de ferramenta de campo
- identidade VR Abandonada preservada sem sofisticacao desnecessaria
