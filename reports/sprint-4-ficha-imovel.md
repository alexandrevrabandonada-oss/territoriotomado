# Sprint 4: Ficha do Imovel

Data: 2026-06-01
Projeto: Territorio Tomado
Escopo: refatoracao da ficha publica do imovel para unir prova, explicacao e acao

## Objetivo

Cada ficha de imovel deve responder rapidamente:

- o que e esse lugar
- quao confiavel e o dado
- por que isso importa
- o que fazer agora

## Mudanca aplicada

A rota `/imoveis/[slug]` foi reorganizada para deixar a ficha menos seca e mais orientada a uso cotidiano.

Novos blocos principais:

- endereco e status territorial
- dado oficial vs estimado
- IPTU 2019 e 2025
- valor venal estimado
- observacao metodologica
- importancia politica/territorial
- agir agora

Tambem foi criado um CTA persistente no topo da ficha, com:

- proximo passo da ficha
- CTA da acao prioritaria, quando houver
- atalho para ver o imovel no mapa

## Campos destacados

A ficha agora destaca explicitamente:

- `localizacao_status_final`
- `valor_venal_status`
- `prioridade_revisao`
- `pronto_para_mapa`

## Decisao sobre dados fiscais

Os campos fiscais finais ainda nao estao ligados ao schema publico usado pela ficha. Para nao abrir migration ou nova arquitetura nesta sprint, a interface foi preparada com os blocos corretos e sinaliza os valores como `em integracao` quando o dado ainda nao esta conectado.

Campos preparados na UI:

- IPTU 2019
- IPTU 2025
- valor venal estimado
- status do valor venal

O caminho natural seguinte e conectar esses blocos aos arquivos em `data/output` ou a colunas persistidas no Supabase.

## Arquivos alterados

- `src/app/imoveis/[slug]/page.tsx`
- `src/components/properties/property-detail.tsx`

## Verificacao tecnica

Executado com sucesso:

```bash
npm run lint
npm run typecheck
```

Build:

```bash
NEXT_PRIVATE_BUILD_WORKER=1 npm run build
```

Resultado:

- build concluido com sucesso
- a primeira tentativa sem worker unico compilou, mas falhou em coleta de traces da `.next` no Windows com arquivo ausente
- apos limpar `.next` e rodar com worker unico, o build fechou normalmente
- aviso remanescente do Next: uso de edge runtime desabilita geracao estatica para paginas afetadas

## QA visual

Verificacao local feita em:

```text
http://127.0.0.1:3002/imoveis/galpao-logistico-aterrado
```

Confirmado no browser:

- bloco de endereco e status territorial presente
- bloco de dado oficial vs estimado presente
- bloco de IPTU 2019 e 2025 presente
- bloco de valor venal estimado presente
- observacao metodologica presente
- importancia politica/territorial presente
- bloco agir agora presente
- CTA persistente presente
- atalho para mapa presente
- `localizacao_status_final`, `valor_venal_status` e `prioridade_revisao` visiveis
- sem erro de runtime visivel na ficha testada

## Resultado

A ficha agora funciona como leitura orientada: explica o lugar, qualifica a confianca do dado, deixa clara a pendencia fiscal/metodologica e termina apontando um proximo passo. A estrutura esta pronta para receber os valores fiscais reais sem redesenhar a pagina.
