# Estado da Nação - Ganchos de Ecossistema

## O que entrou
- Campos opcionais de integração editorial em `properties`:
  - `mission_url`
  - `community_url`
  - `dossier_url`
  - `external_reference_url`
- Os mesmos ganchos em `property_actions`.
- Blocos públicos claros na ficha do imóvel e nas frentes de ação.
- Edição desses campos no admin do imóvel.
- Edição desses campos nas ações ligadas ao imóvel, dentro do admin editorial mínimo.

## Decisão
- Não criei integrações externas nem APIs novas.
- Os links ficam como ganchos leves para conectar Território Tomado a Missão ÉLuta, Nika, Cadernos/Acervo e outros apps depois.
- O produto continua autônomo: os links são opcionais e não alteram o fluxo central do acervo.

## UI pública
- Na ficha do imóvel:
  - Entrar na frente
  - Ver dossiê
  - Ir para comunidade
  - Ver referência externa
- Na página de ação:
  - os mesmos ganchos aparecem em formato inline, quando existirem

## Admin
- O formulário editorial do imóvel ganhou quatro campos de URL opcionais.
- Cada ação passou a ter um bloco leve para editar os mesmos ganchos.

## Schema
- Migration criada em `supabase/migrations/20260420180000_ecosystem_links.sql`.
- A migration adiciona as colunas novas sem mexer no restante do modelo.

## Validação
- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK

## Observação
- A migration ficou preparada no repositório. A aplicação remota no Supabase depende da CLI/fluxo de deploy do ambiente, não da UI do app.
