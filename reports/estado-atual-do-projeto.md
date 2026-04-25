# Estado Atual do Projeto

Data: 2026-04-20
Projeto: Territorio Tomado
Escopo: panorama tecnico e funcional da base atual

## Resumo executivo

O projeto saiu da fase de mock puro e hoje opera como uma plataforma editorial territorial conectada ao Supabase e publicada na Vercel.

- A home, o mapa, a listagem de imoveis, a pagina de bairro, a pagina de acao e a area de envio estao ativas em producao.
- O app usa `AppShell` como shell unica e `SectionHeader` como padrao de secao.
- A leitura publica vem de queries separadas em `src/lib/data/public-queries.ts`.
- O admin editorial existe e cobre imoveis, midia, acoes e contribuicoes moderadas.
- O schema remoto do Supabase foi aplicado e o app esta consumindo a base real.

## Estado funcional

Rotas publicas relevantes:

- `/` home editorial
- `/mapa` mapa real com React-Leaflet
- `/imoveis` listagem publica com filtros e contexto
- `/imoveis/[slug]` ficha completa do imovel
- `/agir` feed de acoes por imovel
- `/bairros` leitura territorial por bairro
- `/bairros/[slug]` detalhe territorial do bairro
- `/enviar` formulario de contribuicao moderada

Rotas administrativas:

- `/admin`
- `/admin/imoveis`
- `/admin/imoveis/novo`
- `/admin/imoveis/[id]`
- `/admin/contribuicoes`

Estado observado na producao:

- O dominio publico `https://territoriotomado.vercel.app` responde corretamente.
- As rotas principais publicas respondem `200` em verificacao recente.
- A publicacao depende de variaveis de ambiente do Supabase configuradas na Vercel.

## Camada de dados

Entidades centrais modeladas no Supabase:

- `properties`
- `neighborhoods`
- `property_images`
- `property_documents`
- `property_timeline`
- `property_reports`
- `property_actions`
- `reuse_proposals`
- `profiles`

O app separa leitura publica, leitura administrativa e escrita editorial:

- `src/lib/data/public-queries.ts` concentra a leitura publica.
- `src/lib/data/admin-queries.ts` e `src/lib/data/admin-actions.ts` concentram o painel editorial.
- `src/lib/data/contribution-actions.ts` trata o fluxo de envio e moderacao.
- `src/lib/data/admin-media-queries.ts` e `src/lib/data/admin-media-actions.ts` tratam galeria e documentos.

## Supabase

O banco remoto recebeu as migrations do projeto, incluindo:

- schema inicial
- RLS inicial
- campos editoriais para imoveis
- intake de contribuicoes
- camada de acoes
- camada de midia editorial
- moderacao editorial
- ganchos para integracao com outros apps

Buckets usados:

- `property-images`
- `property-docs`
- `report-attachments`

## UI e convencoes

Convencoes hoje adotadas:

- `AppShell` e a shell global unica.
- `SectionHeader` e o unico cabeçalho de secao nas rotas ativas.
- `Badge` centraliza status e criticidade.
- Componentes legados ficaram em `src/components/staging` para nao poluir o fluxo principal.

Identidade visual:

- a estetica VR Abandonada foi mantida
- predominam superfícies escuras, contraste forte e hierarquia editorial seca
- a navegação foi mantida simples e mobile-first

## Estado do repositório

O worktree local esta sujo no momento, com alteracoes e arquivos ainda nao versionados. Isso nao impede a operacao, mas indica que a base ainda nao foi consolidada em commit unico.

## Riscos e pendencias

- Segredos usados em configuracao de Vercel e Supabase devem ser rotacionados por seguranca.
- Ainda existem componentes legados e de staging no repo; eles estao isolados, mas nao foram removidos.
- A evolucao futura depende de manter a separacao entre camada de dominio, queries e UI.

## Proximo passo natural

O proximo tijolo mais coerente e reforcar a operacao editorial e territorial em cima da base real:

- consolidar moderação e acervo editorial
- ampliar a leitura por bairro e frentes de ação
- seguir limpando componentes legados sem quebrar as rotas ja publicadas
