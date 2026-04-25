import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { ActionCard } from "@/components/ui/action-card";
import { PanelCard } from "@/components/ui/panel-card";
import { EcosystemLinks } from "@/components/shared/ecosystem-links";
import { getDocumentTypeLabel } from "@/lib/data/document-types";
import type { PropertyBundle } from "@/types/domain";

interface PropertyDetailProps {
  bundle: PropertyBundle;
  returnHref?: string;
  returnLabel?: string;
}

export function PropertyDetail({ bundle, returnHref, returnLabel }: PropertyDetailProps) {
  const { property, neighborhood, images, documents, timeline, reports, actions, proposals } = bundle;
  const coverImage = images.find((image) => image.isCover) ?? images[0];
  const galleryImages = coverImage ? images.filter((image) => image.id !== coverImage.id) : images;
  const featuredAction = actions.find((action) => action.isPriority) ?? actions[0];
  const secondaryActions = featuredAction ? actions.filter((action) => action.id !== featuredAction.id) : actions;
  const approvedReports = reports.filter((report) => report.status === "aprovado");
  const pendingReportCount = reports.filter((report) => report.status === "pendente").length;
  const quickStats = [
    { label: "acao aberta", value: actions.length > 0 ? `${actions.length} frente${actions.length > 1 ? "s" : ""}` : "sem frente aberta" },
    { label: "prova publica", value: documents.length > 0 || approvedReports.length > 0 ? "documentos ou relatos disponiveis" : "sem prova publicada" },
    { label: "imagens", value: images.length > 0 ? `${images.length} registro${images.length > 1 ? "s" : ""}` : "sem galeria" },
    { label: "escala", value: property.areaEstimate },
  ];

  return (
    <div className="space-y-5">
      {returnHref ? (
        <PanelCard density="compact" className="px-4 py-3 sm:px-4 sm:py-3" contentClassName="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-signal">retorno inteligente</p>
            <p className="text-sm uppercase tracking-[0.16em] text-paper/68">{returnLabel ?? "Voltar"}</p>
          </div>
          <ButtonLink href={returnHref} variant="secondary" className="text-xs">
            Voltar
          </ButtonLink>
        </PanelCard>
      ) : null}
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <PanelCard
          tone="strong"
          density="compact"
          className="border-steel/28 bg-[linear-gradient(135deg,rgba(88,107,118,0.16),rgba(20,25,29,0.98))]"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge kind="territory" value="bairro">{neighborhood.name}</Badge>
              <Badge kind="status" value={property.status} />
              <Badge tone={property.criticality === "alta" ? "rust" : property.criticality === "media" ? "yellow" : "blue"}>{`criticidade ${property.criticality}`}</Badge>
            </div>
            <div className="space-y-3">
              <div>
                <h1 className="font-display text-3xl uppercase tracking-[0.08em] text-paper sm:text-4xl lg:text-5xl">{property.title}</h1>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-paper/52">{property.address}</p>
              </div>
              <p className="max-w-3xl text-sm leading-6 text-paper/78 sm:text-base sm:leading-7">{property.excerpt}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {quickStats.map((item) => (
                <div key={item.label} className="border border-concrete/14 bg-ink-alt/30 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-paper/42">{item.label}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-paper">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-concrete/16 pt-3">
              {featuredAction ? (
                <ButtonLink href={featuredAction.href} className="w-full text-xs sm:w-auto">
                  {featuredAction.ctaLabel}
                </ButtonLink>
              ) : null}
              <ButtonLink href="/agir" variant="secondary" className="w-full text-xs sm:w-auto">
                Ver mobilizacao
              </ButtonLink>
            </div>
          </div>
        </PanelCard>

        <PanelCard
          eyebrow="Agir agora"
          title={featuredAction ? "Frente ativa desta ficha" : "Mobilizacao ainda nao publicada"}
          description={
            featuredAction
              ? "A ficha precisa virar acao concreta. Esta e a frente mais visivel para transformar leitura territorial em mobilizacao."
              : "Quando houver uma frente publica ligada a este imovel, ela aparecera aqui com CTA operacional."
          }
          tone={featuredAction?.isPriority ? "alert" : "strong"}
          density="compact"
        >
          {featuredAction ? (
            <ActionCard
              title={featuredAction.title}
              description={featuredAction.description}
              ctaHref={featuredAction.href}
              ctaLabel={featuredAction.ctaLabel}
              actionKind={featuredAction.kind}
              propertyTitle={property.title}
              neighborhoodName={neighborhood.name}
              priority={featuredAction.isPriority}
              meta={featuredAction.isPriority ? "acionamento imediato recomendado" : "frente publica em andamento"}
              badges={<Badge tone={property.criticality === "alta" ? "rust" : property.criticality === "media" ? "yellow" : "blue"}>{`criticidade ${property.criticality}`}</Badge>}
              secondaryAction={
                <ButtonLink href="/agir" variant="secondary" className="w-full text-xs sm:w-auto">
                  Ver todas as acoes
                </ButtonLink>
              }
            >
              <EcosystemLinks
                layout="inline"
                missionUrl={featuredAction.missionUrl ?? property.missionUrl}
                communityUrl={featuredAction.communityUrl ?? property.communityUrl}
                dossierUrl={featuredAction.dossierUrl ?? property.dossierUrl}
                externalReferenceUrl={featuredAction.externalReferenceUrl ?? property.externalReferenceUrl}
                className="mt-0"
              />
            </ActionCard>
          ) : (
            <EmptyState
              eyebrow="sem frente aberta"
              title="Nenhuma acao publicada"
              description="A leitura desta ficha ja esta pronta, mas ainda nao ha CTA publico associado para mobilizacao imediata."
              actionLabel="Abrir /agir"
              actionHref="/agir"
            />
          )}
        </PanelCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <PanelCard eyebrow="Situacao atual" density="compact">
          <div className="space-y-4">
            <p className="text-sm leading-6 text-paper/74">{property.description}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-paper/45">Uso atual</p>
                <p className="mt-2 text-sm leading-6 text-paper">{property.currentUse}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-paper/45">Escala</p>
                <p className="mt-2 text-sm leading-6 text-paper">{property.areaEstimate}</p>
              </div>
            </div>
          </div>
        </PanelCard>

        <PanelCard eyebrow="Contexto historico" density="compact">
          {property.historicalContext ? (
            <p className="text-sm leading-6 text-paper/74">{property.historicalContext}</p>
          ) : (
            <EmptyState
              eyebrow="memoria pendente"
              title="Sem contexto historico publicado"
              description="A memoria desta ficha ainda nao foi expandida no acervo publico."
            />
          )}
        </PanelCard>

        <PanelCard eyebrow="Impacto territorial" density="compact">
          <div className="space-y-4">
            <p className="text-sm leading-6 text-paper/74">{property.socialUsePotential ?? "O impacto territorial ainda nao foi descrito em texto proprio, mas a ficha ja consolida risco, uso atual e prova publica para leitura de disputa."}</p>
            {property.legalNotes.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.18em] text-paper/45">Notas legais</p>
                <ul className="space-y-2 text-sm text-paper/72">
                  {property.legalNotes.map((note) => (
                    <li key={note} className="border-l border-rust pl-3">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </PanelCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <PanelCard eyebrow="Imagens" density="compact">
          {coverImage ? (
            <div className="space-y-3">
              <figure className="tt-card overflow-hidden">
                <div className="relative min-h-[260px] sm:min-h-[320px]">
                  <Image src={coverImage.src} alt={coverImage.alt} fill className="object-cover" sizes="(max-width: 1280px) 100vw, 55vw" />
                </div>
                <figcaption className="space-y-1 border-t border-concrete/16 bg-concrete/8 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-signal">capa</p>
                  <p className="text-sm uppercase tracking-[0.12em] text-paper">{coverImage.caption ?? coverImage.alt}</p>
                  {coverImage.credit ? <p className="text-[11px] uppercase tracking-[0.16em] text-paper/50">{coverImage.credit}</p> : null}
                </figcaption>
              </figure>
              {galleryImages.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {galleryImages.map((image) => (
                    <figure key={image.id} className="tt-card overflow-hidden">
                      <div className="relative min-h-[160px]">
                        <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(max-width: 1280px) 100vw, 24vw" />
                      </div>
                      <figcaption className="space-y-1 border-t border-concrete/16 bg-concrete/8 p-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-paper/50">{image.caption ?? image.alt}</p>
                        {image.credit ? <p className="text-[11px] uppercase tracking-[0.16em] text-paper/40">{image.credit}</p> : null}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <EmptyState
              eyebrow="sem galeria"
              title="Sem imagens publicadas"
              description="Os registros visuais entram aqui quando houver capa ou imagens de apoio aprovadas para a ficha."
            />
          )}
        </PanelCard>

        <PanelCard eyebrow="Documentos" density="compact">
          <div className="space-y-3">
            {documents.length > 0 ? (
              documents.map((document) => (
                <article key={document.id} className="tt-card p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-paper/45">
                    {getDocumentTypeLabel(document.type)} • {document.year || "sem data"}
                  </p>
                  <h3 className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-paper">{document.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-paper/70">{document.summary}</p>
                  {document.href ? (
                    <ButtonLink href={document.href} variant="secondary" className="mt-4 w-full text-xs sm:w-auto">
                      Abrir documento
                    </ButtonLink>
                  ) : null}
                </article>
              ))
            ) : (
              <EmptyState
                eyebrow="sem prova documental"
                title="Sem documentos publicados"
                description="A prova documental entra aqui quando houver anexos ou referencias editoriais aprovadas."
              />
            )}
          </div>
        </PanelCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)]">
        <PanelCard eyebrow="Linha do tempo" density="compact">
          <div className="space-y-5">
            {timeline.length > 0 ? (
              timeline.map((item) => (
                <div key={item.id} className="border-l border-signal pl-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-signal">{item.year}</p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-paper">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-paper/70">{item.description}</p>
                </div>
              ))
            ) : (
              <EmptyState
                eyebrow="memoria rarefeita"
                title="Sem timeline publicada"
                description="Os marcos cronologicos entram aqui assim que forem consolidados no acervo publico."
              />
            )}
          </div>
        </PanelCard>

        <PanelCard eyebrow="Relatos aprovados" density="compact">
          <div className="space-y-4">
            {approvedReports.length > 0 ? (
              approvedReports.map((report) => (
                <article key={report.id} className="tt-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.08em] text-paper">{report.author}</p>
                    <Badge kind="moderation" value={report.status} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-paper/70">{report.excerpt}</p>
                </article>
              ))
            ) : (
              <EmptyState
                eyebrow="sem relatos aprovados"
                title="Nenhum relato aprovado"
                description="Os testemunhos editoriais entram aqui assim que houver aprovacao publica para esta ficha."
              />
            )}
            {pendingReportCount > 0 ? (
              <p className="text-[11px] uppercase tracking-[0.18em] text-paper/52">{pendingReportCount} relato{pendingReportCount > 1 ? "s" : ""} ainda em moderacao</p>
            ) : null}
          </div>
        </PanelCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)]">
        <PanelCard eyebrow="Propostas de uso social" density="compact">
          <div className="space-y-4">
            {proposals.length > 0 ? (
              proposals.map((proposal) => (
                <article key={proposal.id} className="tt-card p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-paper">{proposal.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-paper/70">{proposal.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-signal">{proposal.supporters} apoios mapeados</p>
                </article>
              ))
            ) : (
              <EmptyState
                eyebrow="sem proposta publica"
                title="Nenhuma proposta de uso social"
                description="Quando houver proposta territorial consolidada para este imovel, ela aparecera aqui com apoio mapeado."
              />
            )}
          </div>
        </PanelCard>

        <PanelCard eyebrow="Agir agora" tone={featuredAction?.isPriority ? "alert" : "strong"} density="compact">
          <div className="space-y-4">
            <p className="text-sm leading-6 text-paper/72">
              Esta ficha nao fecha em memoria. Ela precisa orientar acao. Escolha a frente mais aderente ao problema territorial e acione a rede.
            </p>
            {featuredAction ? (
              <ActionCard
                title={featuredAction.title}
                description={featuredAction.description}
                ctaHref={featuredAction.href}
                ctaLabel={featuredAction.ctaLabel}
                actionKind={featuredAction.kind}
                propertyTitle={property.title}
                neighborhoodName={neighborhood.name}
                priority={featuredAction.isPriority}
                meta={featuredAction.isPriority ? "prioridade operacional desta ficha" : "frente publica pronta para ativacao"}
                badges={<Badge kind="status" value={property.status} />}
                secondaryAction={
                  <ButtonLink href="/agir" variant="secondary" className="w-full text-xs sm:w-auto">
                    Ver todas as acoes
                  </ButtonLink>
                }
              />
            ) : null}
            {secondaryActions.length > 0 ? (
              <div className="space-y-3">
                {secondaryActions.map((action) => (
                  <ActionCard
                    key={action.id}
                    title={action.title}
                    description={action.description}
                    ctaHref={action.href}
                    ctaLabel={action.ctaLabel}
                    actionKind={action.kind}
                    propertyTitle={property.title}
                    neighborhoodName={neighborhood.name}
                    priority={action.isPriority}
                    meta="outra frente disponivel nesta ficha"
                    className="p-4"
                  />
                ))}
              </div>
            ) : null}
            <EcosystemLinks
              missionUrl={property.missionUrl}
              communityUrl={property.communityUrl}
              dossierUrl={property.dossierUrl}
              externalReferenceUrl={property.externalReferenceUrl}
              description="Conexoes opcionais para acoplar a ficha a outras frentes sem dissolver o contexto territorial."
            />
          </div>
        </PanelCard>
      </section>
    </div>
  );
}
