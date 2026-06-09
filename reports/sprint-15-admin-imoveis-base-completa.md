# Sprint 15 - Mesa Operacional de Imóveis (Base Completa)

Data: 2026-06-09

## Objetivo

Transformar `/admin/imoveis` em uma mesa operacional completa com base fiscal de 197 registros patrimoniais, permitindo leitura densa e rápida, buscas textuais flexíveis, filtros rápidos dinâmicos e um Drawer Lateral para edições leves (vínculos, fotos, upload e capas), mantendo a integridade e separação lógica entre a base patrimonial fiscal e o acervo editorial publicado.

## O que foi implementado

### 1. Camada de Dados e Queries Unificadas

Foi criada uma consulta agregada em `src/lib/data/admin-queries.ts` para buscar toda a base de sinais fiscais com join opcional das fichas editoriais e imagens:

- **Query `getAdminCompleteBaseProperties`**: Carrega todos os 197 registros de `property_fiscal_signals` ordenados por bairro e endereço oficial. Associa através de join as informações editoriais vinculadas (`properties`) e sua respectiva galeria de imagens (`property_images`).
- **Tipo `AdminCompleteBaseProperty`**: Estrutura de tipo unificada que representa o estado fiscal e o estado editorial de forma limpa e tipada.

### 2. Server Actions Rápidas (Drawer Lateral)

Para suportar edições sem recargas completas de página e sem redirects indesejados, foram implementadas Server Actions focadas e performáticas:

- **`linkPropertyToSignalAction`**: Gerencia o vínculo 1-para-1 entre um registro fiscal e um imóvel editorial existente (garante unicidade limpando links conflitantes).
- **`updatePropertyTitleAction`**: Permite alterar o nome (título e slug automático) de um imóvel editorial diretamente da linha.
- **`createAndLinkPropertyAction`**: Cria um novo imóvel editorial em rascunho a partir de um registro fiscal com apenas um clique, copiando coordenadas e mapeando inteligentemente o bairro oficial.
- **`uploadQuickImageAction`** (em `admin-media-actions.ts`): Recebe arquivos de fotos e os envia ao bucket `PROPERTY_IMAGE_BUCKET` do Supabase, criando a associação de mídia na tabela `property_images` e retornando dados JSON de resposta estruturada para o cliente.
- **`deleteQuickImageAction` & `setQuickImageCoverAction`**: Exclusão e controle de imagem de capa em tempo real direto pelo Drawer.

### 3. Componente Cliente `PropertiesMesaOperacional`

Componente cliente central de alta performance construído com foco em densidade de informação e UX fluida:

- **Estatísticas Dinâmicas**: Um painel compacto no topo que recalcula instantaneamente os totais da base de acordo com as ações de vínculo ou publicação.
- **Filtros Rápidos e Busca**: Input de pesquisa por múltiplos campos (nome editorial, endereço oficial, bairro oficial e inscrição) e botões de filtro para *Todos*, *Vinculados*, *Sem Vínculo*, *Com Foto*, *Sem Foto*, *Publicados*, *Rascunhos*, *Prontos para Mapa* e *Prioridade Alta*.
- **Tabela Densa de Operação**: Layout de grid otimizado exibindo o mini-thumbnail da foto de capa (se houver), nome editorial, inscrição, endereço oficial, bairro oficial, badges de status (mapa, prioridade, vínculo, publicado) e o botão rápido para operar.
- **Drawer Lateral Interativo**:
  - Exibe o cartão de dados fiscais do imóvel selecionado.
  - Para registros sem vínculo: Permite vincular a um imóvel do acervo existente (dropdown filtrado) ou criar um novo imóvel editorial imediatamente digitando um título.
  - Para registros vinculados: Permite renomear, alternar status de publicação, abrir o editor completo no endereço `/admin/imoveis/[id]`, desvincular o sinal fiscal, enviar novas fotos (com upload direto) e gerenciar a galeria interna (marcar como capa ou excluir).

### 4. Refatoração de `/admin/imoveis`

A página foi simplificada para atuar como ponto de entrada dos dados do lado do servidor:

- Carrega de forma concorrente a base completa unificada e a lista de imóveis editoriais disponíveis para vínculos.
- Repassa os dados para o componente `<PropertiesMesaOperacional />`, removendo a tabela antiga estática e os metric cards legados de contagem fixa.

## Arquivos Alterados / Criados

- **`src/lib/data/admin-queries.ts`**: Adição de `getAdminCompleteBaseProperties` e interface `AdminCompleteBaseProperty`.
- **`src/lib/data/admin-actions.ts`**: Adição de `linkPropertyToSignalAction`, `updatePropertyTitleAction`, `createAndLinkPropertyAction`, `deleteQuickImageAction` e `setQuickImageCoverAction`.
- **`src/lib/data/admin-media-actions.ts`**: Adição de `uploadQuickImageAction`.
- **`src/components/admin/properties-mesa-operacional.tsx`**: Criação do componente cliente da mesa operacional.
- **`src/app/admin/imoveis/page.tsx`**: Refatoração da página administrativa de imóveis para plugar o novo fluxo.

## Validação Técnica

### Comandos de Validação Local
- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK

## Critérios de Aceitação Atendidos

| Critério | Resultado |
| --- | --- |
| Refatoração de `/admin/imoveis` com 197 registros | Atendido (tabela exibe todos os sinais fiscais como registros principais) |
| Distinção entre Base Patrimonial e Acervo Editorial | Atendido (sinalizado visualmente por badges, vínculos e fotos) |
| Colunas mínimas obrigatórias na tabela | Atendido (todas as 11 colunas presentes e legíveis) |
| Busca textual por nome, endereço, bairro e inscrição | Atendido (filtro dinâmico client-side em tempo real) |
| 9 filtros rápidos configurados | Atendido (toggles interativos na parte superior da mesa) |
| Drawer lateral leve para edições e controle de mídia | Atendido (abre lateralmente e gerencia formulários leves) |
| Upload de fotos e marcação de capa em tempo real | Atendido (integração com Supabase Storage e atualização otimista) |
| Acesso mantido ao editor completo em `/admin/imoveis/[id]` | Atendido (link destacado no drawer de cada registro vinculado) |

## Conclusão

A mesa operacional transforma a rotina administrativa de imóveis em uma plataforma densa de alta produtividade. Agora, a equipe pode visualizar a base territorial completa de 197 imóveis fiscais, identificar gargalos de cobertura (sem fotos ou sem vínculos), e estruturar o acervo com apenas alguns cliques no Drawer Lateral, garantindo uma transição fluida do dado fiscal bruto para a pauta editorial publicada.
