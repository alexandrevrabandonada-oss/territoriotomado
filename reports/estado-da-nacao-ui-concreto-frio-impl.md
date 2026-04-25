# Estado da Nacao: UI Concreto Frio Impl

## Objetivo

Implementar a direcao visual Concreto Frio como camada estrutural de codigo, sem redesenhar o produto do zero e sem quebrar componentes existentes.

## Implementado

- `tailwind.config.ts` recebeu paleta expandida com variacoes de `ink`, `signal`, `rust`, `concrete`, `steel` e `glass`.
- Foram adicionados shadows reutilizaveis:
  - `shadow-tt-panel`
  - `shadow-tt-card`
  - `shadow-tt-map`
  - `shadow-tt-signal`
- Foram adicionados gradientes reutilizaveis:
  - `bg-tt-concrete-field`
  - `bg-tt-glass-panel`
  - `bg-tt-hero`
  - `bg-tt-alert-line`
- `globals.css` passou a expor classes semanticas:
  - `tt-shell`
  - `tt-hero`
  - `tt-panel`
  - `tt-card`
  - `tt-metric`
  - `tt-chip`
  - `tt-button`
  - `tt-button-primary`
  - `tt-button-secondary`
  - `tt-button-ghost`
  - `tt-input`
  - `tt-sidebar`

## Rotas Aplicadas

- `/mapa`: mapa maior, painel de foco e sidebar operacional com `tt-panel`, `tt-sidebar`, `tt-chip` e `tt-input`.
- `/admin`: mesa editorial usando `tt-panel` e `tt-sidebar`.
- `/admin/imoveis` e `/admin/contribuicoes`: normalizacao leve para evitar ruptura visual na area admin.
- `/bairros`: cards territoriais migrados para `tt-card`.
- `/agir`: frentes de acao migradas para `tt-panel`.
- `/`: hero principal usando `tt-hero` e blocos secundarios com `tt-card`.

## Componentes Compartilhados

- `AppShell` usa `tt-shell`.
- `InternalPageHeader` usa `tt-hero`, mantendo herois internos curtos.
- `MetricCard` usa `tt-metric`.
- `Badge` usa `tt-chip`.
- `ButtonLink` usa `tt-button` e variantes globais.
- `PropertyCard` usa `tt-card`.

## Resultado

A UI ficou menos dependente de preto absoluto e mais ancorada em grafite frio, concreto mineral, vidro azulado e amarelo VR Abandonada. A identidade continua dura e politica, mas com mais ar, profundidade cromatica e legibilidade operacional.

## Verificacao

Rodar:

```bash
npm run lint
npm run typecheck
npm run build
```

Tambem revisar visualmente `/`, `/mapa`, `/bairros`, `/agir`, `/admin`, `/admin/imoveis` e `/admin/contribuicoes`.
