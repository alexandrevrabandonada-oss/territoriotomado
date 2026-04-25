import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { getNeighborhoodName } from "@/lib/data/queries";
import { cn } from "@/lib/utils/cn";
import type { Property } from "@/types/domain";

interface PropertyCardProps {
  property: Property;
  detailHref?: string;
  mapHref?: string;
  highlighted?: boolean;
  compact?: boolean;
}

export function PropertyCard({ property, detailHref, mapHref, highlighted = false, compact = false }: PropertyCardProps) {
  const neighborhoodLabel = property.neighborhoodName ?? getNeighborhoodName(property.neighborhoodId);
  const propertyLink = detailHref ?? `/imoveis/${property.slug}`;
  const openActionCount = property.openActionCount ?? 0;
  const publicDocumentCount = property.publicDocumentCount ?? 0;
  const publicReportCount = property.publicReportCount ?? 0;
  const hasOpenAction = property.hasOpenAction ?? openActionCount > 0;
  const hasPublicProof = property.hasProof || publicDocumentCount > 0 || publicReportCount > 0;
  const proofLabel =
    publicDocumentCount > 0 ? `${publicDocumentCount} documento${publicDocumentCount > 1 ? "s" : ""}` : publicReportCount > 0 ? "relato aprovado" : "sem prova publica";
  const surfaceClassName = highlighted
    ? "border-signal/45 shadow-tt-signal"
    : property.criticality === "alta"
      ? "border-rust/28 bg-rust/6 hover:border-rust/38"
      : property.criticality === "media"
        ? "border-signal/18 bg-signal/6 hover:border-signal/26"
        : "hover:border-glass/38 hover:bg-concrete/10";

  return (
    <article
      className={cn(
        "group tt-card flex h-full flex-col justify-between transition",
        compact ? "p-4 sm:p-5" : "p-5 sm:p-6",
        surfaceClassName,
      )}
    >
      <div className={cn(compact ? "space-y-2.5" : "space-y-3")}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-glass/90">bairro</p>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/72">{neighborhoodLabel}</p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {property.isPriority ? <Badge kind="territory" value="pressao-alta">prioridade</Badge> : null}
            {highlighted ? <Badge kind="territory" value="foco-ativo">em foco</Badge> : null}
          </div>
        </div>

        <div className={cn("space-y-2 border-y border-concrete/16", compact ? "py-2.5" : "py-3")}>
          <div className="flex flex-wrap gap-2">
            <Badge kind="status" value={property.status} />
            <Badge tone={property.criticality === "alta" ? "rust" : property.criticality === "media" ? "yellow" : "blue"}>{`criticidade ${property.criticality}`}</Badge>
          </div>
          <h3 className={cn("font-display uppercase tracking-[0.08em] text-paper", compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl")}>{property.title}</h3>
          <p className={cn("text-paper/74", compact ? "text-sm leading-5" : "text-sm leading-6")}>{property.excerpt}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className={cn("border border-concrete/14 bg-ink-alt/42 px-3", compact ? "py-2" : "py-2.5")}>
            <p className="text-[10px] uppercase tracking-[0.18em] text-paper/42">acao aberta</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-paper">{hasOpenAction ? `${openActionCount} frente${openActionCount === 1 ? "" : "s"} ativa${openActionCount === 1 ? "" : "s"}` : "sem frente aberta"}</p>
          </div>
          <div className={cn("border border-concrete/14 bg-ink-alt/42 px-3", compact ? "py-2" : "py-2.5")}>
            <p className="text-[10px] uppercase tracking-[0.18em] text-paper/42">prova publica</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-paper">{hasPublicProof ? proofLabel : "sem prova publica"}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-paper/58">
          <span className={cn("border border-concrete/14 bg-concrete/9 px-3", compact ? "py-1.5" : "py-2")}>{hasOpenAction ? "mobilizacao ativa" : "sem mobilizacao aberta"}</span>
          <span className={cn("border border-concrete/14 bg-concrete/9 px-3", compact ? "py-1.5" : "py-2")}>{hasPublicProof ? "com prova ou documento" : "sem prova consolidada"}</span>
          <span className={cn("border border-concrete/14 bg-concrete/9 px-3", compact ? "py-1.5" : "py-2")}>{property.areaEstimate}</span>
        </div>
      </div>
      <div className={cn("flex flex-wrap items-center justify-between gap-3 border-t border-concrete/16", compact ? "mt-4 pt-3" : "mt-5 pt-4")}>
        <div className="text-[11px] uppercase tracking-[0.18em] text-paper/52">
          {hasOpenAction ? "frente ativa no territorio" : "ficha pronta para leitura"}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={propertyLink} className={cn("tt-button tt-button-secondary border-signal/65 bg-concrete/10 text-signal hover:border-signal hover:bg-concrete/16 hover:text-signal-light", compact ? "text-xs" : "text-sm")}>
            Abrir ficha
          </Link>
          {mapHref ? (
            <ButtonLink href={mapHref} variant="secondary" className="text-xs">
              Ver no mapa
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}
