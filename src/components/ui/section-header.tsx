import { cn } from "@/lib/utils/cn";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  variant?: "hero" | "page" | "compact";
  size?: "default" | "compact";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  variant,
  size,
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  const resolvedVariant = variant ?? (size === "compact" ? "compact" : "page");

  return (
    <div
      className={cn(
        "relative",
        resolvedVariant === "hero" && "space-y-5",
        resolvedVariant === "page" && "space-y-4",
        resolvedVariant === "compact" && "space-y-2.5",
        align === "center" && "text-center",
        className,
      )}
    >
      <p
        className={cn(
          "inline-flex w-fit border-l-2 border-signal pl-3 font-semibold uppercase text-signal",
          resolvedVariant === "hero" && "text-xs tracking-[0.28em]",
          resolvedVariant === "page" && "text-[11px] tracking-[0.26em] sm:text-xs",
          resolvedVariant === "compact" && "text-[10px] tracking-[0.22em]",
          align === "center" && "mx-auto",
        )}
      >
        {eyebrow}
      </p>
      <div className={cn(resolvedVariant === "compact" ? "space-y-1.5" : "space-y-3")}>
        {resolvedVariant === "hero" ? (
          <h1
            className={cn(
              "max-w-4xl font-display text-5xl uppercase leading-none tracking-[0.08em] text-paper sm:text-6xl md:text-7xl",
              align === "center" && "mx-auto",
              titleClassName,
            )}
          >
            {title}
          </h1>
        ) : (
          <h2
            className={cn(
              "font-display uppercase text-paper",
              resolvedVariant === "page" && "text-3xl tracking-[0.1em] sm:text-4xl lg:text-5xl",
              resolvedVariant === "compact" && "text-2xl tracking-[0.08em] sm:text-3xl",
              titleClassName,
            )}
          >
            {title}
          </h2>
        )}
        <p
          className={cn(
            "text-paper/74",
            resolvedVariant === "hero" && "max-w-3xl text-sm leading-7 sm:text-base sm:leading-8",
            resolvedVariant === "page" && "max-w-3xl text-sm leading-7 sm:text-base",
            resolvedVariant === "compact" && "max-w-2xl text-sm leading-6",
            align === "center" && "mx-auto",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
