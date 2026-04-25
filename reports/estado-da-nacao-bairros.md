# Estado da Nação - Bairros

## O que entrou
- Página `/bairros` com leitura por bairro.
- Página `/bairros/[slug]` com foco territorial por unidade política.
- Mapa focado no bairro na página de detalhe.
- Listagem de imóveis do bairro.
- Lista de ações ativas ligadas ao bairro.
- Navegação global atualizada para incluir `Bairros`.

## Decisões
- Usei `neighborhoods` como unidade política principal de leitura.
- Mantive a interface simples, seca e coerente com a estética VR Abandonada.
- Reaproveitei `properties`, `neighborhoods`, `property_actions` e o mapa já existente.
- Evitei painel, analytics ou dashboard corporativo.

## Leituras exibidas
- Total de imóveis publicados por bairro.
- Total de imóveis com criticidade alta por bairro.
- Total de ações abertas por bairro.
- Narrativa curta do território, usando a descrição do bairro como base e fallback para uma frase sintética.

## Rotas criadas
- `/bairros`
- `/bairros/[slug]`

## Implementação
- A página de índice usa agregação direta sobre os bairros publicados.
- A página de detalhe usa o mapa e os cards de imóveis já existentes.
- Os links para lista e mapa preservam o contexto do bairro.

## Validação
- `npm run lint`: OK
- `npm run typecheck`: OK
- `npm run build`: OK
