"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { FilterGroup } from "@/components/ui/filter-group";
import { SidebarPanel } from "@/components/ui/sidebar-panel";
import type { PropertyFilters, PropertyMapFeature } from "@/lib/data/queries";
import { buildPublicListingHref, parsePublicListingContext, type PublicListingContext } from "@/lib/navigation/public-context";

const PropertyMap = dynamic(() => import("@/components/map/property-map").then((module) => module.PropertyMap), {
  ssr: false,
  loading: () => <div className="tt-panel h-[420px] animate-pulse sm:h-[540px] xl:h-[calc(100vh-182px)] xl:min-h-[720px]" />,
});

interface MapPageShellProps {
  initialProperties: PropertyMapFeature[];
  filterOptions: {
    statuses: readonly ["todos", "ocupado", "vazio", "em-disputa", "uso-institucional"];
    criticalities: readonly ["todos", "alta", "media", "baixa"];
    neighborhoods: Array<{ id: string; name: string }>;
  };
  initialContext: PublicListingContext;
}

const initialFilters: Required<PropertyFilters> = {
  status: "todos",
  criticality: "todos",
  neighborhood: "todos",
};

const statusLabels: Record<Exclude<Required<PropertyFilters>["status"], "todos">, string> = {
  ocupado: "ocupado",
  vazio: "vazio",
  "em-disputa": "em disputa",
  "uso-institucional": "uso institucional",
};

const criticalityLabels: Record<Exclude<Required<PropertyFilters>["criticality"], "todos">, string> = {
  alta: "criticidade alta",
  media: "criticidade media",
  baixa: "criticidade baixa",
};

