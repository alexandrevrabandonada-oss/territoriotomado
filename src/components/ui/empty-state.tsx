import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  title: string;
  description: string;
  eyebrow?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function EmptyState({ title, description, eyebrow = "sem registro publico", actionLabel, actionHref, className }: EmptyStateProps) {
  return (
    <div className={cn("tt-panel border-dashed px-5 py-8 sm:px-8", className)}>
      <div className="mb-5 h-px max-w-28 bg-tt-alert-line" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-signal">{eyebrow}</p>
      <p className="mt-3 font-display text-2xl uppercase tracking-[0.12em] text-paper">{title}</p>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-paper/68 sm:text-base">{description}</p>
      {actionLabel && actionHref ? (
        <ButtonLink href={actionHref} className="mt-6">
          {actionLabel}
        </ButtonLink>
      ) : null}
    </div>
  );
}
