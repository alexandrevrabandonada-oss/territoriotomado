import type { Metadata } from "next";
import { cache } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { ActionCard } from "@/components/ui/action-card";
import { EcosystemLinks } from "@/components/shared/ecosystem-links";
import { MetricCard } from "@/components/ui/metric-card";
import { PanelCard } from "@/components/ui/panel-card";
import { SectionHeader } from "@/components/ui/section-header";
import { getPublishedActionFeed } from "@/lib/data/public-queries";
import { getActionSharePhrase } from "@/lib/share-copy";

export const dynamic = "force-dynamic";

interface ActNowPageProps {
  searchParams?: Promise<{
    imovel?: string;
  }>;
}

const getActionFeed = cache(getPublishedActionFeed);

export async function generateMetadata({ searchParams }: ActNowPageProps): Promise<Metadata> {
  const actions = await getActionFeed();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const focusedSlug = resolvedSearchParams?.imovel;
  const focusedActions = focusedSlug ? actions.filter((action) => action.propertySlug === focusedSlug) : actions;
  const feed = focusedActions.length > 0 ? focusedActions : actions;
  const topAction = feed[0];

  if (!topAction) {
    return {
      title: "Agir | Territorio Tomado",
      description: "Frentes de ação territorial ligadas aos imóveis publicados.",
      openGraph: {
        title: "Agir | Territorio Tomado",
        description: "Frentes de ação territorial ligadas aos imóveis publicados.",
        images: ["/agir/opengraph-image"],
      },
      twitter: {
        card: "summary_large_image",
        title: "Agir | Territorio Tomado",
        description: "Frentes de ação territorial ligadas aos imóveis publicados.",
      },
    };
  }

  const description = focusedSlug
    ? `${topAction.propertyTitle}. ${getActionSharePhrase(topAction.kind, topAction.propertyTitle)}`
    : `${feed.length} acoes abertas. ${getActionSharePhrase(topAction.kind, topAction.propertyTitle)}`;

  return {
    title: focusedSlug ? `Agir em ${topAction.propertyTitle} | Territorio Tomado` : `Agir | ${feed.length} acoes abertas`,
    description,
    alternates: {
      canonical: "/agir",
    },
    openGraph: {
      title: focusedSlug ? `Agir em ${topAction.propertyTitle}` : "Agir | Territorio Tomado",
      description,
      type: "website",
      images: ["/agir/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: focusedSlug ? `Agir em ${topAction.propertyTitle}` : "Agir | Territorio Tomado",
      description,
      images: ["/agir/opengraph-image"],
    },
  };
}

export default async function ActNowPage({ searchParams }: ActNowPageProps) {
  const actions = await getActionFeed();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const focusedSlug = resolvedSearchParams?.imovel;
  const focusedActions = focusedSlug ? actions.filter((action) => action.propertySlug === focusedSlug) : [];
  const feed = focusedActions.length > 0 ? focusedActions : actions;
  const shareQuery = focusedSlug ? `?imovel=${encodeURIComponent(focusedSlug)}` : "";
  const priorityCount = feed.filter((action) => action.isPriority).length;
  const propertyCount = new Set(feed.map((action) => action.propertyId)).size;
  const urgentActions = feed.filter((action) => action.isPriority);
  const ongoingActions = feed.filter((action) => !action.isPriority);
  const groupedByProperty = feed.reduce<Map<string, typeof feed>>((acc, action) => {
    const existing = acc.get(action.propertyId) ?? [];
    acc.set(action.propertyId, [...existing, action]);
    return acc;
  }, new Map());

  const groupedEntries = [...groupedByProperty.entries()].sort(([, left], [, right]) => {
    const leftPriority = left.some((action) => action.isPriority);
    const rightPriority = right.some((action) => action.isPriority);

    if (leftPriority !== rightPriority) {
      return leftPriority ? -1 : 1;
    }

    return left[0].position - right[0].position;
  });

  function getActionCardClassName(action: (typeof feed)[number]) {
    if (action.isPriority) {
      return "border-signal/35 bg-[linear-gradient(180deg,rgba(233,173,18,0.12),rgba(242,244,239,0.05))] shadow-tt-signal";
    }

    if (action.criticality === "alta") {
      return "border-rust/34 bg-[linear-gradient(180deg,rgba(143,89,68,0.16),rgba(242,244,239,0.04))]";
    }

    return "border-steel/28 bg-[linear-gradient(180deg,rgba(125,144,155,0.12),rgba(242,244,239,0.04))]";
  }

  function renderActionCard(action: (typeof feed)[number]) {
    return (
      <ActionCard
        key={action.id}
        title={action.title}
        description={action.description}
        ctaHref={action.href}
        ctaLabel={action.ctaLabel}
        actionKind={action.kind}
        propertyTitle={action.propertyTitle}
        neighborhoodName={action.neighborhoodName}
        priority={action.isPriority}
        className={getActionCardClassName(action)}
        meta={action.isPriority ? "acionamento imediato recomendado" : "frente estrutural em andamento"}
        badges={
          <>
            <Badge kind="territory" value={action.isPriority ? "foco-ativo" : "leitura-ativa"}>{action.isPriority ? "urgente" : "estrutural"}</Badge>
            <Badge kind="status" value={action.status} />
            <Badge tone={action.criticality === "alta" ? "rust" : action.criticality === "media" ? "yellow" : "blue"}>
              {`criticidade ${action.criticality}`}
            </Badge>
          </>
        }
        secondaryAction={
          <ButtonLink href={`/imoveis/${action.propertySlug}`} variant="secondary" className="w-full text-xs sm:w-auto">
            Abrir imovel
          </ButtonLink>
        }
      >
        <EcosystemLinks
          layout="inline"
          missionUrl={action.missionUrl}
          communityUrl={action.communityUrl}
          dossierUrl={action.dossierUrl}
          externalReferenceUrl={action.externalReferenceUrl}
          className="mt-0"
        />
      </ActionCard>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-5 lg:px-8 lg:py-5">
      <PanelCard
        tone="strong"
        density="compact"
        className="border-steel/28 bg-[linear-gradient(135deg,rgba(88,107,118,0.18),rgba(20,25,29,0.96))] px-4 py-3 sm:px-4 sm:py-3"
        contentClassName="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)_auto] xl:items-center"
      >
        <SectionHeader
          eyebrow="central de mobilizacao"
          title="Agir"
          description="A mobilizacao nasce do imovel concreto e entra aqui como frente urgente ou estrutural de disputa territorial."
          variant="compact"
        />
        <div className="grid grid-cols-3 gap-2 sm:min-w-[320px]">
          <MetricCard label="acoes abertas" value={feed.length} compact tone="steel" />
          <MetricCard label="urgentes" value={priorityCount} compact tone={priorityCount > 0 ? "alert" : "default"} />
          <MetricCard label="imoveis mobilizados" value={propertyCount} compact tone="blue" />
        </div>
        <div className="flex flex-wrap gap-2 xl:justify-end">
          <ButtonLink href="/mapa" className="w-full text-xs sm:w-auto">
            Abrir mapa
          </ButtonLink>
          <ButtonLink href="/imoveis" variant="secondary" className="w-full text-xs sm:w-auto">
            Ver fichas
          </ButtonLink>
        </div>
      </PanelCard>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <ButtonLink href={`/agir/share/1x1${shareQuery}`} variant="ghost" className="w-full text-xs sm:w-auto">
          Compartilhar 1:1
        </ButtonLink>
        <ButtonLink href={`/agir/share/9x16${shareQuery}`} variant="ghost" className="w-full text-xs sm:w-auto">
          Compartilhar 9:16
        </ButtonLink>
      </div>

      {feed.length > 0 ? (
        <div className="space-y-4">
          <PanelCard
            density="compact"
            tone={urgentActions.length > 0 ? "alert" : "default"}
            eyebrow="acoes urgentes"
            title={urgentActions.length > 0 ? "Acionamento imediato" : "Sem urgencias abertas"}
            description="Frentes prioritarias entram primeiro para orientar resposta rapida e leitura de urgencia."
          >
            {urgentActions.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {urgentActions.map((action) => renderActionCard(action))}
              </div>
            ) : (
              <EmptyState
                eyebrow="urgencia sob controle"
                title="Sem acoes urgentes"
                description="As frentes abertas atuais estao operando em ritmo estrutural, sem prioridade marcada neste momento."
              />
            )}
          </PanelCard>

          <PanelCard
            density="compact"
            eyebrow="acoes em andamento"
            title="Base de mobilizacao"
            description="Frentes estruturais continuam ancoradas em imoveis concretos e acumulam organizacao territorial."
          >
            {ongoingActions.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {ongoingActions.map((action) => renderActionCard(action))}
              </div>
            ) : (
              <EmptyState
                eyebrow="sem base estrutural"
                title="Sem acoes em andamento"
                description="Quando houver frente estrutural ligada a um imovel, ela aparece aqui abaixo da urgencia."
              />
            )}
          </PanelCard>

          <PanelCard
            density="compact"
            eyebrow="acoes por imovel"
            title="Mobilizacao organizada por ficha"
            description="Cada frente continua nascendo do imovel. Aqui a leitura volta para o agrupamento territorial por ficha."
          >
            <div className="grid gap-4">
              {groupedEntries.map(([propertyId, items]) => {
                const property = items[0];

                return (
                  <div key={propertyId} className="border border-concrete/16 bg-ink-alt/22 p-3 sm:p-4">
                    <div className="flex flex-col gap-3 border-b border-concrete/16 pb-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge kind="territory" value={property.propertyIsPriority ? "pressao-alta" : "leitura-ativa"}>
                            {property.propertyIsPriority ? "imovel prioritario" : "base ativa"}
                          </Badge>
                          <Badge kind="status" value={property.status} />
                          <Badge tone={property.criticality === "alta" ? "rust" : property.criticality === "media" ? "yellow" : "blue"}>
                            {`criticidade ${property.criticality}`}
                          </Badge>
                        </div>
                        <div>
                          <h2 className="font-display text-xl uppercase tracking-[0.08em] text-paper">{property.propertyTitle}</h2>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-paper/55">{property.neighborhoodName}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-paper/60">
                          <span className="border border-concrete/14 bg-concrete/8 px-3 py-2">{property.propertyOpenActionCount} frentes</span>
                          <span className="border border-concrete/14 bg-concrete/8 px-3 py-2">
                            {property.propertyHasProof
                              ? property.propertyPublicDocumentCount > 0
                                ? `${property.propertyPublicDocumentCount} documento${property.propertyPublicDocumentCount > 1 ? "s" : ""}`
                                : "relato ou prova aprovada"
                              : "sem prova publica"}
                          </span>
                          <span className="border border-concrete/14 bg-concrete/8 px-3 py-2">{property.propertyHasMedia ? "com galeria" : "sem galeria"}</span>
                        </div>
                      </div>
                      <ButtonLink href={`/imoveis/${property.propertySlug}`} variant="secondary" className="w-full text-xs sm:w-auto">
                        Ver ficha
                      </ButtonLink>
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {items.map((action) => renderActionCard(action))}
                    </div>
                  </div>
                );
              })}
            </div>
          </PanelCard>
        </div>
      ) : (
        <EmptyState
          title="Nenhuma acao aberta no momento"
          description="Quando uma ficha publica gerar campanha, plenaria, mutirao ou requerimento, ela aparece aqui como frente concreta de mobilizacao."
        />
      )}
    </div>
  );
}