export function MapPageShell({ initialProperties, filterOptions, initialContext }: MapPageShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Required<PropertyFilters>>(initialFilters);
  const [context, setContext] = useState<PublicListingContext>(initialContext);
  const deferredFilters = useDeferredValue(filters);

  useEffect(() => {
    const nextContext = parsePublicListingContext(searchParams);
    setContext(nextContext);
    setFilters({
      status: nextContext.status,
      criticality: nextContext.criticality,
      neighborhood: nextContext.neighborhood,
    });
  }, [searchParams]);

  const filteredProperties = initialProperties.filter((property) => {
    const matchesStatus = deferredFilters.status === "todos" || property.status === deferredFilters.status;
    const matchesCriticality =
      deferredFilters.criticality === "todos" || property.criticality === deferredFilters.criticality;
    const matchesNeighborhood =
      deferredFilters.neighborhood === "todos" || property.neighborhoodId === deferredFilters.neighborhood;

    return matchesStatus && matchesCriticality && matchesNeighborhood;
  });

  const activeFilterCount = [filters.status, filters.criticality, filters.neighborhood].filter((value) => value !== "todos").length;
  const hasActiveFilters = activeFilterCount > 0;
  const focusedProperty = initialProperties.find((property) => property.slug === context.imovel);
  const criticalVisibleCount = filteredProperties.filter((property) => property.criticality === "alta").length;
  const disputedVisibleCount = filteredProperties.filter((property) => property.status === "em-disputa").length;
  const statusCounts = {
    ocupado: filteredProperties.filter((property) => property.status === "ocupado").length,
    vazio: filteredProperties.filter((property) => property.status === "vazio").length,
    "em-disputa": filteredProperties.filter((property) => property.status === "em-disputa").length,
    "uso-institucional": filteredProperties.filter((property) => property.status === "uso-institucional").length,
  } as const;
  const activeFilterBadges = [
    filters.neighborhood !== "todos"
      ? {
          key: "neighborhood",
          kind: "territory" as const,
          value: "recorte-ativo",
          label: filterOptions.neighborhoods.find((neighborhood) => neighborhood.id === filters.neighborhood)?.name ?? filters.neighborhood,
        }
      : null,
    filters.status !== "todos"
      ? { key: "status", kind: "status" as const, value: filters.status, label: statusLabels[filters.status] }
      : null,
    filters.criticality !== "todos"
      ? {
          key: "criticality",
          kind: "criticality" as const,
          value: filters.criticality,
          label: criticalityLabels[filters.criticality],
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);
  const emptyStateHref = buildPublicListingHref(pathname, {
    ...initialFilters,
    from: "mapa",
  });
  const mapProperties =
    focusedProperty && !filteredProperties.some((property) => property.id === focusedProperty.id)
      ? [focusedProperty, ...filteredProperties]
      : filteredProperties;
  const neighborhoodQuickFocus = filterOptions.neighborhoods
    .map((neighborhood) => ({
      ...neighborhood,
      count: initialProperties.filter((property) => {
        const matchesNeighborhood = property.neighborhoodId === neighborhood.id;
        const matchesStatus = filters.status === "todos" || property.status === filters.status;
        const matchesCriticality = filters.criticality === "todos" || property.criticality === filters.criticality;

        return matchesNeighborhood && matchesStatus && matchesCriticality;
      }).length,
    }))
    .filter((neighborhood) => neighborhood.count > 0)
    .sort((left, right) => right.count - left.count)
    .slice(0, 5);
  const propertyQuickFocus = filteredProperties.slice(0, 6);

  function commitContext(nextContext: PublicListingContext) {
    startTransition(() => {
      router.replace(buildPublicListingHref(pathname, nextContext), { scroll: false });
    });
  }

  function updateFilters(next: Partial<Required<PropertyFilters>>) {
    const merged = { ...filters, ...next };
    const focusedStillVisible = focusedProperty
      ? (merged.status === "todos" || focusedProperty.status === merged.status) &&
        (merged.criticality === "todos" || focusedProperty.criticality === merged.criticality) &&
        (merged.neighborhood === "todos" || focusedProperty.neighborhoodId === merged.neighborhood)
      : false;
    const nextContext = {
      status: merged.status,
      criticality: merged.criticality,
      neighborhood: merged.neighborhood,
      imovel: focusedStillVisible ? context.imovel : undefined,
      from: context.from,
    } satisfies PublicListingContext;

    setFilters(merged);
    setContext(nextContext);
    commitContext(nextContext);
  }

  function focusNeighborhood(neighborhoodId: string) {
    const nextFilters = { ...filters, neighborhood: neighborhoodId };
    const nextContext = {
      status: nextFilters.status,
      criticality: nextFilters.criticality,
      neighborhood: neighborhoodId,
      imovel: focusedProperty?.neighborhoodId === neighborhoodId ? focusedProperty.slug : undefined,
      from: "mapa",
    } satisfies PublicListingContext;

    setFilters(nextFilters);
    setContext(nextContext);
    commitContext(nextContext);
  }

  function focusProperty(propertySlug?: string) {
    const nextContext = {
      status: filters.status,
      criticality: filters.criticality,
      neighborhood: filters.neighborhood,
      imovel: propertySlug,
      from: "mapa",
    } satisfies PublicListingContext;

    setContext(nextContext);
    commitContext(nextContext);
  }

  function clearFilters() {
    updateFilters(initialFilters);
  }

  function renderLegendPanel() {
    return (
      <SidebarPanel title="Estados e leitura" dense tone="command">
        <div className="grid gap-2">
          <div className="grid gap-2">
            {(
              [
                {
                  status: "vazio",
                  tone: <Badge kind="territory" value="pressao-alta">prioridade de leitura</Badge>,
                  swatch: <span className="h-4 w-4 rotate-45 border-2 border-[#ffd04d] bg-rust shadow-[0_0_0_5px_rgba(216,155,114,0.22)]" />,
                },
                {
                  status: "em-disputa",
                  tone: <Badge tone="alert">conflito ativo</Badge>,
                  swatch: <span className="h-4 w-4 rotate-45 border-2 border-[#ffd04d] bg-signal shadow-[0_0_0_6px_rgba(242,179,0,0.22)]" />,
                },
                {
                  status: "ocupado",
                  tone: <Badge tone="neutral">uso em curso</Badge>,
                  swatch: <span className="h-4 w-4 rotate-45 border-2 border-paper bg-muted shadow-[0_0_0_5px_rgba(184,175,163,0.2)]" />,
                },
                {
                  status: "uso-institucional",
                  tone: <Badge tone="blue">uso residual</Badge>,
                  swatch: <span className="h-4 w-4 rotate-45 border-2 border-paper bg-ink-alt shadow-[0_0_0_5px_rgba(237,241,238,0.18)]" />,
                },
              ] as const
            ).map((item) => (
              <div key={item.status} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border border-concrete/14 bg-ink-alt/44 px-3 py-2.5">
                {item.swatch}
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge kind="status" value={item.status} className="shrink-0" />
                    <Badge variant="outline" tone="neutral" className="shrink-0">{statusCounts[item.status]}</Badge>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-paper/54">{statusCounts[item.status]} imoveis neste recorte</p>
                </div>
                {item.tone}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 border border-concrete/14 bg-ink-alt/44 px-3 py-2.5">
            <div className="flex items-center gap-3">
              <span className="relative inline-flex h-4 w-4 rotate-45 border-2 border-[#ffd04d] bg-signal shadow-[0_0_0_8px_rgba(242,179,0,0.14)]">
                <span className="absolute inset-[3px] bg-ink-alt" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-paper/75">selecionado</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-paper/54">pin em foco na leitura</p>
              </div>
            </div>
            <Badge kind="territory" value="foco-ativo">foco ativo</Badge>
          </div>
        </div>
      </SidebarPanel>
    );
  }

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
      <section className="space-y-3">
        <div className="tt-panel border-steel/24 bg-[linear-gradient(180deg,rgba(58,72,82,0.24),rgba(26,31,35,0.92))] p-2 sm:p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-concrete/16 px-1 pb-2 sm:px-0">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-signal">Mapa em operacao</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-paper/68 sm:text-sm">
                {filteredProperties.length}/{initialProperties.length} imoveis neste quadro
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {focusedProperty ? <Badge kind="territory" value="foco-ativo">foco ativo</Badge> : null}
              {hasActiveFilters ? <Badge kind="territory" value="recorte-ativo">{`${activeFilterCount} filtros ativos`}</Badge> : <Badge kind="territory" value="sem-recorte">base completa</Badge>}
            </div>
          </div>

          {mapProperties.length > 0 ? (
            <PropertyMap
              properties={mapProperties}
              focusSlug={context.imovel}
              navigationContext={context}
              className="mt-2 h-[420px] sm:h-[540px] xl:mt-3 xl:h-[calc(100vh-182px)] xl:min-h-[720px]"
            />
          ) : (
            <div className="mt-2 space-y-2 xl:mt-3">
              {hasActiveFilters ? (
                <div className="flex flex-wrap gap-2 px-1">
                  {activeFilterBadges.map((filterBadge) => (
                    <Badge key={filterBadge.key} kind={filterBadge.kind} value={filterBadge.value}>
                      {filterBadge.label}
                    </Badge>
                  ))}
                </div>
              ) : null}
              <EmptyState
                title="Nenhum imovel neste recorte"
                description={
                  hasActiveFilters
                    ? "Este recorte filtrou o quadro inteiro. Limpe filtros ou alivie bairro, status e criticidade para reencontrar massa territorial."
                    : "Nao ha imoveis disponiveis neste quadro agora."
                }
                eyebrow={hasActiveFilters ? "recorte sem correspondencia" : "sem registro publico"}
                actionLabel={hasActiveFilters ? "Limpar filtros" : undefined}
                actionHref={hasActiveFilters ? emptyStateHref : undefined}
              />
            </div>
          )}
        </div>

        <div className="xl:hidden space-y-3">
          <SidebarPanel
            title="Painel operacional"
            dense
            tone="command"
            badge={<Badge kind="territory" value={hasActiveFilters ? "recorte-ativo" : "sem-recorte"}>{hasActiveFilters ? "recorte ativo" : "base completa"}</Badge>}
          >
            <div className="grid gap-2.5">
              {hasActiveFilters ? (
                <div className="space-y-2 border border-signal/20 bg-signal/8 px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-signal">Filtros ativos</p>
                    <button type="button" onClick={clearFilters} className="text-[10px] font-semibold uppercase tracking-[0.18em] text-signal transition hover:text-signal-light">
                      limpar filtros
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeFilterBadges.map((filterBadge) => (
                      <Badge key={filterBadge.key} kind={filterBadge.kind} value={filterBadge.value}>
                        {filterBadge.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              <FilterGroup
                label="Bairro"
                meta={filters.neighborhood !== "todos" ? <Badge kind="territory" value="recorte-ativo">ativo</Badge> : "recorte"}
                description="unidade territorial"
                className={filters.neighborhood !== "todos" ? "border border-signal/18 bg-signal/6 px-3 py-3 text-paper/82" : "border border-concrete/14 bg-ink-alt/22 px-3 py-3"}
              >
                <select
                  value={filters.neighborhood}
                  onChange={(event) => updateFilters({ neighborhood: event.target.value as Required<PropertyFilters>["neighborhood"] })}
                  className="tt-input px-3 py-2.5 text-sm uppercase tracking-[0.08em]"
                >
                  <option value="todos">todos</option>
                  {filterOptions.neighborhoods.map((neighborhood) => (
                    <option key={neighborhood.id} value={neighborhood.id}>
                      {neighborhood.name}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup
                label="Status"
                meta={filters.status !== "todos" ? <Badge kind="status" value={filters.status}>ativo</Badge> : "uso"}
                description="ocupacao, vacancia ou disputa"
                className={filters.status !== "todos" ? "border border-signal/18 bg-signal/6 px-3 py-3 text-paper/82" : "border border-concrete/14 bg-ink-alt/22 px-3 py-3"}
              >
                <select
                  value={filters.status}
                  onChange={(event) => updateFilters({ status: event.target.value as Required<PropertyFilters>["status"] })}
                  className="tt-input px-3 py-2.5 text-sm uppercase tracking-[0.08em]"
                >
                  {filterOptions.statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup
                label="Criticidade"
                meta={filters.criticality !== "todos" ? <Badge kind="criticality" value={filters.criticality}>ativo</Badge> : "risco"}
                description="prioridade de leitura publica"
                className={filters.criticality !== "todos" ? "border border-signal/18 bg-signal/6 px-3 py-3 text-paper/82" : "border border-concrete/14 bg-ink-alt/22 px-3 py-3"}
              >
                <select
                  value={filters.criticality}
                  onChange={(event) => updateFilters({ criticality: event.target.value as Required<PropertyFilters>["criticality"] })}
                  className="tt-input px-3 py-2.5 text-sm uppercase tracking-[0.08em]"
                >
                  {filterOptions.criticalities.map((criticality) => (
                    <option key={criticality} value={criticality}>
                      {criticality}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <button
                type="button"
                onClick={clearFilters}
                className="tt-button tt-button-secondary py-2.5 text-xs hover:border-signal/35 hover:text-signal disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!hasActiveFilters}
              >
                limpar filtros
              </button>
            </div>
          </SidebarPanel>
        </div>

        {focusedProperty ? (
          <div className="xl:hidden">
            <SidebarPanel title="Imovel em foco" dense tone="alert" badge={<Badge kind="territory" value="foco-ativo">em foco</Badge>}>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <p className="text-sm uppercase tracking-[0.16em] text-paper">{focusedProperty.title}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-paper/55">{focusedProperty.neighborhoodName}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge kind="status" value={focusedProperty.status} />
                    <Badge kind="criticality" value={focusedProperty.criticality} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={buildPublicListingHref(`/imoveis/${focusedProperty.slug}`, context, {
                      imovel: focusedProperty.slug,
                      from: "mapa",
                    })}
                    className="tt-button text-xs"
                  >
                    Ver ficha
                  </Link>
                  <button
                    type="button"
                    onClick={() => focusProperty(undefined)}
                    className="tt-button tt-button-ghost text-xs"
                  >
                    limpar foco
                  </button>
                </div>
              </div>
            </SidebarPanel>
          </div>
        ) : null}

        <div className="xl:hidden">{renderLegendPanel()}</div>

        <div className="xl:hidden">
          <SidebarPanel title="Resumo do recorte" dense tone="command">
            <div className="grid grid-cols-3 gap-2">
              <div className="border border-concrete/16 bg-ink-alt/44 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-paper/56">visiveis</p>
                <p className="mt-1 font-display text-2xl uppercase text-paper">{filteredProperties.length}</p>
              </div>
              <div className="border border-concrete/16 bg-ink-alt/44 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-paper/56">criticos</p>
                <p className="mt-1 font-display text-2xl uppercase text-paper">{criticalVisibleCount}</p>
              </div>
              <div className="border border-concrete/16 bg-ink-alt/44 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-paper/56">disputa</p>
                <p className="mt-1 font-display text-2xl uppercase text-paper">{disputedVisibleCount}</p>
              </div>
            </div>
          </SidebarPanel>
        </div>
      </section>

      <aside className="space-y-3 xl:sticky xl:top-20">
        <SidebarPanel
          title="Resumo do recorte"
          dense
          tone="command"
          badge={<Badge kind="territory" value={hasActiveFilters ? "recorte-ativo" : "sem-recorte"}>{hasActiveFilters ? "recorte ativo" : "base completa"}</Badge>}
        >
          <div className="grid grid-cols-3 gap-2">
            <div className="border border-concrete/16 bg-ink-alt/44 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-paper/56">visiveis</p>
              <p className="mt-1 font-display text-2xl uppercase text-paper">{filteredProperties.length}</p>
            </div>
            <div className="border border-concrete/16 bg-ink-alt/44 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-paper/56">criticos</p>
              <p className="mt-1 font-display text-2xl uppercase text-paper">{criticalVisibleCount}</p>
            </div>
            <div className="border border-concrete/16 bg-ink-alt/44 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-paper/56">disputa</p>
              <p className="mt-1 font-display text-2xl uppercase text-paper">{disputedVisibleCount}</p>
            </div>
          </div>
        </SidebarPanel>

        {focusedProperty ? (
          <SidebarPanel title="Imovel em foco" dense tone="alert" badge={<Badge kind="territory" value="foco-ativo">em foco</Badge>}>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <p className="text-sm uppercase tracking-[0.16em] text-paper">{focusedProperty.title}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-paper/55">{focusedProperty.neighborhoodName}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge kind="status" value={focusedProperty.status} />
                  <Badge kind="criticality" value={focusedProperty.criticality} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={buildPublicListingHref(`/imoveis/${focusedProperty.slug}`, context, {
                    imovel: focusedProperty.slug,
                    from: "mapa",
                  })}
                  className="tt-button text-xs"
                >
                  Ver ficha
                </Link>
                <ButtonLink href={buildPublicListingHref("/imoveis", context, { from: "mapa" })} variant="secondary">
                  Ver lista
                </ButtonLink>
                <button
                  type="button"
                  onClick={() => focusProperty(undefined)}
                  className="tt-button tt-button-ghost text-xs"
                >
                  limpar foco
                </button>
              </div>
            </div>
          </SidebarPanel>
        ) : null}

        <SidebarPanel
          title="Filtros do mapa"
          dense
          tone="command"
          badge={<Badge kind="territory" value={hasActiveFilters ? "recorte-ativo" : "sem-recorte"}>{hasActiveFilters ? "recorte ativo" : "base completa"}</Badge>}
        >
          <div className="grid gap-2.5">
            {hasActiveFilters ? (
              <div className="space-y-2 border border-signal/20 bg-signal/8 px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-signal">Filtros ativos</p>
                  <button type="button" onClick={clearFilters} className="text-[10px] font-semibold uppercase tracking-[0.18em] text-signal transition hover:text-signal-light">
                    limpar filtros
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeFilterBadges.map((filterBadge) => (
                    <Badge key={filterBadge.key} kind={filterBadge.kind} value={filterBadge.value}>
                      {filterBadge.label}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            <FilterGroup
              label="Bairro"
              meta={filters.neighborhood !== "todos" ? <Badge kind="territory" value="recorte-ativo">ativo</Badge> : "recorte"}
              description="unidade territorial"
              className={filters.neighborhood !== "todos" ? "border border-signal/18 bg-signal/6 px-3 py-3 text-paper/82" : "border border-concrete/14 bg-ink-alt/22 px-3 py-3"}
            >
              <select
                value={filters.neighborhood}
                onChange={(event) => updateFilters({ neighborhood: event.target.value as Required<PropertyFilters>["neighborhood"] })}
                className="tt-input px-3 py-2.5 text-sm uppercase tracking-[0.08em]"
              >
                <option value="todos">todos</option>
                {filterOptions.neighborhoods.map((neighborhood) => (
                  <option key={neighborhood.id} value={neighborhood.id}>
                    {neighborhood.name}
                  </option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup
              label="Status"
              meta={filters.status !== "todos" ? <Badge kind="status" value={filters.status}>ativo</Badge> : "uso"}
              description="ocupacao, vacancia ou disputa"
              className={filters.status !== "todos" ? "border border-signal/18 bg-signal/6 px-3 py-3 text-paper/82" : "border border-concrete/14 bg-ink-alt/22 px-3 py-3"}
            >
              <select
                value={filters.status}
                onChange={(event) => updateFilters({ status: event.target.value as Required<PropertyFilters>["status"] })}
                className="tt-input px-3 py-2.5 text-sm uppercase tracking-[0.08em]"
              >
                {filterOptions.statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup
              label="Criticidade"
              meta={filters.criticality !== "todos" ? <Badge kind="criticality" value={filters.criticality}>ativo</Badge> : "risco"}
              description="prioridade de leitura publica"
              className={filters.criticality !== "todos" ? "border border-signal/18 bg-signal/6 px-3 py-3 text-paper/82" : "border border-concrete/14 bg-ink-alt/22 px-3 py-3"}
            >
              <select
                value={filters.criticality}
                onChange={(event) => updateFilters({ criticality: event.target.value as Required<PropertyFilters>["criticality"] })}
                className="tt-input px-3 py-2.5 text-sm uppercase tracking-[0.08em]"
              >
                {filterOptions.criticalities.map((criticality) => (
                  <option key={criticality} value={criticality}>
                    {criticality}
                  </option>
                ))}
              </select>
            </FilterGroup>

            <button
              type="button"
                onClick={clearFilters}
                className="tt-button tt-button-secondary py-2.5 text-xs hover:border-signal/35 hover:text-signal disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!hasActiveFilters}
            >
                limpar filtros
            </button>
          </div>
        </SidebarPanel>

        <SidebarPanel title="Focos rapidos" dense tone="command">
          <div className="grid gap-3">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.22em] text-signal">Bairros com massa</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateFilters({ neighborhood: "todos" })}
                  className={`tt-chip px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                    filters.neighborhood === "todos"
                      ? "border-signal/40 bg-paper/10 text-signal"
                      : "bg-ink-alt/42 text-paper/70 hover:border-glass/34 hover:text-paper"
                  }`}
                >
                  todos
                </button>
                {neighborhoodQuickFocus.map((neighborhood) => (
                  <button
                    key={neighborhood.id}
                    type="button"
                    onClick={() => focusNeighborhood(neighborhood.id)}
                    className={`tt-chip px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                      filters.neighborhood === neighborhood.id
                        ? "border-signal/40 bg-paper/10 text-signal"
                        : "bg-ink-alt/42 text-paper/70 hover:border-glass/34 hover:text-paper"
                    }`}
                  >
                    {neighborhood.name} <span className="text-paper/40">{neighborhood.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.22em] text-signal">Imoveis em leitura</p>
              {propertyQuickFocus.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {propertyQuickFocus.map((property) => (
                    <button
                      key={property.id}
                      type="button"
                      onClick={() => focusProperty(property.slug)}
                      className={`tt-chip px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                        context.imovel === property.slug
                          ? "border-signal/40 bg-paper/10 text-signal"
                          : "bg-ink-alt/42 text-paper/72 hover:border-glass/34 hover:text-paper"
                      }`}
                    >
                      {property.title}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-paper/55">Nenhum imovel neste recorte.</p>
              )}
            </div>
          </div>
        </SidebarPanel>

        {renderLegendPanel()}

        <SidebarPanel title="Uso" dense>
          <p className="text-sm leading-6 text-paper/72">
            Recorte, foque um imovel e abra ficha/lista como profundidade.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href={buildPublicListingHref("/imoveis", context, { from: "mapa" })} variant="secondary">
              Abrir lista
            </ButtonLink>
            <ButtonLink href="/agir" variant="ghost">
              Ver acoes
            </ButtonLink>
          </div>
        </SidebarPanel>
      </aside>
    </div>
  );
}
