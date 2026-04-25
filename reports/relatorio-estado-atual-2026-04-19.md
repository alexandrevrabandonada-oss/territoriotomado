# Relatorio Completo do Estado Atual

Data: 2026-04-19
Projeto: Territorio Tomado
Escopo analisado: base visual e estrutural (Tijolo 01), arquitetura atual e prontidao para proximos tijolos.

## 1. Resumo executivo

O projeto esta em bom estado tecnico e funcional para a fase atual.

- Stack principal implementada e consistente com Next.js 15 + TypeScript + Tailwind.
- Fundacao visual com identidade VR Abandonada esta aplicada de forma legivel e responsiva.
- Rotas centrais estao operacionais e com conteudo mockado coerente.
- Qualidade de codigo: lint, typecheck e build estao passando.
- Base pronta para evoluir para Tijolo 02 (mapa real), Tijolo 03 (Supabase real) e moderacao.

## 2. Validacao tecnica (executada nesta analise)

Comandos executados:

- npm run lint: OK
- npm run typecheck: OK
- npm run build: OK

Resumo do build:

- Next.js 15.5.15 compilando sem erros.
- 11 rotas geradas.
- Rotas estaticas: /, /mapa, /imoveis, /agir, /admin, /admin/imoveis, /enviar, /manifest.webmanifest
- Rota dinamica: /imoveis/[slug]

## 3. Stack e configuracao atual

Dependencias de runtime relevantes:

- next 15.5.15
- react 19.0.0 / react-dom 19.0.0
- tailwindcss 3.4.17
- leaflet 1.9.4 / react-leaflet 5.0.0
- @supabase/supabase-js 2.49.8 / @supabase/ssr 0.5.2

Ferramentas de qualidade:

- eslint 9 + eslint-config-next
- tsc strict mode

Scripts disponiveis:

- dev
- build
- start
- lint
- typecheck

Task VS Code:

- task dev configurada em .vscode/tasks.json

## 4. Estrutura do projeto

Organizacao principal identificada:

- src/app: rotas e layout global
- src/components/layout: shell e navegacao
- src/components/ui: design system inicial
- src/components/properties: listagem e detalhe
- src/lib/data: dados mockados e queries auxiliares
- src/lib/supabase: clientes browser e server preparados
- src/types: contratos de dominio
- public/icons: icones da PWA
- reports: relatorios de acompanhamento

## 5. Estado das rotas

Rotas com implementacao atual:

- /: home editorial com hero, destaque e cards mockados
- /mapa: placeholder visual de mapa (sem logica espacial ativa nesta fase)
- /imoveis: lista mockada com indicadores de acervo
- /imoveis/[slug]: detalhe mockado com secoes de contexto
- /agir: placeholder de mobilizacao com cards e estado vazio
- /admin: placeholder administrativo com resumo e CTA
- /admin/imoveis: tabela inicial de gestao editorial
- /enviar: formulario mockado de contribuicao

Observacao importante de escopo:

- Para um Tijolo 01 estrito, /admin/imoveis e /enviar podem ser considerados extras antecipados.

## 6. Design system e identidade visual

Elementos base presentes:

- AppShell
- SectionHeader
- PropertyCard
- StatusBadge
- EmptyState
- ButtonLink

Tokens e direcao visual:

- Paleta principal consolidada (preto, amarelo, ferrugem, off-white)
- Tipografia separada por funcao (leitura e display)
- Superficies e bordas com contraste adequado
- Visual consistente com observatorio popular urbano (sem linguagem de dashboard corporativo)

Responsividade:

- Estrutura mobile-first aplicada nas principais views
- Breakpoints sm/md/lg usados nas secoes principais

## 7. Camada de dados (mock) e dominio

Entidades modeladas:

- properties
- neighborhoods
- property_images
- property_documents
- property_timeline
- property_reports
- property_actions
- reuse_proposals
- profiles

Estado atual:

- 3 imoveis mockados com slug, criticidade, status e coordenadas
- Dados de suporte (imagens, documentos, timeline, relatos e acoes) conectados por ID
- Funcoes utilitarias de consulta disponiveis em src/lib/data/queries.ts

## 8. Supabase e PWA

Supabase:

- Cliente browser pronto em src/lib/supabase/client.ts
- Cliente server pronto em src/lib/supabase/server.ts
- Variaveis em .env.example
- Integracao real ainda nao conectada a queries/paginas

PWA:

- Manifest configurado em src/app/manifest.ts
- Icones declarados e presentes em public/icons
- Tema e metadados aplicados no layout

## 9. Aderencia ao objetivo atual (Tijolo 01)

Status de aderencia:

- Scaffold Next.js + TypeScript + Tailwind: atendido
- Layout global e navegacao: atendido
- Placeholders das rotas principais solicitadas: atendido
- Design system inicial: atendido
- Componentes base solicitados: atendido
- Home com hero + destaques + CTA: atendido
- Lista de imoveis mockada: atendido
- Detalhe mockado: atendido
- README com proximos tijolos: atendido

## 10. Pontos de atencao (tecnico/organizacional)

1. Ha componentes legados coexistindo com os novos:
- section-heading.tsx e badge.tsx continuam no codigo.
- site-header.tsx e site-footer.tsx continuam, mas AppShell virou shell principal.

2. Ha componentes de mapa nao usados no fluxo atual de Tijolo 01:
- property-map.tsx e map-page-shell.tsx permanecem no repositorio.

3. Inconsistencia leve de padrao entre paginas:
- Algumas rotas novas usam SectionHeader, enquanto rotas extras ainda usam SectionHeading.

4. Arquivo next-env.d.ts contem referencia de rotas geradas:
- Estado comum no ecossistema Next; nao indica erro, mas deve continuar sem edicao manual.

## 11. Recomendacoes praticas imediatas

1. Limpeza de codigo legado
- Remover componentes que nao fazem mais parte do fluxo atual ou padronizar uso.

2. Alinhamento de escopo
- Decidir se /admin/imoveis e /enviar ficam oficialmente no Tijolo 01 ou migram para Tijolo 02/03.

3. Preparacao do Tijolo 02
- Reativar a rota /mapa com React-Leaflet real (pins + camada base + focos iniciais).

4. Preparacao do Tijolo 03
- Definir schema SQL no Supabase e substituir primeiras leituras mock por consulta real.

## 12. Conclusao

O projeto esta tecnicamente saudavel, coerente com a proposta visual e pronto para evolucao incremental.
A base de produto ja suporta iteracao rapida em GitHub + Vercel, com baixo risco para iniciar os proximos tijolos.
