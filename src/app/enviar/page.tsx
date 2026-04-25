import { ContributionIntakeForm } from "@/components/contributions/contribution-intake-form";
import { MetricCard } from "@/components/ui/metric-card";
import { PanelCard } from "@/components/ui/panel-card";
import { SectionHeader } from "@/components/ui/section-header";
import { ButtonLink } from "@/components/ui/button-link";
import { getPublishedPropertyOptions } from "@/lib/data/public-queries";

export const dynamic = "force-dynamic";

interface SubmitPageProps {
  searchParams?: Promise<{
    imovel?: string;
    sent?: string;
    error?: string;
  }>;
}

export default async function SubmitPage({ searchParams }: SubmitPageProps) {
  const properties = await getPublishedPropertyOptions();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const focusedProperty = resolvedSearchParams?.imovel
    ? properties.find((property) => property.slug === resolvedSearchParams.imovel)
    : undefined;

  const sent = resolvedSearchParams?.sent === "1";
  const notice = resolvedSearchParams?.error;

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-4 sm:px-5 lg:px-8 lg:py-5">
      <PanelCard
        tone="strong"
        density="compact"
        className="border-steel/28 bg-[linear-gradient(135deg,rgba(88,107,118,0.18),rgba(20,25,29,0.95))] px-4 py-3 sm:px-4 sm:py-3"
        contentClassName="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(260px,320px)_auto] xl:items-center"
      >
        <SectionHeader
          eyebrow="contribuicao moderada"
          title="Enviar contribuicao"
          description="Relato, atualizacao, foto ou documento entram em fila de moderacao antes de virar acervo publico."
          variant="compact"
        />
        <div className="grid grid-cols-2 gap-2 sm:min-w-[260px]">
          <MetricCard label="imoveis vinculaveis" value={properties.length} compact tone="steel" />
          <MetricCard label="publicacao" value="moderada" compact tone="blue" />
        </div>
        <div className="flex flex-wrap gap-2 xl:justify-end">
          <ButtonLink href="/imoveis" variant="secondary" className="w-full text-xs sm:w-auto">
            Ver acervo
          </ButtonLink>
          <ButtonLink href="/agir" className="w-full text-xs sm:w-auto">
            Ver acoes
          </ButtonLink>
        </div>
      </PanelCard>
      <ContributionIntakeForm properties={properties} defaultPropertyId={focusedProperty?.id} notice={notice} sent={sent} />
    </div>
  );
}
