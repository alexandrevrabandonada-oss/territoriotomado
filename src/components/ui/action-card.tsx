import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { getActionKindLabel } from "@/lib/data/action-kinds";
import { cn } from "@/lib/utils/cn";
import type { PropertyActionKind } from "@/types/domain";

interface ActionCardProps {
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  actionKind?: PropertyActionKind | string;
  propertyTitle?: string;
  neighborhoodName?: string;
  meta?: string;
  badges?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  children?: React.ReactNode;
  priority?: boolean;
  className?: string;
}

export function ActionCard({
  title,
  description,
  ctaHref,
  ctaLabel,
  actionKind,
  propertyTitle,
  neighborhoodName,
  meta,
  badges,
  secondaryAction,
  children,
  priority = false,
  className,
}: ActionCardProps) {
  return (
    <article className={cn("tt-card flex h-full flex-col justify-between p-4", priority && "border-signal/35 shadow-tt-signal", className)}>
      <div>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {actionKind ? <Badge kind="action" value={actionKind}>{getActionKindLabel(actionKind)}</Badge> : null}
            {badges}
            {priority ? <Badge kind="territory" value="pressao-alta">prioridade</Badge> : null}
          </div>
          {(propertyTitle || neighborhoodName) ? (
            <div className="space-y-1 text-right">
              {propertyTitle ? <p className="text-[10px] uppercase tracking-[0.18em] text-paper/52">{propertyTitle}</p> : null}
              {neighborhoodName ? <p className="text-[10px] uppercase tracking-[0.18em] text-paper/38">{neighborhoodName}</p> : null}
            </div>
          ) : null}
        </div>
        <div className="mt-3 border-y border-concrete/16 py-3">
          <h3 className="text-base font-semibold uppercase tracking-[0.08em] text-paper sm:text-lg">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-paper/74">{description}</p>
        </div>
        {meta ? <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-paper/52">{meta}</p> : null}
        {children ? <div className="mt-4">{children}</div> : null}
      </div>
      <div className="mt-4 flex flex-col gap-2 border-t border-concrete/16 pt-4 sm:flex-row sm:flex-wrap">
        <ButtonLink href={ctaHref} className="w-full sm:w-auto">
          {ctaLabel}
        </ButtonLink>
        {secondaryAction}
      </div>
    </article>
  );
}
