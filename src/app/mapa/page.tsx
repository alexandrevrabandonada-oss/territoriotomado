import type { Metadata } from "next";
import { MapPageShell } from "@/components/map/map-page-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { MetricCard } from "@/components/ui/metric-card";
import { PanelCard } from "@/components/ui/panel-card";
import { SectionHeader } from "@/components/ui/section-header";
import { getPublishedMapFilterOptions, getPublishedMapProperties } from "@/lib/data/public-queries";
import { parsePublicListingContext } from "@/lib/navigation/public-context";

interface MapPageProps {
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
    title: "Mapa | Territorio Tomado",
    description: "Cartografia ativa do acervo publicado, com recorte por status, criticidade e bairro.",
    alternates: {
      canonical: "/mapa",
    },
    openGraph: {
      title: "Mapa | Territorio Tomado",
      description: "Cartografia ativa do acervo publicado, com recorte por status, criticidade e bairro.",
      type: "website",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Mapa | Territorio Tomado",
      description: "Cartografia ativa do acervo publicado, com recorte por status, criticidade e bairro.",
      images: ["/opengraph-image"],
    },
  };
}

export default async function MapPage({ searchParams }: MapPageProps) {
  const [properties, filterOptions] = await Promise.all([getPublishedMapProperties(), getPublishedMapFilterOptions()]);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialContext = parsePublicListingContext(resolvedSearchParams);
  const criticalCount = properties.filter((property) => property.criticality === "alta").length;
  const neighborhoodCount = new Set(properties.map((property) => property.neighborhoodId)).size;
  const disputedCount = properties.filter((property) => property.status === "em-disputa").length;

  return (
    <div className="mx-auto max-w-[1600px] space-y-2.5 px-3 py-3 sm:px-4 lg:px-5 lg:py-4">
      <PanelCard
        className="border-steel/30 bg-[linear-gradient(135deg,rgba(101,126,140,0.16),rgba(26,31,35,0.94))] px-3 py-3 sm:px-4 sm:py-3"
        contentClassName="flex flex-col gap-3 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(300px,420px)_auto] xl:items-center"
      >
        <SectionHeader
          eyebrow="ferramenta territorial"
          title="Mapa operacional"
          description="Leitura rapida do territorio publicado, com recorte e foco direto no mapa."
          variant="compact"
          descriptionClassName="max-w-xl text-paper/72"
        />
        <div className="grid grid-cols-3 gap-2 sm:min-w-[320px]">
          <MetricCard label="visiveis" value={properties.length} compact tone="blue" />
          <MetricCard label="criticos" value={criticalCount} compact tone={criticalCount > 0 ? "alert" : "default"} />
          <MetricCard label="bairros" value={neighborhoodCount} compact tone={disputedCount > 0 ? "steel" : "default"} />
        </div>
        <div className="flex xl:justify-end">
          <ButtonLink href={initialContext.imovel ? `/imoveis/${initialContext.imovel}` : "/imoveis"} className="min-h-11 w-full justify-center xl:w-auto">
            {initialContext.imovel ? "Abrir ficha em foco" : "Abrir acervo"}
          </ButtonLink>
        </div>
      </PanelCard>
      <MapPageShell initialProperties={properties} filterOptions={filterOptions} initialContext={initialContext} />
    </div>
  );
}
