# Estado da Nacao: Moderacao Editorial

Data: 2026-04-20

## Objetivo

Transformar `/admin/contribuicoes` de uma fila de aprovacao simples em uma area editorial minima, onde uma contribuicao aprovada pode virar:

- relato publico aprovado
- item de timeline
- imagem do imovel
- documento do imovel

sem misturar a contribuicao bruta com o acervo editorial publicado.

## O que entrou

### Banco

- `public.property_reports` ganhou:
  - `editorial_destination`
  - `rejection_reason`
  - `reviewed_at`
- `public.property_timeline` ganhou `source_report_id`
- `public.property_images` ganhou `source_report_id`
- `public.property_documents` ganhou `source_report_id`
- `property_reports` passou a expor leitura publica apenas para aprovados com destino `relato_publico`
- indices de apoio foram criados para os novos campos de origem e para a fila moderada

### Admin

- `/admin/contribuicoes` agora:
  - mostra triagem de itens sem vinculo exato
  - permite vincular um imovel no momento da revisao
  - permite escolher o destino editorial antes de aprovar
  - exige motivo simples para rejeicao
  - mostra historico recente das decisoes editoriais
- A aprovacao pode levar a contribuicao para:
  - relato publico
  - timeline
  - acervo de midia

### Acervo editorial

- Se o destino for `timeline`, a contribuicao vira um item da linha do tempo com rastreio de origem
- Se o destino for `media`, a contribuicao vira:
  - imagem, quando o anexo for imagem ou houver link de imagem
  - documento, quando houver arquivo ou link documental
- As decisoes mantem a origem em `source_report_id` para rastreio posterior

## Regras adotadas

- Contribuicao bruta continua sendo `property_reports`
- Publicacao editorial acontece apenas depois da moderacao
- Anexos ficam privados por padrao ate a decisao
- A camada publica so mostra `property_reports` aprovados como relato publico
- A separacao entre fila, decisao e acervo foi mantida simples

## Arquivos principais

- `src/app/admin/contribuicoes/page.tsx`
- `src/lib/data/admin-actions.ts`
- `src/lib/data/admin-queries.ts`
- `src/lib/data/contribution-editorial.ts`
- `src/lib/data/public-queries.ts`
- `src/types/domain.ts`
- `supabase/migrations/20260420173000_moderacao_editorial.sql`

## Validacao

- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
- Migration aplicada no Supabase remoto

## Proximo passo natural

1. consumir `source_report_id` na interface administrativa de media e timeline, se fizer sentido
2. criar visao de contribuicoes convertidas por destino editorial
3. ligar essa trilha a futuras rotas de publicacao assistida
