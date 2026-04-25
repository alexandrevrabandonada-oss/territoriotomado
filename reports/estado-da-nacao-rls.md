# Estado da Nacao: RLS Inicial

Data: 2026-04-20

## Objetivo

Criar uma primeira camada de acesso no Supabase que permita leitura publica segura do que estiver publicado e preserve contribuições sob moderação, sem transformar o projeto num sistema complexo de permissao cedo demais.

## O que foi implementado

- Papéis lógicos preparados:
  - `visitor`
  - `contributor`
  - `moderator`
  - `admin`
- Policies RLS iniciais para as tabelas principais.
- Leitura publica apenas para registros publicados.
- Fluxo de moderação para `property_reports`.
- Documentos sensiveis mantidos privados por padrao.
- Regras de profile separando acesso proprio, moderacao e admin.

## Modelagem de acesso

### Visitor

- representa acesso anonimo
- pode ler apenas conteudo publicado e aprovado
- nao escreve em tabelas editoriais

### Contributor

- representa usuario autenticado de base
- pode submeter `property_reports` com status `pendente`
- pode ler e atualizar seu proprio perfil
- nao ganha acesso de escrita ampla nas tabelas editoriais

### Moderator

- pode ler o acervo inteiro
- pode moderar `property_reports`
- pode criar e editar conteudos editoriais como propriedades, documentos, timeline, imagens, acoes e propostas

### Admin

- herda capacidades de moderator
- pode gerir neighborhoods e profiles
- pode ajustar roles e fazer manutencao editorial completa

## O que fica sob RLS

- visibilidade publica de `properties`
- visibilidade publica de `property_images`
- visibilidade publica de `property_documents` somente quando `is_public = true`
- visibilidade publica de `property_timeline`
- visibilidade publica de `property_actions`
- visibilidade publica de `reuse_proposals`
- visibilidade de `property_reports` apenas quando aprovado
- acesso proprio a `profiles`
- escrita editorial restrita a moderator/admin

## O que fica para logica de app

- UX de login e criacao de perfil
- marcacao visual de estado de moderacao
- transicao do formulario `/enviar` para o fluxo real de contribuicao
- pagina `/admin/contribuicoes` e suas acoes de moderação
- regras de exibicao fina para esconder ou mostrar blocos com base na experiencia desejada

## Decisoes objetivas

- `property_reports` nasce com `moderation_status = pendente`
- `property_documents` recebe `is_public` com default `false`
- perfis nao ficam com escrita livre sobre o proprio `role`
- roles usam enum unico `access_role`

## Arquivos criados

- `supabase/migrations/20260420142000_rls_initial_access.sql`
- `reports/estado-da-nacao-rls.md`

## Validacao

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK

## Proximo passo

Iniciar a troca do app para ler profiles, properties e reports reais com seguranca controlada.

Observacao:

- A migration de RLS foi aplicada no projeto Supabase remoto com `supabase db push`.
