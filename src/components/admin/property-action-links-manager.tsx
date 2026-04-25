import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { getActionKindLabel } from "@/lib/data/action-kinds";
import type { AdminPropertyActionData } from "@/lib/data/admin-queries";
import { savePropertyActionLinksAction } from "@/lib/data/admin-actions";

interface PropertyActionLinksManagerProps {
  propertyId: string;
  propertySlug: string;
  propertyTitle: string;
  actions: AdminPropertyActionData[];
}

export function PropertyActionLinksManager({ propertyId, propertySlug, propertyTitle, actions }: PropertyActionLinksManagerProps) {
  const redirectTo = `/admin/imoveis/${propertyId}`;

  return (
    <section className="space-y-6 border border-paper/10 bg-paper/5 p-5 sm:p-6 lg:p-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-signal">ganchos de ação</p>
        <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-paper">Missão, comunidade e dossiê</h2>
        <p className="max-w-3xl text-sm leading-6 text-paper/65">
          Links opcionais para conectar a frente de {propertyTitle} com outros apps sem fundir os fluxos. O produto continua autônomo.
        </p>
      </div>

      {actions.length > 0 ? (
        <div className="space-y-5">
          {actions.map((action) => (
            <article key={action.id} className="space-y-4 border border-paper/10 bg-ink/35 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={action.isPublic ? "default" : "muted"}>{action.isPublic ? "publica" : "oculta"}</Badge>
                    <Badge tone={action.isPriority ? "critical" : "muted"}>{action.isPriority ? "prioridade" : "acao"}</Badge>
                    <Badge kind="action" value={action.kind}>{getActionKindLabel(action.kind)}</Badge>
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-paper">{action.title}</h3>
                  <p className="text-xs uppercase tracking-[0.16em] text-paper/45">{action.ctaLabel}</p>
                </div>
                <ButtonLink href={`/imoveis/${propertySlug}`} variant="secondary" className="text-xs">
                  Abrir ficha
                </ButtonLink>
              </div>

              <form action={savePropertyActionLinksAction} className="space-y-4 border-t border-paper/10 pt-4">
                <input type="hidden" name="redirect_to" value={redirectTo} />
                <input type="hidden" name="property_id" value={propertyId} />
                <input type="hidden" name="action_id" value={action.id} />
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                    Entrar na frente
                    <input
                      name="mission_url"
                      type="url"
                      defaultValue={action.missionUrl ?? ""}
                      className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal"
                      placeholder="https://..."
                    />
                  </label>
                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                    Ir para comunidade
                    <input
                      name="community_url"
                      type="url"
                      defaultValue={action.communityUrl ?? ""}
                      className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal"
                      placeholder="https://..."
                    />
                  </label>
                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                    Ver dossiê
                    <input
                      name="dossier_url"
                      type="url"
                      defaultValue={action.dossierUrl ?? ""}
                      className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal"
                      placeholder="https://..."
                    />
                  </label>
                  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
                    Referência externa
                    <input
                      name="external_reference_url"
                      type="url"
                      defaultValue={action.externalReferenceUrl ?? ""}
                      className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-signal"
                      placeholder="https://..."
                    />
                  </label>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="inline-flex items-center justify-center bg-signal px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-signal/85">
                    Salvar ganchos
                  </button>
                </div>
              </form>
            </article>
          ))}
        </div>
      ) : (
        <div className="border border-paper/10 bg-ink/35 p-4 text-sm text-paper/65">Nenhuma ação cadastrada para este imóvel.</div>
      )}
    </section>
  );
}
