import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { PanelCard } from "@/components/ui/panel-card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { getPublishedNeighborhoodSummaries } from "@/lib/data/public-queries";
import { buildPublicListingHref } from "@/lib/navigation/public-context";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Bairros | Territorio Tomado",
    description: "Leitura territorial por bairro com imóveis publicados, criticidade e frentes abertas.",
    alternates: {
      canonical: "/bairros",
    },
    openGraph: {
      title: "Bairros | Territorio Tomado",
      description: "Leitura territorial por bairro com imóveis publicados, criticidade e frentes abertas.",
      type: "website",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Bairros | Territorio Tomado",
      description: "Leitura territorial por bairro com imóveis publicados, criticidade e frentes abertas.",
      images: ["/opengraph-image"],
    },
  };
}

export default async function BairrosPage() {
  const neighborhoods = await getPublishedNeighborhoodSummaries();
  const totalProperties = neighborhoods.reduce((sum, item) => sum + item.propertyCount, 0);
  const totalReadyForMap = neighborhoods.reduce((sum, item) => sum + item.readyForMapCount, 0);
  const totalCritical = neighborhoods.reduce((sum, item) => sum + item.criticalPropertyCount, 0);
  const totalActions = neighborhoods.reduce((sum, item) => sum + item.openActionCount, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-5 lg:px-8 lg:py-5">
      <PanelCard
        tone="strong"
        density="compact"
        className="border-steel/28 bg-[linear-gradient(135deg,rgba(88,107,118,0.18),rgba(20,25,29,0.95))] px-4 py-3 sm:px-4 sm:py-3"
        contentClassName="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)_auto] xl:items-center"
      >
        <SectionHeader
          eyebrow="unidade territorial"
          title="Bairros como eixo de leitura"
          description="Entre pelo bairro para entender concentracao, confianca territorial, prioridade de revisao e caminhos de acao antes da ficha fiscal."
          variant="compact"
        />
        <div className="grid grid-cols-2 gap-2 sm:min-w-[390px] sm:grid-cols-4">
          <MetricCard label="imoveis" value={totalProperties} compact tone="steel" />
          <MetricCard label="no mapa" value={totalReadyForMap} compact tone="blue" />
          <MetricCard label="criticos" value={totalCritical} compact tone={totalCritical > 0 ? "alert" : "default"} />
          <MetricCard label="acoes" value={totalActions} compact tone={totalActions > 0 ? "yellow" : "default"} />
        </div>
        <div className="flex flex-wrap gap-2 xl:justify-end">
          <ButtonLink href="/mapa" className="w-full text-xs sm:w-auto">
            Abrir mapa
          </ButtonLink>
          <ButtonLink href="/imoveis" variant="secondary" className="w-full text-xs sm:w-auto">
            Ver acervo
          </ButtonLink>
        </div>
      </PanelCard>

      {neighborhoods.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {neighborhoods.map((neighborhood) => (
            <PanelCard key={neighborhood.id} variant="card" className="flex h-full flex-col justify-between p-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge kind="territory" value="bairro">bairro</Badge>
                    <Badge kind="territory" value={neighborhood.priorityPropertyCount > 0 ? "pressao-alta" : "leitura-ativa"}>
                      {neighborhood.priorityPropertyCount > 0 ? "pressao alta" : "leitura ativa"}
                    </Badge>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-paper/45">unidade politica</div>
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-paper">{neighborhood.name}</h2>
                  <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-paper/58">
                    <span className="tt-chip px-3 py-2">{neighborhood.readyForMapCount} prontos para mapa</span>
                    <span className="tt-chip px-3 py-2">{neighborhood.priorityPropertyCount} prioritarios</span>
                    <span className="tt-chip px-3 py-2">{neighborhood.openActionCount} acoes ligadas</span>
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
                  <div className="space-y-3">
                    <p className="text-sm leading-6 text-paper/72">{neighborhood.narrative}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
                    <div className="tt-metric px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">imoveis</p>
                      <p className="mt-2 font-display text-xl uppercase text-paper">{neighborhood.propertyCount}</p>
                    </div>
                    <div className="tt-metric px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">criticos</p>
                      <p className="mt-2 font-display text-xl uppercase text-paper">{neighborhood.criticalPropertyCount}</p>
                    </div>
                    <div className="tt-metric px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">no mapa</p>
                      <p className="mt-2 font-display text-xl uppercase text-paper">{neighborhood.readyForMapCount}</p>
                    </div>
                    <div className="tt-metric px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">prioridade</p>
                      <p className="mt-2 font-display text-xl uppercase text-paper">{neighborhood.priorityPropertyCount}</p>
                    </div>
                    <div className="tt-metric px-3 py-2.5 sm:col-span-4 lg:col-span-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-paper/45">acao ligada</p>
                      <p className="mt-2 font-display text-xl uppercase text-paper">{neighborhood.openActionCount > 0 ? `${neighborhood.openActionCount} aberta` : "sem frente"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] uppercase tracking-[0.18em] text-paper/48">
                  {neighborhood.priorityPropertyCount > 0 ? "territorio com pressao ativa" : "territorio em acompanhamento"}
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <ButtonLink href={`/bairros/${neighborhood.slug}`} className="w-full sm:w-auto">
                    Abrir bairro
                  </ButtonLink>
                  <ButtonLink
                    href={buildPublicListingHref("/imoveis", { neighborhood: neighborhood.id, from: "imoveis" })}
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Ver imoveis
                  </ButtonLink>
                  <ButtonLink
                    href={buildPublicListingHref("/mapa", { neighborhood: neighborhood.id, from: "mapa" })}
                    variant="ghost"
                    className="w-full sm:w-auto"
                  >
                    Ver mapa
                  </ButtonLink>
                </div>
              </div>
            </PanelCard>
          ))}
        </div>
      ) : (
        <EmptyState
          eyebrow="sem leitura territorial"
          title="Nenhum bairro publicado"
          description="Assim que os bairros entrarem no acervo, esta rota passa a organizar concentracao territorial, criticidade e frentes abertas."
          actionLabel="Abrir mapa"
          actionHref="/mapa"
        />
      )}
    </div>
  );
}
