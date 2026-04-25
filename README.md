# Territorio Tomado

PWA em Next.js 15 para mapear, documentar e ativar disputa social sobre imoveis ligados a CSN em Volta Redonda.

## Tijolo 01

Fundacao visual e estrutural do app, sem logica pesada.

- shell global com topbar e navegacao
- estetica VR Abandonada com brutalismo limpo
- home editorial com hero, destaques e chamada para acao
- paginas principais, mapa real e admin editorial minimo
- lista mockada de imoveis
- detalhe mockado de imovel
- design system inicial com tokens, botoes, badges, cards e estados vazios

## Stack

- Next.js 15 com App Router
- TypeScript
- Tailwind CSS
- Supabase preparado para Postgres, Auth e Storage
- React-Leaflet para mapa
- Deploy pensado para Vercel

## Rotas iniciais

- /
- /mapa
- /imoveis
- /imoveis/[slug]
- /agir
- /admin
- /admin/imoveis
- /admin/imoveis/novo
- /admin/imoveis/[id]
- /admin/contribuicoes
- /enviar

## Estrutura

- src/app: rotas e layout
- src/components/layout: shell global e navegacao
- src/components/ui: design system inicial
- src/components/properties: cards e detalhe mockado
- src/lib/data: mocks e queries de leitura
- src/lib/supabase: clientes browser/server prontos para conexao real
- src/types: tipos de dominio do MVP

## Componentes-base do Tijolo 01

- AppShell
- InternalPageHeader
- MetricCard
- SectionHeader
- PropertyCard
- Badge
- EmptyState

## Convencoes de hardening

- `AppShell` e a shell unica da aplicacao. Cabecalho e rodape vivem nele.
- `InternalPageHeader` e o cabecalho padrao das rotas internas e deve manter conteudo util cedo na dobra.
- `SectionHeader` fica para secoes internas e para a home, que segue mais monumental.
- `MetricCard` e o padrao para contadores compactos. Evitar mosaicos grandes de metricas simples.
- `Badge` e o unico componente de selo/status. Variacoes de status e criticidade usam os mapeamentos do proprio arquivo.
- Componentes fora do fluxo principal nao sao apagados sem necessidade: ficam em `src/components/staging`.
- A rota `/mapa` ja usa mapa real com dados publicados. Experimentos de mapa fora do fluxo principal continuam em `src/components/staging`.
- A rota `/agir` nasce das `property_actions` publicadas de cada imovel e puxa o CTA a partir da ficha.
- A rota `/enviar` grava contribuicoes moderadas em `property_reports` com `moderation_status = pendente`.
- A moderacao em `/admin/contribuicoes` pode aprovar para tres destinos: relato publico, timeline ou acervo de midia. As decisoes preservam a origem em `property_reports` e nos itens criados.
- A rota `/admin/imoveis/[id]` concentra ficha, galeria e documentos do imovel em blocos editoriais simples.
- A mídia real usa os buckets `property-images` e `property-docs`.
- A gramatica visual e de UX do produto esta documentada em `docs/ux-system.md`.

## Entidades do MVP

- properties
- neighborhoods
- property_images
- property_documents
- property_timeline
- property_reports
- property_actions
- reuse_proposals
- profiles

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Vibe coding iterativo

- Use mocks em `src/lib/data/mock-data.ts` para iterar interface e narrativa.
- Migre leitura para Supabase em `src/lib/supabase` quando o schema estiver validado.
- Suba previews na Vercel a cada branch curta com foco em pagina ou fluxo.
- Trate o admin como painel editorial simples antes de expandir CRUD completo.

## Proximos tijolos

- Tijolo 02: mapa navegavel com React-Leaflet e estados de foco territorial
- Tijolo 03: schema Supabase, leitura server-side e seeds iniciais
- Tijolo 04: auth, moderacao e fluxo de contribuicoes
- Tijolo 05: documentos, imagens e timeline com dados reais
# territoriotomado
