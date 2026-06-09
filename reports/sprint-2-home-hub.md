# Sprint 2: Home Hub

Data: 2026-06-01
Projeto: Territorio Tomado
Escopo: refatoracao da home como porta de entrada do modulo

## Objetivo

Transformar a home em um hub mais simples e pratico, capaz de responder rapidamente:

- o que e o Territorio Tomado
- por onde comecar
- onde clicar agora

## Fonte de dados considerada

Pasta informada para os dados do projeto:

```text
C:\Users\Micro\OneDrive\Documentos\Estudo renda mediana historica\data\output
```

Arquivos observados na pasta:

- `base_csn_app_ready.json`
- `base_csn_final_unificada.csv`
- `base_csn_final_unificada.geojson`
- `ranking_bairros.csv`
- `ranking_iptu_2025.csv`
- `ranking_valor_venal.csv`
- `revisao_prioritaria.csv`

Sinais usados na home:

- 197 registros consolidados
- 190 IPTUs 2025 observados
- 31 pontos geocodificados OK
- 166 registros ambiguos ou em revisao

## Mudanca aplicada

A home deixou de funcionar como painel longo com filtros, mapa fake e blocos editoriais densos. Agora ela funciona como hub de navegacao com quatro portas principais:

- Ver no mapa
- Ver por bairro
- Imoveis prioritarios
- Agir

O hero foi reduzido para:

- nome do projeto
- uma frase curta de explicacao
- dois CTAs imediatos

O bloco lateral desktop explica por onde comecar e mostra os numeros essenciais. No mobile, esse bloco e ocultado para que as portas aparecam mais cedo.

## Bloco de confiabilidade

Foi criado um bloco curto de leitura dos dados:

- Dado oficial: inscricao, endereco e IPTU 2025 observados.
- Dado estimado: valor venal calculado por estimativa.
- Dado em revisao: geocodificacao ambigua, OCR manual ou endereco pendente de checagem.

## Arquivos alterados

- `src/app/page.tsx`
- `src/components/layout/app-shell.tsx`

Observacao sobre `app-shell.tsx`:

- o simbolo do header passou de `Image fill` para dimensoes explicitas, mantendo o mesmo asset, para carregar de forma mais confiavel no QA desktop.

## Verificacao tecnica

Executado com sucesso:

```bash
npm run lint
npm run typecheck
npm run build
```

Resultado do build:

- compilacao concluida com sucesso
- home reduziu de aproximadamente 7.81 kB para 5.2 kB na saida do Next
- `manifest.webmanifest` segue presente no build
- aviso remanescente do Next: uso de edge runtime desabilita geracao estatica para paginas afetadas

## QA visual

Verificacao local feita em:

```text
http://127.0.0.1:3002
```

Confirmado no browser:

- H1: `TERRITORIO TOMADO`
- header carregando `territorio-symbol.png`
- quatro portas presentes:
  - Ver no mapa
  - Ver por bairro
  - Imoveis prioritarios
  - Agir
- bloco de dados presente:
  - Dado oficial
  - Dado estimado
  - Dado em revisao
- primeira dobra mobile encurta o hero e ja mostra a entrada "Ver no mapa"
- primeira dobra desktop mostra hero, bloco "Escolha uma porta" e as quatro portas principais

## Resultado

A home ficou mais objetiva e navegavel. A identidade Concreto Frio / VR Abandonada foi preservada, mas a pagina agora opera como uma entrada pratica do modulo: menos discurso, menos simulacao de painel e mais decisao de clique.
