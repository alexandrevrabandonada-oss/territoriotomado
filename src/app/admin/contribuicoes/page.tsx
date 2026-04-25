import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { PanelCard } from "@/components/ui/panel-card";
import { SectionHeader } from "@/components/ui/section-header";
import { moderateContributionAction } from "@/lib/data/admin-actions";
import { getContributionEditorialDestinationLabel, getDefaultEditorialDestination } from "@/lib/data/contribution-editorial";
import { getContributionTypeLabel } from "@/lib/data/contribution-options";
import { getAdminContributionPropertyOptions, getPendingContributions, getRecentModeratedContributions } from "@/lib/data/admin-queries";

export const dynamic = "force-dynamic";

interface AdminContributionsPageProps {
  searchParams?: Promise<{
    saved?: string;
    error?: string;
    destino?: string;
  }>;
}

export default async function AdminContributionsPage({ searchParams }: AdminContributionsPageProps) {
  const [items, properties, recentModeratedItems] = await Promise.all([
    getPendingContributions(),
    getAdminContributionPropertyOptions(),
    getRecentModeratedContributions(),
  ]);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const saved = resolvedSearchParams?.saved === "1";
  const error = resolvedSearchParams?.error;
  const destino = resolvedSearchParams?.destino;
  const linkedCount = items.filter((item) => item.propertyId).length;
  const unresolvedCount = items.length - linkedCount;

  return (
    <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-6">
      <PanelCard
        tone="strong"
        density="compact"
        className="border-steel/28 bg-[linear-gradient(135deg,rgba(88,107,118,0.16),rgba(20,25,29,0.95))] px-4 py-3"
        contentClassName="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
      >
        <SectionHeader
          eyebrow="moderacao interna"
          title="Contribuicoes"
          description="Triagem manual de relatos, anexos e destino editorial com leitura mais seca e util."
          variant="compact"
        />
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <ButtonLink href="/admin" variant="secondary" className="w-full text-xs sm:w-auto">
            Voltar ao admin
          </ButtonLink>
          <ButtonLink href="/enviar" variant="secondary" className="w-full text-xs sm:w-auto">
            Ver formulario
          </ButtonLink>
        </div>
      </PanelCard>

      <div className="grid gap-2 sm:grid-cols-3">
        <MetricCard label="aguardando revisao" value={items.length} compact tone={items.length > 0 ? "alert" : "default"} />
        <MetricCard label="com vinculo" value={linkedCount} compact tone="blue" />
        <MetricCard label="sem vinculo" value={unresolvedCount} compact tone={unresolvedCount > 0 ? "yellow" : "default"} />
      </div>

      {saved ? <div className="border border-signal/35 bg-signal/8 px-4 py-3 text-sm text-paper/80">Decisao registrada com sucesso.</div> : null}
      {destino ? <div className="border border-concrete/16 bg-concrete/8 px-4 py-3 text-sm text-paper/72">Destino editorial: {destino}</div> : null}
      {error ? <div className="border border-rust/40 bg-rust/10 px-4 py-3 text-sm text-paper/80">{error}</div> : null}
      {items.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((item) => (
            <form key={item.id} action={moderateContributionAction} className="tt-panel space-y-4 border-concrete/18 p-4 sm:p-5">
              <input type="hidden" name="report_id" value={item.id} />
              <input type="hidden" name="redirect_to" value="/admin/contribuicoes" />

              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge kind="moderation" value={item.moderationStatus} />
                    <Badge tone="neutral">{getContributionTypeLabel(item.reportType)}</Badge>
                    {item.propertyId ? <Badge tone="blue">com vinculo</Badge> : <Badge tone="alert">sem vinculo</Badge>}
                  </div>
                  <h2 className="font-display text-xl uppercase tracking-[0.08em] text-paper">{item.title ?? item.content.slice(0, 60)}</h2>
                  <p className="text-xs uppercase tracking-[0.16em] text-paper/55">
                    {item.authorName || "Anonimo"}
                    {item.contact ? ` · ${item.contact}` : ""}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.16em] text-paper/45">{new Date(item.createdAt).toLocaleString("pt-BR")}</p>
              </div>

              <div className="space-y-3 text-sm text-paper/75">
                <p className="leading-6">{item.content}</p>
                {item.propertyTitle ? (
                  <p className="border border-concrete/14 bg-ink-alt/32 px-3 py-2.5 text-paper/60">
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-paper/40">Vinculo atual</span>
                    {item.propertySlug ? (
                      <Link href={`/imoveis/${item.propertySlug}`} className="text-signal transition hover:text-signal-light">
                        {item.propertyTitle}
                      </Link>
                    ) : (
                      item.propertyTitle
                    )}
                  </p>
                ) : null}
                {item.referenceHint ? (
                  <p className="border border-concrete/14 bg-ink-alt/32 px-3 py-2.5 text-paper/60">
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-paper/40">Pista</span>
                    {item.referenceHint}
                  </p>
                ) : null}
                <p className="border border-concrete/14 bg-ink-alt/32 px-3 py-2.5 text-paper/55">
                  <span className="block text-[11px] uppercase tracking-[0.18em] text-paper/40">Destino sugerido</span>
                  {getContributionEditorialDestinationLabel(item.editorialDestination ?? getDefaultEditorialDestination(item.reportType))}
                </p>
                {item.sourceUrl ? (
                  <p className="border border-concrete/14 bg-ink-alt/32 px-3 py-2.5 text-paper/60">
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-paper/40">Link</span>
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-signal transition hover:text-signal-light">
                      {item.sourceUrl}
                    </a>
                  </p>
                ) : null}
                {item.attachmentUrl ? (
                  <p className="border border-concrete/14 bg-ink-alt/32 px-3 py-2.5 text-paper/60">
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-paper/40">Anexo privado</span>
                    <a href={item.attachmentUrl} target="_blank" rel="noreferrer" className="text-signal transition hover:text-signal-light">
                      {item.attachmentName ?? "Abrir anexo"}
                    </a>
                  </p>
                ) : null}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block space-y-2 border border-concrete/14 bg-ink-alt/22 px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                  Vincular imovel para aprovacao
                  <select name="property_id" defaultValue={item.propertyId ?? ""} className="tt-input px-4 py-3 text-sm">
                    <option value="">Sem vinculo exato</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.title} - {property.neighborhoodName}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-2 border border-concrete/14 bg-ink-alt/22 px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                  Destino editorial
                  <select
                    name="editorial_destination"
                    defaultValue={item.editorialDestination ?? getDefaultEditorialDestination(item.reportType)}
                    className="tt-input px-4 py-3 text-sm"
                  >
                    <option value="relato_publico">Relato publico aprovado</option>
                    <option value="timeline">Linha do tempo</option>
                    <option value="media">Acervo de midia</option>
                  </select>
                </label>
              </div>

              <label className="block space-y-2 border border-concrete/14 bg-ink-alt/22 px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                Motivo simples para rejeicao
                <textarea
                  name="rejection_reason"
                  rows={3}
                  placeholder="Ex: anexo ilegivel, sem prova suficiente, fora do escopo, duplicado"
                  className="tt-input px-4 py-3 text-sm placeholder:text-paper/30"
                />
              </label>

              <div className="flex flex-wrap gap-3 border-t border-concrete/16 pt-4">
                <button
                  type="submit"
                  name="decision"
                  value="aprovado"
                  className="tt-button tt-button-primary text-xs"
                >
                  Aprovar
                </button>
                <button
                  type="submit"
                  name="decision"
                  value="rejeitado"
                  className="tt-button tt-button-danger text-xs"
                >
                  Rejeitar
                </button>
              </div>
            </form>
          ))}
        </div>
      ) : (
        <EmptyState
          eyebrow="fila vazia"
          title="Nenhuma contribuicao pendente"
          description="A fila de moderacao esta limpa. Quando a comunidade enviar novas pistas, fotos ou relatos, elas entram aqui para triagem manual."
          actionLabel="Ver formulario publico"
          actionHref="/enviar"
        />
      )}
      <PanelCard density="compact" eyebrow="historico" title="Ultimas decisoes editoriais" description="Leitura curta do que saiu da fila recentemente.">
        {recentModeratedItems.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recentModeratedItems.map((item) => (
              <article key={item.id} className="border border-concrete/14 bg-ink-alt/42 p-4">
                <div className="flex flex-wrap gap-2">
                  <Badge kind="moderation" value={item.moderationStatus} />
                  <Badge tone="neutral">{getContributionTypeLabel(item.reportType)}</Badge>
                  {item.propertyId ? <Badge tone="blue">com vinculo</Badge> : <Badge tone="alert">sem vinculo</Badge>}
                </div>
                <h3 className="mt-3 text-sm font-semibold uppercase tracking-[0.08em] text-paper">{item.title ?? item.content.slice(0, 60)}</h3>
                <p className="mt-2 text-sm leading-6 text-paper/70">
                  {item.moderationStatus === "rejeitado"
                    ? item.rejectionReason || "Sem motivo registrado."
                    : getContributionEditorialDestinationLabel(item.editorialDestination ?? "relato_publico")}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-paper/45">
                  {item.reviewedAt ? new Date(item.reviewedAt).toLocaleString("pt-BR") : new Date(item.createdAt).toLocaleString("pt-BR")}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            eyebrow="sem historico"
            title="Nenhuma decisao registrada"
            description="As decisoes aprovadas ou rejeitadas aparecerao aqui para consulta rapida da moderacao recente."
          />
        )}
      </PanelCard>
      <div className="flex justify-end">
        <ButtonLink href="/admin/imoveis" variant="secondary" className="text-xs">
          Ir para imoveis
        </ButtonLink>
      </div>
    </div>
  );
}
