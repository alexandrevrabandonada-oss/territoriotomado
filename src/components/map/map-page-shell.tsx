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
    readyForMap: readonly ["todos", "sim", "nao"];
    priorityReviews: readonly ["todos", "alta", "media", "baixa"];
    locationStatuses: readonly ["todos", "confirmada", "aproximada", "ambigua", "pendente"];
    neighborhoods: Array<{ id: string; name: string }>;
  };
  initialContext: PublicListingContext;
}

const initialFilters: Required<PropertyFilters> = {
  status: "todos",
  criticality: "todos",
  neighborhood: "todos",
  readyForMap: "todos",
  priorityReview: "todos",
  locationStatus: "todos",
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

const readyForMapLabels: Record<Exclude<Required<PropertyFilters>["readyForMap"], "todos">, string> = {
  sim: "pronto para mapa",
  nao: "pendente no mapa",
};

const priorityReviewLabels: Record<Exclude<Required<PropertyFilters>["priorityReview"], "todos">, string> = {
  alta: "revisao alta",
  media: "revisao media",
  baixa: "revisao baixa",
};

const locationStatusLabels: Record<Exclude<Required<PropertyFilters>["locationStatus"], "todos">, string> = {
  confirmada: "localizacao confirmada",
  aproximada: "localizacao aproximada",
  ambigua: "localizacao ambigua",
  pendente: "localizacao pendente",
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
      readyForMap: nextContext.readyForMap,
      priorityReview: nextContext.priorityReview,
      locationStatus: nextContext.locationStatus,
    });
  }, [searchParams]);

  const filteredProperties = initialProperties.filter((property) => {
    const matchesStatus = deferredFilters.status === "todos" || property.status === deferredFilters.status;
    const matchesCriticality =
      deferredFilters.criticality === "todos" || property.criticality === deferredFilters.criticality;
    const matchesNeighborhood =
      deferredFilters.neighborhood === "todos" || property.neighborhoodId === deferredFilters.neighborhood;
    const matchesReady =
      deferredFilters.readyForMap === "todos" ||
      (deferredFilters.readyForMap === "sim" ? property.readyForMap : !property.readyForMap);
    const matchesPriority =
      deferredFilters.priorityReview === "todos" || property.priorityReview === deferredFilters.priorityReview;
    const matchesLocation =
      deferredFilters.locationStatus === "todos" || property.locationStatus === deferredFilters.locationStatus;

    return matchesStatus && matchesCriticality && matchesNeighborhood && matchesReady && matchesPriority && matchesLocation;
  });

  const activeFilterCount = [
    filters.status,
    filters.criticality,
    filters.neighborhood,
    filters.readyForMap,
    filters.priorityReview,
    filters.locationStatus,
  ].filter((value) => value !== "todos").length;
  const hasActiveFilters = activeFilterCount > 0;
  const focusedProperty = initialProperties.find((property) => property.slug === context.imovel);
  const criticalVisibleCount = filteredProperties.filter((property) => property.criticality === "alta").length;
  const readyVisibleCount = filteredProperties.filter((property) => property.readyForMap).length;
  const locationCounts = {
    confirmada: filteredProperties.filter((property) => property.locationStatus === "confirmada").length,
    aproximada: filteredProperties.filter((property) => property.locationStatus === "aproximada").length,
    ambigua: filteredProperties.filter((property) => property.locationStatus === "ambigua").length,
    pendente: filteredProperties.filter((property) => property.locationStatus === "pendente").length,
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
    filters.readyForMap !== "todos"
      ? { key: "readyForMap", kind: "territory" as const, value: "recorte-ativo", label: readyForMapLabels[filters.readyForMap] }
      : null,
    filters.priorityReview !== "todos"
      ? { key: "priorityReview", kind: "criticality" as const, value: filters.priorityReview, label: priorityReviewLabels[filters.priorityReview] }
      : null,
    filters.locationStatus !== "todos"
      ? { key: "locationStatus", kind: "territory" as const, value: "foco-ativo", label: locationStatusLabels[filters.locationStatus] }
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
        (merged.neighborhood === "todos" || focusedProperty.neighborhoodId === merged.neighborhood) &&
        (merged.readyForMap === "todos" || (merged.readyForMap === "sim" ? focusedProperty.readyForMap : !focusedProperty.readyForMap)) &&
        (merged.priorityReview === "todos" || focusedProperty.priorityReview === merged.priorityReview) &&
        (merged.locationStatus === "todos" || focusedProperty.locationStatus === merged.locationStatus)
      : false;
    const nextContext = {
      status: merged.status,
      criticality: merged.criticality,
      neighborhood: merged.neighborhood,
      readyForMap: merged.readyForMap,
      priorityReview: merged.priorityReview,
      locationStatus: merged.locationStatus,
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
      readyForMap: nextFilters.readyForMap,
      priorityReview: nextFilters.priorityReview,
      locationStatus: nextFilters.locationStatus,
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
      readyForMap: filters.readyForMap,
      priorityReview: filters.priorityReview,
      locationStatus: filters.locationStatus,
      imovel: propertySlug,
      from: "mapa",
    } satisfies PublicListingContext;

    setContext(nextContext);
    commitContext(nextContext);
  }

  function clearFilters() {
    updateFilters(initialFilters);
  }

  function renderTerritorialConfidencePanel() {
    return (
      <SidebarPanel title="Confianca territorial" dense tone="command">
        <div className="grid gap-2">
          <div className="grid gap-2">
            {(
              [
                {
                  status: "confirmada",
                  label: "confirmada",
                  description: "ponto com prova e midia no acervo",
                  tone: <Badge kind="territory" value="foco-ativo">mais confiavel</Badge>,
                  swatch: <span className="h-4 w-4 rotate-45 border-2 border-[#dfe7df] bg-[#6f8793] shadow-[0_0_0_5px_rgba(111,135,147,0.22)]" />,
                },
                {
                  status: "aproximada",
                  label: "aproximada",
                  description: "ponto valido, ainda sem confirmacao plena",
                  tone: <Badge tone="neutral">leitura operavel</Badge>,
                  swatch: <span className="h-4 w-4 rotate-45 border-2 border-[#ffd76a] bg-[#e9ad12] shadow-[0_0_0_5px_rgba(233,173,18,0.2)]" />,
                },
                {
                  status: "ambigua",
                  label: "ambigua",
                  description: "endereco ou evidencia exige revisao",
                  tone: <Badge tone="alert">revisar antes</Badge>,
                  swatch: <span className="h-4 w-4 rotate-45 border-2 border-[#ffd76a] bg-[#8f5944] shadow-[0_0_0_5px_rgba(196,139,112,0.24)]" />,
                },
                {
                  status: "pendente",
                  label: "pendente",
                  description: "sem ponto territorial utilizavel",
                  tone: <Badge tone="blue">fora do mapa</Badge>,
                  swatch: <span className="h-4 w-4 rotate-45 border-2 border-paper bg-ink-alt shadow-[0_0_0_5px_rgba(237,241,238,0.18)]" />,
                },
              ] as const
            ).map((item) => (
              <div key={item.status} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border border-concrete/14 bg-ink-alt/44 px-3 py-2.5">
                {item.swatch}
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge kind="territory" value="recorte-ativo" className="shrink-0">{item.label}</Badge>
                    <Badge variant="outline" tone="neutral" className="shrink-0">{locationCounts[item.status]}</Badge>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-paper/54">{item.description}</p>
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
        <div className="tt-panel border-steel/24 bg-[linear-gradient(180deg,rgba(58,72,82,0.24),rgba(26,31,35,0.92))] p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-concrete/16 px-1 pb-3 sm:px-0">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-signal font-bold">Mapa em operacao</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-paper/68 sm:text-sm">
                {filteredProperties.length}/{initialProperties.length} imoveis neste quadro
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {focusedProperty ? <Badge kind="territory" value="foco-ativo">foco ativo</Badge> : null}
              {hasActiveFilters ? (
                <>
                  <Badge kind="territory" value="recorte-ativo">{`${activeFilterCount} filtros ativos`}</Badge>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[10px] font-semibold uppercase tracking-[0.18em] text-signal hover:text-signal-light border border-signal/30 px-2.5 py-1 bg-signal/10 rounded transition-all duration-150"
                  >
                    limpar filtros
                  </button>
                </>
              ) : (
                <Badge kind="territory" value="sem-recorte">base completa</Badge>
              )}
            </div>
          </div>

          {/* Visible Horizontal Filters */}
          <div className="my-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 border-b border-concrete/16 pb-3.5 px-1">
            {/* Bairro Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-paper/60 px-0.5">Bairro</label>
              <select
                value={filters.neighborhood}
                onChange={(event) => updateFilters({ neighborhood: event.target.value as Required<PropertyFilters>["neighborhood"] })}
                className="tt-input px-3 py-2 text-xs uppercase tracking-[0.08em] bg-[#1a1f23] border border-concrete/20 text-paper rounded-md focus:border-signal/50 outline-none w-full"
              >
                <option value="todos">Todos os Bairros</option>
                {filterOptions.neighborhoods.map((neighborhood) => (
                  <option key={neighborhood.id} value={neighborhood.id}>
                    {neighborhood.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Pronto para Mapa Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-paper/60 px-0.5">Pronto para Mapa</label>
              <select
                value={filters.readyForMap}
                onChange={(event) => updateFilters({ readyForMap: event.target.value as Required<PropertyFilters>["readyForMap"] })}
                className="tt-input px-3 py-2 text-xs uppercase tracking-[0.08em] bg-[#1a1f23] border border-concrete/20 text-paper rounded-md focus:border-signal/50 outline-none w-full"
              >
                <option value="todos">Todos</option>
                <option value="sim">Sim (Mapeados)</option>
                <option value="nao">Não (Pendentes)</option>
              </select>
            </div>

            {/* Prioridade de Revisao Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-paper/60 px-0.5">Prioridade Revisão</label>
              <select
                value={filters.priorityReview}
                onChange={(event) => updateFilters({ priorityReview: event.target.value as Required<PropertyFilters>["priorityReview"] })}
                className="tt-input px-3 py-2 text-xs uppercase tracking-[0.08em] bg-[#1a1f23] border border-concrete/20 text-paper rounded-md focus:border-signal/50 outline-none w-full"
              >
                <option value="todos">Todas</option>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>

            {/* Status da Localizacao Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-paper/60 px-0.5">Status Localização</label>
              <select
                value={filters.locationStatus}
                onChange={(event) => updateFilters({ locationStatus: event.target.value as Required<PropertyFilters>["locationStatus"] })}
                className="tt-input px-3 py-2 text-xs uppercase tracking-[0.08em] bg-[#1a1f23] border border-concrete/20 text-paper rounded-md focus:border-signal/50 outline-none w-full"
              >
                <option value="todos">Todos os Status</option>
                <option value="confirmada">Confirmada</option>
                <option value="aproximada">Aproximada</option>
                <option value="ambigua">Ambígua</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>
          </div>

          {mapProperties.length > 0 ? (
            <PropertyMap
              properties={mapProperties}
              focusSlug={context.imovel}
              navigationContext={context}
              className="mt-2 h-[420px] sm:h-[540px] xl:mt-3 xl:h-[calc(100vh-240px)] xl:min-h-[640px]"
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
                actionLabel="Limpar filtros"
                actionHref={emptyStateHref}
              />
            </div>
          )}

          {/* Legenda de Confianca Territorial */}
          <div className="mt-4 border-t border-concrete/16 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-signal mb-2.5 px-1">Legenda de Confiança Territorial</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(
                [
                  {
                    status: "confirmada",
                    label: "Confirmada",
                    description: "Ponto com prova e mídia no acervo",
                    swatch: <span className="h-3 w-3 rotate-45 border border-[#dfe7df] bg-[#6f8793] shadow-[0_0_0_3px_rgba(111,135,147,0.22)] shrink-0" />,
                  },
                  {
                    status: "aproximada",
                    label: "Aproximada",
                    description: "Ponto válido, sem confirmação plena",
                    swatch: <span className="h-3 w-3 rotate-45 border border-[#ffd76a] bg-[#e9ad12] shadow-[0_0_0_3px_rgba(233,173,18,0.2)] shrink-0" />,
                  },
                  {
                    status: "ambigua",
                    label: "Ambígua",
                    description: "Endereço ou evidência exige revisão",
                    swatch: <span className="h-3 w-3 rotate-45 border border-[#ffd76a] bg-[#8f5944] shadow-[0_0_0_3px_rgba(196,139,112,0.24)] shrink-0" />,
                  },
                  {
                    status: "pendente",
                    label: "Pendente",
                    description: "Sem ponto territorial utilizável",
                    swatch: <span className="h-3 w-3 rotate-45 border border-paper bg-ink-alt shadow-[0_0_0_3px_rgba(237,241,238,0.18)] shrink-0" />,
                  },
                ] as const
              ).map((item) => (
                <div key={item.status} className="flex items-center gap-3 border border-concrete/14 bg-ink-alt/44 px-3 py-2.5 hover:bg-ink-alt/70 transition-all duration-150 rounded">
                  {item.swatch}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-paper">{item.label}</span>
                      <Badge variant="outline" tone="neutral" className="text-[9px] px-1 py-0">{locationCounts[item.status]}</Badge>
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-paper/54 truncate">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

              <FilterGroup
                label="Pronto para mapa"
                meta={filters.readyForMap !== "todos" ? <Badge kind="territory" value="recorte-ativo">ativo</Badge> : "mapa"}
                description="ponto utilizavel na cartografia"
                className={filters.readyForMap !== "todos" ? "border border-signal/18 bg-signal/6 px-3 py-3 text-paper/82" : "border border-concrete/14 bg-ink-alt/22 px-3 py-3"}
              >
                <select
                  value={filters.readyForMap}
                  onChange={(event) => updateFilters({ readyForMap: event.target.value as Required<PropertyFilters>["readyForMap"] })}
                  className="tt-input px-3 py-2.5 text-sm uppercase tracking-[0.08em]"
                >
                  {filterOptions.readyForMap.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup
                label="Prioridade revisao"
                meta={filters.priorityReview !== "todos" ? <Badge kind="criticality" value={filters.priorityReview}>ativo</Badge> : "revisao"}
                description="alta, media ou baixa"
                className={filters.priorityReview !== "todos" ? "border border-signal/18 bg-signal/6 px-3 py-3 text-paper/82" : "border border-concrete/14 bg-ink-alt/22 px-3 py-3"}
              >
                <select
                  value={filters.priorityReview}
                  onChange={(event) => updateFilters({ priorityReview: event.target.value as Required<PropertyFilters>["priorityReview"] })}
                  className="tt-input px-3 py-2.5 text-sm uppercase tracking-[0.08em]"
                >
                  {filterOptions.priorityReviews.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup
                label="Status localizacao"
                meta={filters.locationStatus !== "todos" ? <Badge kind="territory" value="foco-ativo">ativo</Badge> : "confianca"}
                description="confirmada, aproximada, ambigua ou pendente"
                className={filters.locationStatus !== "todos" ? "border border-signal/18 bg-signal/6 px-3 py-3 text-paper/82" : "border border-concrete/14 bg-ink-alt/22 px-3 py-3"}
              >
                <select
                  value={filters.locationStatus}
                  onChange={(event) => updateFilters({ locationStatus: event.target.value as Required<PropertyFilters>["locationStatus"] })}
                  className="tt-input px-3 py-2.5 text-sm uppercase tracking-[0.08em]"
                >
                  {filterOptions.locationStatuses.map((value) => (
                    <option key={value} value={value}>
                      {value}
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

        <div className="xl:hidden">{renderTerritorialConfidencePanel()}</div>

        <div className="xl:hidden">
          <SidebarPanel title="Resumo do recorte" dense tone="command">
            <div className="grid grid-cols-3 gap-2">
              <div className="border border-concrete/16 bg-ink-alt/44 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-paper/56">visiveis</p>
                <p className="mt-1 font-display text-2xl uppercase text-paper">{filteredProperties.length}</p>
              </div>
              <div className="border border-concrete/16 bg-ink-alt/44 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-paper/56">prontos</p>
                <p className="mt-1 font-display text-2xl uppercase text-paper">{readyVisibleCount}</p>
              </div>
              <div className="border border-concrete/16 bg-ink-alt/44 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-paper/56">criticos</p>
                <p className="mt-1 font-display text-2xl uppercase text-paper">{criticalVisibleCount}</p>
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
              <p className="text-[10px] uppercase tracking-[0.18em] text-paper/56">prontos</p>
              <p className="mt-1 font-display text-2xl uppercase text-paper">{readyVisibleCount}</p>
            </div>
            <div className="border border-concrete/16 bg-ink-alt/44 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-paper/56">criticos</p>
              <p className="mt-1 font-display text-2xl uppercase text-paper">{criticalVisibleCount}</p>
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

            <FilterGroup
              label="Pronto para mapa"
              meta={filters.readyForMap !== "todos" ? <Badge kind="territory" value="recorte-ativo">ativo</Badge> : "mapa"}
              description="ponto utilizavel na cartografia"
              className={filters.readyForMap !== "todos" ? "border border-signal/18 bg-signal/6 px-3 py-3 text-paper/82" : "border border-concrete/14 bg-ink-alt/22 px-3 py-3"}
            >
              <select
                value={filters.readyForMap}
                onChange={(event) => updateFilters({ readyForMap: event.target.value as Required<PropertyFilters>["readyForMap"] })}
                className="tt-input px-3 py-2.5 text-sm uppercase tracking-[0.08em]"
              >
                {filterOptions.readyForMap.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup
              label="Prioridade revisao"
              meta={filters.priorityReview !== "todos" ? <Badge kind="criticality" value={filters.priorityReview}>ativo</Badge> : "revisao"}
              description="alta, media ou baixa"
              className={filters.priorityReview !== "todos" ? "border border-signal/18 bg-signal/6 px-3 py-3 text-paper/82" : "border border-concrete/14 bg-ink-alt/22 px-3 py-3"}
            >
              <select
                value={filters.priorityReview}
                onChange={(event) => updateFilters({ priorityReview: event.target.value as Required<PropertyFilters>["priorityReview"] })}
                className="tt-input px-3 py-2.5 text-sm uppercase tracking-[0.08em]"
              >
                {filterOptions.priorityReviews.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup
              label="Status localizacao"
              meta={filters.locationStatus !== "todos" ? <Badge kind="territory" value="foco-ativo">ativo</Badge> : "confianca"}
              description="confirmada, aproximada, ambigua ou pendente"
              className={filters.locationStatus !== "todos" ? "border border-signal/18 bg-signal/6 px-3 py-3 text-paper/82" : "border border-concrete/14 bg-ink-alt/22 px-3 py-3"}
            >
              <select
                value={filters.locationStatus}
                onChange={(event) => updateFilters({ locationStatus: event.target.value as Required<PropertyFilters>["locationStatus"] })}
                className="tt-input px-3 py-2.5 text-sm uppercase tracking-[0.08em]"
              >
                {filterOptions.locationStatuses.map((value) => (
                  <option key={value} value={value}>
                    {value}
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

        {renderTerritorialConfidencePanel()}

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
