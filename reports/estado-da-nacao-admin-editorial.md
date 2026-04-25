# Estado da Nacao: Admin Editorial

Data: 2026-04-20

## Objetivo

Transformar a area admin em um painel editorial minimo funcional para cadastrar, editar, publicar e despublicar imoveis sem inventar um CMS complexo.

## O que foi entregue

- `/admin/imoveis` agora le dados reais do Supabase.
- `/admin/imoveis/novo` cria um novo imovel.
- `/admin/imoveis/[id]` edita um imovel existente.
- O formulario editorial cobre os campos minimos pedidos.
- Publicacao e despublicacao ficam em um checkbox simples ligado a `is_public`.
- O painel usa a mesma linguagem visual do resto do app.

## Estrutura adotada

- `src/lib/data/admin-queries.ts`
  - leitura real de `properties`
  - leitura de `neighborhoods`
  - resumo administrativo real
- `src/lib/data/admin-actions.ts`
  - criação e atualização via server action
  - revalidação de rotas relevantes
  - redirecionamento de sucesso e erro
- `src/components/admin/property-editor-form.tsx`
  - formulario compartilhado para novo e edicao

## Campos editoriais

O editor permite definir:

- titulo
- slug
- endereco
- bairro
- coordenadas
- tipo
- status
- criticidade
- resumo
- descricao
- contexto historico
- potencial de uso social
- publicado ou nao

## Decisoes

- Usei `SUPABASE_SERVICE_ROLE_KEY` apenas no servidor para manter a operacao editorial simples.
- Nao criei fluxo de permissao novo no app.
- A listagem administrativa mostra o estado publico do registro sem impor telas extras.
- O formulario foi mantido sem estado client-side complexo para evitar CMS inflado.

## O que ficou para depois

- moderacao de contribuicoes em `/admin/contribuicoes`
- anexos de imagens e documentos no editor
- pesquisa, filtros e paginação no painel
- validacao de slug com feedback inline mais rico

## Arquivos principais

- `src/app/admin/page.tsx`
- `src/app/admin/imoveis/page.tsx`
- `src/app/admin/imoveis/novo/page.tsx`
- `src/app/admin/imoveis/[id]/page.tsx`
- `src/lib/data/admin-queries.ts`
- `src/lib/data/admin-actions.ts`
- `src/components/admin/property-editor-form.tsx`

## Validacao

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
