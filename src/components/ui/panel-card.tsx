import { cn } from "@/lib/utils/cn";

interface PanelCardProps {
  children: React.ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "panel" | "card";
  density?: "default" | "compact";
  tone?: "default" | "strong" | "alert";
  className?: string;
  contentClassName?: string;
}

export function PanelCard({
  children,
  eyebrow,
  title,
  description,
  actions,
  footer,
  variant = "panel",
  density = "default",
  tone = "default",
  className,
  contentClassName,
}: PanelCardProps) {
  const hasHeader = eyebrow || title || description || actions;

  return (
    <section
      className={cn(
        variant === "card" ? "tt-card" : "tt-panel",
        tone === "strong" && "bg-steel/16 shadow-tt-panel",
        tone === "alert" && "border-signal/35 bg-signal/10 shadow-tt-signal",
        density === "compact" ? "p-3 sm:p-4" : "p-4 sm:p-5",
        className,
      )}
    >
      {hasHeader ? (
        <div className={cn("flex flex-col gap-3 border-b border-concrete/16 sm:flex-row sm:items-start sm:justify-between", density === "compact" ? "pb-3" : "pb-4")}>
          <div className={cn(density === "compact" ? "space-y-1.5" : "space-y-2")}>
            {eyebrow ? <p className="text-[11px] uppercase tracking-[0.22em] text-signal">{eyebrow}</p> : null}
            {title ? <h2 className={cn("font-display uppercase tracking-[0.08em] text-paper", density === "compact" ? "text-xl sm:text-2xl" : "text-2xl")}>{title}</h2> : null}
            {description ? <p className="max-w-2xl text-sm leading-6 text-paper/72">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
        </div>
      ) : null}
      <div className={cn(hasHeader && (density === "compact" ? "mt-3" : "mt-4"), contentClassName)}>{children}</div>
      {footer ? <div className={cn("border-t border-concrete/16", density === "compact" ? "mt-3 pt-3" : "mt-4 pt-4")}>{footer}</div> : null}
    </section>
  );
}
