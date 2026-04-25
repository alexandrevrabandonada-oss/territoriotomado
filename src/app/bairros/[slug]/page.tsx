import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { ActionCard } from "@/components/ui/action-card";
import { MetricCard } from "@/components/ui/metric-card";
import { PanelCard } from "@/components/ui/panel-card";
import { SectionHeader } from "@/components/ui/section-header";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyMap } from "@/components/map/property-map";
import { getActionKindLabel } from "@/lib/data/action-kinds";
import { getPublishedNeighborhoodDetail } from "@/lib/data/public-queries";
import { buildPublicListingHref, parsePublicListingContext, type PublicListingContext } from "@/lib/navigation/public-context";
import type { PropertyMapFeature } from "@/lib/data/public-queries";

interface NeighborhoodDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    status?: string;
    criticidade?: string;
    bairro?: string;
    imovel?: string;
    from?: string;
  }>;
}

const getNeighborhoodDetail = cache(getPublishedNeighborhoodDetail);

export async function generateMetadata({ params }: NeighborhoodDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getNeighborhoodDetail(slug);

  if (!detail) {
    notFound();
  }

  return {
    title: `${detail.name} | Territorio Tomado`,
    description: detail.narrative,
    alternates: {
      canonical: `/bairros/${slug}`,
    },
    openGraph: {
      title: `${detail.name} | Territorio Tomado`,
      description: detail.narrative,
      type: "website",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${detail.name} | Territorio Tomado`,
      description: detail.narrative,
      images: ["/opengraph-image"],
    },
  };
}

export default async function NeighborhoodDetailPage({ params, searchParams }: NeighborhoodDetailPageProps) {
  const { slug } = await params;
  const detail = await getNeighborhoodDetail(slug);

  if (!detail) {
    notFound();
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const searchContext = parsePublicListingContext(resolvedSearchParams);
  const navigationContext: PublicListingContext = {
    ...searchContext,
    neighborhood: detail.id,
    from: "imoveis",
  };
  const focusSlug = searchContext.imovel && detail.properties.some((property) => property.slug === searchContext.imovel) ? searchContext.imovel : undefined;
  const criticalProperties = detail.properties.filter((property) => property.criticality === "alta");
  const territorialSummary = detail.description || detail.narrative;
  const mapProperties: PropertyMapFeature[] = detail.properties.map((property) => ({
    id: property.id,
    slug: property.slug,
    title: property.title,
    neighborhoodId: property.neighborhoodId,
    neighborhoodName: property.neighborhoodName ?? detail.name,
    status: property.status,
    criticality: property.criticality,
    lat: property.lat,
    lng: property.lng,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-5 lg:px-8 lg:py-5">
      <PanelCard
        tone="strong"
        density="compact"
        className="border-steel/28 bg-[linear-gradient(135deg,rgba(88,107,118,0.18),rgba(20,25,29,0.95))] px-4 py-3 sm:px-4 sm:py-3"
        contentClassName="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)_auto] xl:items-center"
      >
        <SectionHeader
          eyebrow="territorio em disputa"
          title={detail.name}
          description={territorialSummary}
          variant="compact"
          descriptionClassName="max-w-2xl text-paper/76"
        />
        <div className="grid grid-cols-3 gap-2 sm:min-w-[340px] xl:grid-cols-3">
          <MetricCard label="imoveis" value={detail.propertyCount} compact tone="steel" />
          <MetricCard label="criticos" value={detail.criticalPropertyCount} compact tone={detail.criticalPropertyCount > 0 ? "alert" : "default"} />
          <MetricCard label="acoes abertas" value={detail.openActionCount} compact tone={detail.openActionCount > 0 ? "yellow" : "default"} />
        </div>
        <div className="flex flex-wrap gap-2 xl:justify-end">
          <ButtonLink href={buildPublicListingHref("/mapa", { neighborhood: detail.id, from: "mapa" })} className="w-full text-xs sm:w-auto">
            Abrir mapa
          </ButtonLink>
          <ButtonLink href={buildPublicListingHref("/imoveis", { neighborhood: detail.id, from: "imoveis" })} variant="secondary" className="w-full text-xs sm:w-auto">
            Ver imoveis
          </ButtonLink>
        </div>
      </PanelCard>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_0.9fr]">
        <div className="grid gap-4">
          <PanelCard
            density="compact"
            eyebrow="visao geral"
            title="Leitura territorial"
            description="O bairro aparece aqui como unidade de pressao: acervo publicado, frentes abertas e pontos criticos da disputa territorial."
          >
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <div className="border border-concrete/14 bg-ink-alt/42 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-paper/46">situacao</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge kind="territory" value={detail.criticalPropertyCount > 0 ? "pressao-alta" : "leitura-ativa"}>
                    {detail.criticalPropertyCount > 0 ? "pressao ativa" : "leitura ativa"}
                  </Badge>
                  {detail.openActionCount > 0 ? <Badge kind="territory" value="foco-ativo">mobilizacao aberta</Badge> : null}
                </div>
              </div>
              <div className="border border-concrete/14 bg-ink-alt/42 p-4 sm:col-span-1 lg:col-span-2">
                <p className="text-[10px] uppercase tracking-[0.18em] text-paper/46">resumo territorial</p>
                <p className="mt-2 text-sm leading-6 text-paper/76">{detail.narrative}</p>
              </div>
            </div>
          </PanelCard>

          <PanelCard
            density="compact"
            eyebrow="mapa e acervo"
            title="Mapa e lista de imoveis"
            description="Recorte concentrado no bairro para navegar entre mapa, ficha e pontos de maior friccao territorial."
            actions={
              <ButtonLink href={buildPublicListingHref("/mapa", { neighborhood: detail.id, from: "mapa" })} variant="secondary" className="w-full text-xs sm:w-auto">
                Ler no mapa completo
              </ButtonLink>
            }
          >
            <div className="grid gap-4">
              <PropertyMap properties={mapProperties} focusSlug={focusSlug} navigationContext={navigationContext} className="h-[360px] sm:h-[420px] lg:h-[460px] lg:min-h-0" />
              {detail.properties.length > 0 ? (
                <div className="grid gap-3">
                  {detail.properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      compact
                      highlighted={property.slug === focusSlug}
                      detailHref={buildPublicListingHref(`/imoveis/${property.slug}`, navigationContext, {
                        imovel: property.slug,
                        from: "imoveis",
                      })}
                      mapHref={buildPublicListingHref("/mapa", navigationContext, {
                        imovel: property.slug,
                        from: "mapa",
                      })}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  eyebrow="sem acervo publicado"
                  title="Sem imoveis publicados"
                  description="Este bairro ainda nao tem registros publicados no acervo territorial."
                />
              )}
            </div>
          </PanelCard>
        </div>

        <div className="grid gap-4">
          <PanelCard
            density="compact"
            eyebrow="acoes abertas"
            title="Frentes em curso"
            description="Acoes conectadas a imoveis concretos e lidas como mobilizacao territorial, nao como agenda abstrata."
          >
            <div className="grid gap-3">
              {detail.actions.length > 0 ? (
                detail.actions.map((action) => (
                  <ActionCard
                    key={action.id}
                    title={action.title}
                    description={action.description}
                    ctaHref={action.href}
                    ctaLabel={action.ctaLabel}
                    actionKind={action.kind}
                    propertyTitle={action.propertyTitle}
                    priority={action.isPriority}
                    meta={getActionKindLabel(action.kind)}
                    className="p-3 sm:p-4"
                    badges={
                      <>
                        <Badge kind="territory" value={action.isPriority ? "pressao-alta" : "leitura-ativa"}>{action.isPriority ? "prioridade" : "acao ativa"}</Badge>
                        <Badge kind="status" value={action.status} />
                        <Badge kind="criticality" value={action.criticality} />
                      </>
                    }
                    secondaryAction={
                      <ButtonLink
                        href={buildPublicListingHref(`/imoveis/${action.propertySlug}`, navigationContext, {
                          imovel: action.propertySlug,
                          from: "imoveis",
                        })}
                        variant="secondary"
                        className="w-full text-xs sm:w-auto"
                      >
                        Ver ficha
                      </ButtonLink>
                    }
                  />
                ))
              ) : (
                <EmptyState
                  eyebrow="sem mobilizacao aberta"
                  title="Sem acoes abertas"
                  description="Quando o bairro ganhar frente ativa, ela aparece aqui ligada a um imovel concreto."
                />
              )}
            </div>
          </PanelCard>

          <PanelCard
            density="compact"
            eyebrow="imoveis criticos"
            title="Nucleo de pressao"
            description="Recorte rapido dos imoveis de maior criticidade para leitura e encaminhamento politico imediato."
          >
            <div className="grid gap-3">
              {criticalProperties.length > 0 ? (
                criticalProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    compact
                    highlighted={property.slug === focusSlug}
                    detailHref={buildPublicListingHref(`/imoveis/${property.slug}`, navigationContext, {
                      imovel: property.slug,
                      from: "imoveis",
                    })}
                    mapHref={buildPublicListingHref("/mapa", navigationContext, {
                      imovel: property.slug,
                      from: "mapa",
                    })}
                  />
                ))
              ) : (
                <EmptyState
                  eyebrow="sem criticidade alta"
                  title="Sem imoveis criticos"
                  description="O bairro nao tem, neste momento, imoveis publicados marcados com criticidade alta."
                />
              )}
            </div>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}
