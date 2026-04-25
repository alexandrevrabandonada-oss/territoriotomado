import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { PanelCard } from "@/components/ui/panel-card";
import { SectionHeader } from "@/components/ui/section-header";
import { ButtonLink } from "@/components/ui/button-link";
import { PropertyListShell } from "@/components/properties/property-list-shell";
import { getPublishedMapFilterOptions, getPublishedProperties } from "@/lib/data/public-queries";
import { parsePublicListingContext } from "@/lib/navigation/public-context";

interface PropertiesPageProps {
  searchParams?: Promise<{
    status?: string;
    criticidade?: string;
    bairro?: string;
    imovel?: string;
    from?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Imoveis | Territorio Tomado",
    description: "Acervo publicado com filtros, mapa sincronizado e contexto compartilhavel.",
    alternates: {
      canonical: "/imoveis",
    },
    openGraph: {
      title: "Imoveis | Territorio Tomado",
      description: "Acervo publicado com filtros, mapa sincronizado e contexto compartilhavel.",
      type: "website",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Imoveis | Territorio Tomado",
      description: "Acervo publicado com filtros, mapa sincronizado e contexto compartilhavel.",
      images: ["/opengraph-image"],
    },
  };
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const [propertyList, filterOptions] = await Promise.all([getPublishedProperties(), getPublishedMapFilterOptions()]);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialContext = parsePublicListingContext(resolvedSearchParams);
  const criticalCount = propertyList.filter((property) => property.criticality === "alta").length;
  const activeActionCount = propertyList.filter((property) => (property.openActionCount ?? 0) > 0 || property.hasOpenAction).length;
  const proofCount = propertyList.filter((property) => property.hasProof || (property.publicDocumentCount ?? 0) > 0 || (property.publicReportCount ?? 0) > 0).length;

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-5 lg:px-8 lg:py-5">
      <PanelCard
        tone="strong"
        density="compact"
        className="border-steel/28 bg-[linear-gradient(135deg,rgba(88,107,118,0.18),rgba(20,25,29,0.96))] px-4 py-3 sm:px-4 sm:py-3"
        contentClassName="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(320px,520px)_auto] xl:items-center"
      >
        <SectionHeader
          eyebrow="acervo territorial"
          title="Imoveis"
          description="Leitura compacta do territorio publicado, com criticidade, prova e frentes abertas visiveis sem virar vitrine editorial."
          variant="compact"
        />
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <MetricCard label="imoveis" value={propertyList.length} compact tone="steel" />
          <MetricCard label="criticos" value={criticalCount} compact tone={criticalCount > 0 ? "alert" : "default"} />
          <MetricCard label="com acao" value={activeActionCount} compact tone="yellow" />
          <MetricCard label="com prova" value={proofCount} compact tone="blue" />
        </div>
        <div className="flex flex-wrap gap-2 xl:justify-end">
          <ButtonLink href="/mapa" className="w-full text-xs sm:w-auto">
            Abrir mapa
          </ButtonLink>
          <ButtonLink href="/agir" variant="secondary" className="w-full text-xs sm:w-auto">
            Ver acoes
          </ButtonLink>
        </div>
      </PanelCard>

      {propertyList.length > 0 ? (
        <PropertyListShell properties={propertyList} filterOptions={filterOptions} initialContext={initialContext} />
      ) : (
        <EmptyState
          eyebrow="acervo vazio"
          title="Nenhum imovel publicado"
          description="Ainda nao ha fichas publicadas para leitura territorial. Quando entrarem no acervo, esta rota passa a expor status, criticidade, prova e mobilizacao associada."
          actionLabel="Abrir mapa"
          actionHref="/mapa"
        />
      )}
    </div>
  );
}
