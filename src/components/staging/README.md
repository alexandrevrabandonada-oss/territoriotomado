## Staging de componentes

Esta pasta guarda componentes retirados do fluxo principal durante o hardening.

- `blocks/section-heading.tsx`: substituido por `ui/section-header.tsx`
- `layout/site-header.tsx` e `layout/site-footer.tsx`: absorvidos por `layout/app-shell.tsx`
- `ui/status-badge.tsx`: consolidado em `ui/badge.tsx`
- `properties/property-filters.tsx`: reservado para a futura camada de filtros reais
- `map/property-map.tsx` e `map/map-page-shell.tsx`: estacionamento do experimento de mapa para o proximo tijolo

Regra: so retorna ao fluxo principal quando houver uso real em rota ativa.
