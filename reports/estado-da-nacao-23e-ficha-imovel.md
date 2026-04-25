# Estado da Nacao: 23e Ficha Imovel

## Objetivo

Refatorar `/imoveis/[slug]` com a linguagem Concreto Frio para que a ficha publica deixe de parecer texto longo e passe a funcionar como instrumento de memoria, prova, leitura territorial e acao.

## O que mudou

- O hero externo foi reduzido para uma barra compacta de contexto e compartilhamento.
- A identidade da ficha passou para o topo do proprio detalhe do imovel.
- O topo agora organiza de forma direta:
  - nome do imovel
  - bairro
  - status
  - criticidade
  - resumo curto
  - CTA principal de acao, quando existe
- A leitura inicial da ficha ficou mais curta e mais orientada a decisao.

## Hierarquia dos blocos

A ficha foi reorganizada para responder rapido o que e o imovel, qual e o problema e o que fazer:

1. topo operacional do imovel
2. agir agora em destaque
3. situacao atual
4. contexto historico
5. impacto territorial
6. imagens
7. documentos
8. timeline
9. relatos aprovados
10. propostas de uso social
11. agir agora com frentes complementares e conexoes externas

## Decisoes de interface

- `PanelCard` passou a estruturar os blocos principais de conteudo.
- `Badge` passou a concentrar a leitura de bairro, status e criticidade.
- O bloco `Agir agora` ficou mais visivel e operacional, com a frente principal destacada e CTA claro.
- A ficha preserva densidade sem poluicao: menos cara de artigo, mais cara de painel publico de leitura e acao.
- A pilha mobile foi mantida com empilhamento claro e blocos compactos.

## Conteudo e leitura territorial

- `situacao atual` agora concentra a descricao principal e o uso atual.
- `contexto historico` ganhou bloco proprio para memoria.
- `impacto territorial` passou a concentrar potencia social e notas legais.
- `relatos aprovados` foi separado dos itens ainda em moderacao para nao confundir prova consolidada com fila editorial.

## Arquivos afetados

- `src/app/imoveis/[slug]/page.tsx`
- `src/components/properties/property-detail.tsx`

## Verificacao

Executado com sucesso:

```bash
npm run typecheck
npm run build
```

Observacao:

- Houve uma primeira falha transitória do `next build` por resolucao de chunk em `.next`, sem relacao com o codigo alterado.
- A rerodada do build concluiu com sucesso.
