"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterGroup } from "@/components/ui/filter-group";
import { PanelCard } from "@/components/ui/panel-card";
import { PropertyCard } from "@/components/properties/property-card";
import { buildPublicListingHref, parsePublicListingContext, type PublicListingContext } from "@/lib/navigation/public-context";
import type { Property } from "@/types/domain";

interface PropertyListShellProps {
  properties: Property[];
  filterOptions: {
    statuses: readonly ["todos", "ocupado", "vazio", "em-disputa", "uso-institucional"];
    criticalities: readonly ["todos", "alta", "media", "baixa"];
    neighborhoods: Array<{ id: string; name: string }>;
  };
  initialContext: PublicListingContext;
}

const defaultContext: PublicListingContext = {
  status: "todos",
  criticality: "todos",
  neighborhood: "todos",
};

export function PropertyListShell({ properties, filterOptions, initialContext }: PropertyListShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [context, setContext] = useState<PublicListingContext>(initialContext ?? defaultContext);
  const deferredContext = useDeferredValue(context);

  useEffect(() => {
    setContext(parsePublicListingContext(searchParams));
  }, [searchParams]);

  const filteredProperties = useMemo(
    () =>
      properties.filter((property) => {
        const matchesStatus = deferredContext.status === "todos" || property.status === deferredContext.status;
        const matchesCriticality =
          deferredContext.criticality === "todos" || property.criticality === deferredContext.criticality;
        const matchesNeighborhood =
          deferredContext.neighborhood === "todos" || property.neighborhoodId === deferredContext.neighborhood;

        return matchesStatus && matchesCriticality && matchesNeighborhood;
      }),
    [deferredContext.criticality, deferredContext.neighborhood, deferredContext.status, properties],
  );

  const orderedProperties = useMemo(() => {
    const criticalityWeight = { alta: 0, media: 1, baixa: 2 } as const;

    return [...filteredProperties].sort((left, right) => {
      const criticalityDelta = criticalityWeight[left.criticality] - criticalityWeight[right.criticality];

      if (criticalityDelta !== 0) {
        return criticalityDelta;
      }

      const actionDelta = (right.openActionCount ?? 0) - (left.openActionCount ?? 0);

      if (actionDelta !== 0) {
        return actionDelta;
      }

      const proofDelta = Number(Boolean(right.hasProof || (right.publicDocumentCount ?? 0) > 0 || (right.publicReportCount ?? 0) > 0)) - Number(Boolean(left.hasProof || (left.publicDocumentCount ?? 0) > 0 || (left.publicReportCount ?? 0) > 0));

      if (proofDelta !== 0) {
        return proofDelta;
      }

      return left.title.localeCompare(right.title, "pt-BR");
    });
  }, [filteredProperties]);

  const focusedProperty = properties.find((property) => property.slug === deferredContext.imovel);
  const activeFilterCount = [context.status, context.criticality, context.neighborhood].filter((value) => value !== "todos").length;
  const filteredCriticalCount = orderedProperties.filter((property) => property.criticality === "alta").length;
  const filteredActionCount = orderedProperties.filter((property) => (property.openActionCount ?? 0) > 0 || property.hasOpenAction).length;
  const filteredProofCount = orderedProperties.filter((property) => property.hasProof || (property.publicDocumentCount ?? 0) > 0 || (property.publicReportCount ?? 0) > 0).length;
  const activeFilterBadges = [
    context.status !== "todos" ? `status: ${context.status}` : null,
    context.criticality !== "todos" ? `criticidade: ${context.criticality}` : null,
    context.neighborhood !== "todos"
      ? `bairro: ${filterOptions.neighborhoods.find((neighborhood) => neighborhood.id === context.neighborhood)?.name ?? context.neighborhood}`
      : null,
  ].filter(Boolean) as string[];

  useEffect(() => {
    if (!deferredContext.imovel) {
      return;
    }

    const element = document.getElementById(`property-${deferredContext.imovel}`);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [deferredContext.imovel, filteredProperties.length]);

  function updateContext(next: Partial<PublicListingContext>) {
    const merged = { ...context, ...next };
    setContext(merged);
    router.replace(buildPublicListingHref(pathname, merged), { scroll: false });
  }

  return (
    <div className="space-y-4">
      <PanelCard density="compact" className="px-4 py-3 sm:px-4 sm:py-3" contentClassName="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(320px,430px)] lg:items-center">
        <div className="space-y-2">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-signal">Acervo publicado</p>
            <p className="text-sm uppercase tracking-[0.16em] text-paper/68">
              {orderedProperties.length} de {properties.length} imoveis no recorte atual
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilterCount > 0 ? <Badge kind="territory" value="recorte-ativo">{`${activeFilterCount} filtros ativos`}</Badge> : <Badge kind="territory" value="sem-recorte">sem recorte</Badge>}
            {activeFilterBadges.map((badge) => (
              <Badge key={badge} tone="neutral">{badge}</Badge>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="border border-concrete/14 bg-ink-alt/30 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-paper/42">criticos</p>
            <p className="mt-1 font-display text-xl uppercase text-paper">{filteredCriticalCount}</p>
          </div>
          <div className="border border-concrete/14 bg-ink-alt/30 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-paper/42">com acao</p>
            <p className="mt-1 font-display text-xl uppercase text-paper">{filteredActionCount}</p>
          </div>
          <div className="border border-concrete/14 bg-ink-alt/30 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-paper/42">com prova</p>
            <p className="mt-1 font-display text-xl uppercase text-paper">{filteredProofCount}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:col-span-2">
          <ButtonLink href={buildPublicListingHref("/mapa", context, { from: "imoveis" })} variant="secondary" className="text-xs">
            Ver no mapa
          </ButtonLink>
          <Link href="/agir" className="tt-button tt-button-ghost text-xs hover:border-signal/35 hover:text-signal">
            Ver acoes
          </Link>
        </div>
      </PanelCard>

      {focusedProperty ? (
        <PanelCard density="compact" className="px-4 py-3 sm:px-4 sm:py-3" contentClassName="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-signal">Imovel em foco</p>
            <p className="text-sm uppercase tracking-[0.16em] text-paper">{focusedProperty.title}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={buildPublicListingHref("/imoveis", context, { imovel: focusedProperty.slug, from: "imoveis" })} variant="secondary">
              Abrir ficha
            </ButtonLink>
            <ButtonLink href={buildPublicListingHref("/mapa", context, { imovel: focusedProperty.slug, from: "imoveis" })} variant="ghost">
              Ver ponto
            </ButtonLink>
          </div>
        </PanelCard>
      ) : null}

      <PanelCard
        eyebrow="Filtros da lista"
        title="Recorte territorial"
        description="Status, criticidade e bairro continuam como recortes leves para navegar o acervo sem criar filtro pesado novo."
        density="compact"
        actions={
          <button
            type="button"
            onClick={() => updateContext(defaultContext)}
            className="tt-button tt-button-secondary text-xs hover:border-signal/35 hover:text-signal"
          >
            Limpar recorte
          </button>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          <FilterGroup label="Status" meta="uso" description="Leitura do uso atual do imovel.">
            <select
              value={context.status}
              onChange={(event) => updateContext({ status: event.target.value as PublicListingContext["status"] })}
              className="tt-input px-4 py-3 text-sm uppercase tracking-[0.08em]"
            >
              {filterOptions.statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup label="Criticidade" meta="risco" description="Prioriza pressao territorial e vulnerabilidade.">
            <select
              value={context.criticality}
              onChange={(event) => updateContext({ criticality: event.target.value as PublicListingContext["criticality"] })}
              className="tt-input px-4 py-3 text-sm uppercase tracking-[0.08em]"
            >
              {filterOptions.criticalities.map((criticality) => (
                <option key={criticality} value={criticality}>
                  {criticality}
                </option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup label="Bairro" meta="territorio" description="Fecha o recorte por area de disputa.">
            <select
              value={context.neighborhood}
              onChange={(event) => updateContext({ neighborhood: event.target.value })}
              className="tt-input px-4 py-3 text-sm uppercase tracking-[0.08em]"
            >
              <option value="todos">todos</option>
              {filterOptions.neighborhoods.map((neighborhood) => (
                <option key={neighborhood.id} value={neighborhood.id}>
                  {neighborhood.name}
                </option>
              ))}
            </select>
          </FilterGroup>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-paper/56">
          <span className="border border-concrete/14 bg-concrete/9 px-3 py-2">ordem por criticidade, acao aberta e prova</span>
          <span className="border border-concrete/14 bg-concrete/9 px-3 py-2">sem busca textual nova nesta rodada</span>
        </div>
      </PanelCard>

      {orderedProperties.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orderedProperties.map((property) => (
            <div key={property.id} id={`property-${property.slug}`} className="scroll-mt-28">
              <PropertyCard
                property={property}
                compact
                highlighted={property.slug === deferredContext.imovel}
                detailHref={buildPublicListingHref(`/imoveis/${property.slug}`, context, {
                  imovel: property.slug,
                  from: "imoveis",
                })}
                mapHref={buildPublicListingHref("/mapa", context, { imovel: property.slug, from: "imoveis" })}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          eyebrow="recorte sem resultado"
          title="Nenhum imovel cruza este recorte"
          description="Nao apareceu nenhuma ficha com essa combinacao de status, criticidade e bairro. Limpe o recorte ou volte ao mapa para reler a distribuicao territorial completa."
          actionLabel="Voltar ao mapa"
          actionHref={buildPublicListingHref("/mapa", context, { from: "imoveis" })}
        />
      )}
    </div>
  );
}
