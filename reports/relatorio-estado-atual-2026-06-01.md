# Relatorio do Estado Atual do Projeto

Data: 2026-06-01
Projeto: Territorio Tomado
Escopo: panorama tecnico, funcional e de repositorio da base local atual

## Resumo executivo

O projeto esta em uma fase de produto editorial territorial funcional, com rotas publicas, area administrativa, Supabase estruturado e linguagem visual ja documentada. A base local atual indica uma rodada recente de identidade visual/PWA, ainda nao consolidada em commit, com novos assets de marca e icones PNG aplicados ao layout, manifest e home.

O estado tecnico esta saudavel em lint e typecheck. O build de producao foi tentado, mas nao terminou por falta de espaco em disco no ambiente local (`ENOSPC`) durante escrita de cache do Webpack.

## Stack atual

- Next.js 15 com App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase para dados, auth/storage e operacao editorial
- React-Leaflet para mapa
- Vercel como alvo de deploy

Scripts declarados:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`

## Superficies funcionais

Rotas publicas presentes:

- `/`
- `/mapa`
- `/bairros`
- `/bairros/[slug]`
- `/imoveis`
- `/imoveis/[slug]`
- `/agir`
- `/enviar`

Rotas administrativas presentes:

- `/admin`
- `/admin/imoveis`
- `/admin/imoveis/novo`
- `/admin/imoveis/[id]`
- `/admin/contribuicoes`

Rotas auxiliares e geradas:

- imagens Open Graph para home/agir/imovel
- rotas de share pack para imoveis e agir
- manifest PWA em `src/app/manifest.ts`

## Camada de dados

O projeto mantem separacao clara entre dominio, queries publicas, queries administrativas e acoes de escrita.

Arquivos centrais:

- `src/lib/data/public-queries.ts`
- `src/lib/data/admin-queries.ts`
- `src/lib/data/admin-actions.ts`
- `src/lib/data/admin-media-queries.ts`
- `src/lib/data/admin-media-actions.ts`
- `src/lib/data/contribution-actions.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/admin.ts`

Entidades modeladas nas migrations:

- `neighborhoods`
- `properties`
- `property_images`
- `property_documents`
- `property_timeline`
- `property_reports`
- `property_actions`
- `reuse_proposals`
- `profiles`

O historico de migrations indica que o MVP ja cobre schema inicial, RLS, campos editoriais, intake de contribuicoes, camada de acoes, midia editorial, moderacao e ganchos de ecossistema.

## UI e identidade

A linguagem visual consolidada nos relatorios anteriores segue a linha "Concreto Frio", com superficies densas, escuras, territoriais e de leitura editorial. A base possui documentacao especifica em `docs/ux-system.md` e nos documentos de UI em `docs/`.

Componentes estruturais relevantes:

- `AppShell`
- `SectionHeader`
- `PanelCard`
- `MetricCard`
- `Badge`
- `PropertyCard`
- componentes administrativos de edicao de imovel, midia e links de acao

A mudanca local mais recente reforca a identidade de marca:

- novo simbolo no header global
- lockup de marca no rodape da home
- simbolo sobreposto em areas visuais da home
- icones PNG declarados em metadata e manifest PWA

## Estado do repositorio

Branch local:

- `main`, rastreando `origin/main`

Worktree local:

- existem alteracoes modificadas em arquivos versionados
- existem assets novos ainda nao versionados
- existem logs locais de dev ainda nao versionados

Arquivos modificados:

- `src/app/layout.tsx`
- `src/app/manifest.ts`
- `src/app/page.tsx`
- `src/components/layout/app-shell.tsx`

Arquivos/diretorios novos observados:

- `public/brand/territorio-lockup.png`
- `public/brand/territorio-stamp.png`
- `public/brand/territorio-symbol.png`
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
- `.next-dev.err.log`
- `.next-dev.out.log`

Observacao: os logs `.next-dev.*.log` parecem artefatos locais de desenvolvimento e devem ser avaliados antes de qualquer commit.

## Verificacao tecnica

Executado com sucesso:

```bash
npm run lint
npm run typecheck
```

Tentado, mas bloqueado por ambiente:

```bash
npm run build
```

Resultado do build:

- falhou com `ENOSPC: no space left on device, write`
- a falha ocorreu durante cache/escrita do build, antes de uma conclusao funcional
- nao ha indicio, nesta rodada, de falha de tipo ou lint

## Riscos e pendencias

- Liberar espaco em disco e rodar novamente `npm run build`.
- Decidir se os novos PNGs de marca e icones entram no proximo commit.
- Ignorar ou remover os logs `.next-dev.err.log` e `.next-dev.out.log` se forem apenas residuos locais.
- Confirmar visualmente a home e o header apos os novos assets de marca, especialmente em mobile.
- Validar tamanho dos PNGs, pois `icon-512.png` e `territorio-stamp.png` sao relativamente pesados para assets publicos.
- Manter a separacao atual entre queries publicas, admin e actions para evitar acoplamento conforme o produto cresce.

## Proximo passo recomendado

O proximo passo natural e fechar a rodada de identidade/PWA:

1. limpar artefatos locais que nao devem ser versionados;
2. confirmar os assets finais de marca;
3. liberar espaco em disco e rodar `npm run build`;
4. fazer QA visual rapido da home, header, manifest e icones;
5. consolidar a mudanca em commit curto.

## Diagnostico final

O projeto esta operacional e bem estruturado para continuar evoluindo. A base atual nao parece quebrada; o unico bloqueio tecnico encontrado nesta rodada foi ambiental, por falta de espaco em disco durante o build. A mudanca em aberto e coerente com uma etapa de acabamento de marca e PWA, mas ainda precisa de build final e triagem de arquivos nao versionados antes de ser considerada pronta para merge/deploy.
