import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { MetricCard } from "@/components/ui/metric-card";
import { PanelCard } from "@/components/ui/panel-card";
import { PropertyDetail } from "@/components/properties/property-detail";
import { getPublishedPropertyBundle } from "@/lib/data/public-queries";
import { getPropertySharePhrase } from "@/lib/share-copy";
import { getPublicReturnHref, getPublicReturnLabel, parsePublicListingContext } from "@/lib/navigation/public-context";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    status?: string;
    criticidade?: string;
    bairro?: string;
    imovel?: string;
    from?: string;
  }>;
}

const getPropertyBundle = cache(getPublishedPropertyBundle);

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getPropertyBundle(slug);

  if (!bundle) {
    notFound();
  }

  const { property, neighborhood } = bundle;
  const phrase = getPropertySharePhrase(property.status, property.criticality);

  return {
    title: `${property.title} | ${neighborhood.name}`,
    description: `${property.address}. ${phrase}`,
    alternates: {
      canonical: `/imoveis/${slug}`,
    },
    openGraph: {
      title: property.title,
      description: `${property.address}. ${phrase}`,
      type: "article",
      images: [
        {
          url: `/imoveis/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: `${property.address}. ${phrase}`,
      images: [`/imoveis/${slug}/opengraph-image`],
    },
  };
}

export default async function PropertyDetailPage({ params, searchParams }: PropertyDetailPageProps) {
  const { slug } = await params;
  const bundle = await getPropertyBundle(slug);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const returnContext = parsePublicListingContext(resolvedSearchParams);

  if (!bundle) {
    notFound();
  }

  const { documents, images, actions } = bundle;
  const approvedReports = bundle.reports.filter((report) => report.status === "aprovado").length;

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-5 lg:px-8 lg:py-5">
      <PanelCard
        density="compact"
        tone="strong"
        className="px-4 py-3 sm:px-4 sm:py-3"
        contentClassName="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(320px,460px)_auto] xl:items-center"
      >
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.22em] text-signal">ficha publicada</p>
          <p className="text-sm uppercase tracking-[0.16em] text-paper/68">Memoria, prova, leitura territorial e acao organizadas na mesma ficha.</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <MetricCard label="documentos" value={documents.length} compact tone="blue" />
          <MetricCard label="imagens" value={images.length} compact tone="steel" />
          <MetricCard label="relatos" value={approvedReports} compact tone="yellow" />
          <MetricCard label="acoes" value={actions.length} compact tone={actions.some((action) => action.isPriority) ? "alert" : "default"} />
        </div>
        <div className="flex flex-wrap gap-2 xl:justify-end">
          <ButtonLink href={`/imoveis/${slug}/share/1x1`} variant="secondary" className="w-full text-xs sm:w-auto">
            Compartilhar 1:1
          </ButtonLink>
          <ButtonLink href={`/imoveis/${slug}/share/9x16`} variant="ghost" className="w-full text-xs sm:w-auto">
            Compartilhar 9:16
          </ButtonLink>
        </div>
      </PanelCard>
      <PropertyDetail bundle={bundle} returnHref={getPublicReturnHref(returnContext)} returnLabel={getPublicReturnLabel(returnContext)} />
    </div>
  );
}
