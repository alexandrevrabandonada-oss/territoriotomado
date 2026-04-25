# Estado da Nacao 21B: Badge

## Objetivo

Consolidar os selos e estados do app na linguagem Concreto Frio, usando uma base visual unica para status de imovel, criticidade, moderacao, tipo de acao e leitura territorial.

## API Atual

`Badge` agora aceita:

- `tone`: `yellow`, `blue`, `rust`, `alert`, `neutral`
- `variant`: `soft`, `outline`, `solid`
- `kind`: `status`, `criticality`, `moderation`, `action`, `territory`
- `value`: valor de dominio usado para resolver o tom automaticamente

Compatibilidade preservada:

- `default` continua funcionando como `blue`
- `warning` continua funcionando como `rust`
- `critical` continua funcionando como `alert`
- `muted` continua funcionando como `neutral`

## Mapeamentos

### Status de Imovel

- `ocupado`: neutral
- `vazio`: rust
- `em-disputa`: alert
- `uso-institucional`: blue

### Criticidade

- `alta`: alert
- `media`: yellow
- `baixa`: neutral

### Moderacao

- `aprovado`: blue
- `pendente`: yellow
- `rejeitado`: alert

### Tipo de Acao

- `campanha`: yellow
- `plenaria`: blue
- `mutirao`: blue
- `abaixo-assinado`: yellow
- `protocolo-requerimento`: neutral
- `reuniao-territorial`: blue
- `ato`: alert
- `oficina`: rust

### Leitura Territorial

- `bairro`: blue
- `pressao-alta`: alert
- `leitura-ativa`: neutral
- `foco-ativo`: yellow
- `sem-recorte`: neutral
- `recorte-ativo`: yellow

## Usos Migrados

- Cards de imovel
- Popups e legenda do mapa
- Shell do mapa e filtros ativos
- Bairros e bairro individual
- Agir e cards de acao
- Ficha de imovel
- Admin de imoveis
- Moderacao de contribuicoes
- Manager de acoes

## Resultado

Os selos ficaram mais consistentes, secos e escaneaveis. A cor agora comunica dominio e estado, sem parecer gamificacao ou colecao solta de chips.

## Verificacao

Executado com sucesso:

```bash
npm run lint
npm run typecheck
npm run build
```
